import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StudentUser, StudentRegistrationData } from '../models/user.model';
import { AuthService } from './auth.service';
import { StudentManagementService } from './student-management.service';
import { ApiService, ExcelRegistrationResponse } from './api.service';
import * as XLSX from 'xlsx';

export interface ExcelParseResult {
  success: boolean;
  students: StudentUser[];
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private authService: AuthService,
    private studentManagementService: StudentManagementService,
    private apiService: ApiService
  ) { }

  /**
   * Parse Excel file and extract student data
   * @param file Excel file to parse
   * @returns Observable with parse result
   */
  parseStudentExcel(file: File): Observable<ExcelParseResult> {
    return new Observable(observer => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Process data
          const result = this.processExcelData(jsonData);
          observer.next(result);
          observer.complete();
        } catch (error) {
          observer.next({
            success: false,
            students: [],
            errors: ['Lỗi khi xử lý file: ' + (error as Error).message]
          });
          observer.complete();
        }
      };
      
      reader.onerror = () => {
        observer.next({
          success: false,
          students: [],
          errors: ['Lỗi khi đọc file']
        });
        observer.complete();
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Process Excel data and convert to students
   */
  private processExcelData(jsonData: any[]): ExcelParseResult {
    if (!jsonData || jsonData.length < 2) {
      return {
        success: false,
        students: [],
        errors: ['File không chứa dữ liệu hoặc thiếu header']
      };
    }

    // Get headers from first row
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1);

    // Convert rows to objects
    const data = dataRows.map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    // Validate data
    const validation = this.validateStudentData(data);
    if (!validation.isValid) {
      return {
        success: false,
        students: [],
        errors: validation.errors
      };
    }

    // Convert to students
    const students = this.convertToStudents(data);
    
    // Save students to localStorage
    this.studentManagementService.saveStudents(students);

    return {
      success: true,
      students: students,
      errors: []
    };
  }

  /**
   * Simulate Excel parsing - fallback method
   */
  private simulateExcelParsing(file: File): ExcelParseResult {
    // Simulate processing delay and create real students
    const mockData = [
      { name: 'Nguyễn Văn An', username: 'an.nguyen', email: 'an.nguyen@student.edu.vn', password: '123456', grade: 12, class: '12A1', school: 'Trường THPT Mẫu', studentId: 'S001' },
      { name: 'Trần Thị Bình', username: 'binh.tran', email: 'binh.tran@student.edu.vn', password: '123456', grade: 12, class: '12A1', school: 'Trường THPT Mẫu', studentId: 'S002' },
      { name: 'Lê Văn Cường', username: 'cuong.le', email: 'cuong.le@student.edu.vn', password: '123456', grade: 11, class: '11B1', school: 'Trường THPT Mẫu', studentId: 'S003' }
    ];

    const students = this.convertToStudents(mockData);
    
    // Save students to localStorage
    this.studentManagementService.saveStudents(students);

    return {
      success: true,
      students: students,
      errors: []
    };
  }

  /**
   * Validate student data from Excel
   */
  validateStudentData(data: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || data.length === 0) {
      errors.push('File Excel không chứa dữ liệu');
      return { isValid: false, errors };
    }

    const requiredFields = ['name', 'username', 'email', 'password', 'grade', 'class', 'school', 'studentId'];
    
    data.forEach((row, index) => {
      const rowNum = index + 2; // Excel row number (assuming header is row 1)
      
      // Check if row has any data - skip completely empty rows
      const hasData = requiredFields.some(field => 
        row[field] && row[field].toString().trim() !== ''
      );
      
      if (!hasData) {
        return; // Skip empty rows
      }
      
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Dòng ${rowNum}: Thiếu thông tin ${this.getFieldDisplayName(field)}`);
        }
      });

      // Validate email format
      if (row.email && !this.isValidEmail(row.email)) {
        errors.push(`Dòng ${rowNum}: Email không đúng định dạng`);
      }

      // Validate grade
      if (row.grade && ![10, 11, 12].includes(parseInt(row.grade))) {
        errors.push(`Dòng ${rowNum}: Lớp phải là 10, 11 hoặc 12`);
      }

      // Validate password length
      if (row.password && row.password.toString().length < 6) {
        errors.push(`Dòng ${rowNum}: Mật khẩu phải có ít nhất 6 ký tự`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert Excel data to StudentUser objects
   */
  convertToStudents(data: any[]): StudentUser[] {
    const requiredFields = ['name', 'username', 'email', 'password', 'grade', 'class', 'school', 'studentId'];
    
    return data
      .filter(row => {
        // Only process rows that have data
        return requiredFields.some(field => 
          row[field] && row[field].toString().trim() !== ''
        );
      })
      .map((row, index) => {
        const grade = parseInt(row.grade);
        const validGrade = (grade === 10 || grade === 11 || grade === 12) ? grade as 10 | 11 | 12 : 12;
        
        return {
          id: (index + 1).toString(),
          username: row.username || this.generateUsername(row.name), // Use username from Excel or generate
          email: row.email,
          role: 'student' as const,
          name: row.name,
          createdAt: new Date(),
          isActive: true,
          grade: validGrade,
          school: row.school,
          class: row.class,
          studentId: row.studentId,
          password: row.password // Store password from Excel
        } as StudentUser & { password: string };
      });
  }

  /**
   * Generate username from name
   */
  private generateUsername(name: string): string {
    const normalizedName = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '') // Remove spaces
      .substring(0, 10); // Limit length
    
    return `student${normalizedName}${Math.floor(Math.random() * 1000)}`;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get field display name for error messages
   */
  private getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Họ tên',
      username: 'Tên đăng nhập',
      email: 'Email',
      password: 'Mật khẩu',
      grade: 'Lớp',
      class: 'Lớp học',
      school: 'Trường học',
      studentId: 'Mã học sinh'
    };
    return fieldNames[field] || field;
  }

  /**
   * Register students via API by uploading Excel file directly
   * @param file Excel file to upload
   * @returns Observable with registration result
   */
  registerStudentsFromExcel(file: File): Observable<ExcelRegistrationResponse> {
    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.xlsm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return of({
        success: false,
        created: 0,
        created_items: []
      });
    }

    // Call API directly with file
    return this.apiService.registerStudentsExcel(file);
  }

  /**
   * Download Excel template from API
   */
  downloadTemplate(): void {
    this.apiService.downloadExcelTemplate().subscribe({
      next: (blob: Blob) => {
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'student_template.xlsx';
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
      },
      error: (error) => {
        console.error('Error downloading template from API:', error);
        // Fallback to local template generation
        this.downloadLocalTemplate();
      }
    });
  }

  /**
   * Fallback method to generate template locally if API fails
   */
  private downloadLocalTemplate(): void {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Prepare data - API only requires 3 columns: name, username, password
    const headers = ['name', 'username', 'password'];
    const sampleData = [
      ['Nguyễn Văn An', 'an.nguyen', '123456'],
      ['Trần Thị Bình', 'binh.tran', '123456'],
      ['Lê Văn Cường', 'cuong.le', '123456']
    ];
    
    // Create worksheet data
    const wsData = [headers, ...sampleData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Create and download file
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student_template.xlsx';
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
  }


  /**
   * Generate CSV template content
   */
  private generateTemplateCSV(): string {
    const headers = ['name', 'username', 'email', 'password', 'grade', 'class', 'school', 'studentId'];
    const sampleData = [
      ['Nguyễn Văn An', 'an.nguyen', 'an.nguyen@student.edu.vn', '123456', '12', '12A1', 'Trường THPT Mẫu', 'S001'],
      ['Trần Thị Bình', 'binh.tran', 'binh.tran@student.edu.vn', '123456', '12', '12A1', 'Trường THPT Mẫu', 'S002'],
      ['Lê Văn Cường', 'cuong.le', 'cuong.le@student.edu.vn', '123456', '11', '11B1', 'Trường THPT Mẫu', 'S003']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }
}
