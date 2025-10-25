import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/excel.service';
import { StudentManagementService } from '../../services/student-management.service';
import { LayoutComponent } from '../layout/layout.component';
import { StudentUser } from '../../models/user.model';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    LayoutComponent
  ],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  isQuickAdding = false;
  selectedTab = 0; // 0: Upload Excel, 1: Quick Add
  
  students: StudentUser[] = [];
  filteredStudents: StudentUser[] = [];
  searchTerm = '';
  selectedGrade = '';
  
  quickAddForm = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: 12 as 10 | 11 | 12,
    class: '',
    school: '',
    studentId: ''
  };
  
  displayedColumns: string[] = ['name', 'grade', 'class', 'school', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private excelService: ExcelService,
    private studentManagementService: StudentManagementService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStudents(): void {
    // Load students from StudentManagementService
    this.students = this.studentManagementService.getStoredStudents();
    this.filteredStudents = [...this.students];
  }

  goBack(): void {
    this.router.navigate(['/teacher']);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Check file type - accept both Excel and CSV
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv' // .csv alternative
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      this.snackBar.open('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV (.csv)', 'Đóng', {
        duration: 3000
      });
      return;
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.snackBar.open('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB', 'Đóng', {
        duration: 3000
      });
      return;
    }
    
    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFile(): void {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    
    // Use new API-integrated method
    this.excelService.registerStudentsFromExcel(this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            // Reload students from localStorage
            this.loadStudents();
            
            const message = `Đã tạo thành công ${result.created} tài khoản học sinh!`;
            this.snackBar.open(message, 'Đóng', { duration: 5000 });
            
            // Log created students for debugging
            console.log('Created students:', result.created_items);
          } else {
            this.snackBar.open(
              'Lỗi khi đăng ký học sinh. Vui lòng kiểm tra định dạng file Excel.', 
              'Đóng', 
              { duration: 5000 }
            );
          }
          
          this.selectedFile = null;
          this.isUploading = false;
        },
        error: (error) => {
          this.snackBar.open('Lỗi khi xử lý file: ' + error.message, 'Đóng', {
            duration: 3000
          });
          this.selectedFile = null;
          this.isUploading = false;
        }
      });
  }

  downloadTemplate(): void {
    this.excelService.downloadTemplate();
    this.snackBar.open('Template Excel đã được tải xuống', 'Đóng', {
      duration: 2000
    });
  }

  filterStudents(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = !this.searchTerm || 
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesGrade = !this.selectedGrade || student.grade.toString() === this.selectedGrade;
      
      return matchesSearch && matchesGrade;
    });
  }

  editStudent(student: StudentUser): void {
    this.snackBar.open(`Chỉnh sửa thông tin ${student.name}`, 'Đóng', {
      duration: 2000
    });
    // TODO: Open edit dialog
  }

  deleteStudent(student: StudentUser): void {
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh ${student.name}?`)) {
      this.studentManagementService.deleteStudent(student.id);
      this.loadStudents();
      this.snackBar.open(`Đã xóa học sinh ${student.name}`, 'Đóng', {
        duration: 2000
      });
    }
  }

  onQuickAddSubmit(): void {
    if (!this.validateQuickAddForm()) {
      return;
    }

    this.isQuickAdding = true;

    // Create new student
    const newStudent: StudentUser = {
      id: Date.now().toString(), // Simple ID generation
      username: this.quickAddForm.username,
      email: this.quickAddForm.email,
      role: 'student',
      name: this.quickAddForm.name,
      createdAt: new Date(),
      isActive: true,
      grade: this.quickAddForm.grade,
      school: this.quickAddForm.school,
      class: this.quickAddForm.class,
      studentId: this.quickAddForm.studentId,
      password: this.quickAddForm.password
    };

    // Save student
    this.studentManagementService.saveStudent(newStudent);
    
    // Reload students
    this.loadStudents();
    
    // Reset form
    this.resetQuickAddForm();
    
    this.snackBar.open(`Đã tạo tài khoản cho học sinh ${newStudent.name}`, 'Đóng', {
      duration: 3000
    });
    
    this.isQuickAdding = false;
  }

  private validateQuickAddForm(): boolean {
    if (!this.quickAddForm.name || !this.quickAddForm.username || !this.quickAddForm.email || !this.quickAddForm.password ||
        !this.quickAddForm.class || !this.quickAddForm.school || !this.quickAddForm.studentId) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    // Check password confirmation
    if (this.quickAddForm.password !== this.quickAddForm.confirmPassword) {
      this.snackBar.open('Mật khẩu xác nhận không khớp', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    // Check password length
    if (this.quickAddForm.password.length < 6) {
      this.snackBar.open('Mật khẩu phải có ít nhất 6 ký tự', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    // Check if username already exists
    if (this.studentManagementService.isUsernameExists(this.quickAddForm.username)) {
      this.snackBar.open('Tên đăng nhập đã tồn tại', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    // Check if email already exists
    if (this.studentManagementService.isEmailExists(this.quickAddForm.email)) {
      this.snackBar.open('Email đã tồn tại', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    // Check if student ID already exists
    if (this.studentManagementService.isStudentIdExists(this.quickAddForm.studentId)) {
      this.snackBar.open('Mã học sinh đã tồn tại', 'Đóng', {
        duration: 3000
      });
      return false;
    }

    return true;
  }

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

  resetQuickAddForm(): void {
    this.quickAddForm = {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      grade: 12 as 10 | 11 | 12,
      class: '',
      school: '',
      studentId: ''
    };
  }
}
