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
import { MatMenuModule } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/excel.service';
import { StudentManagementService } from '../../services/student-management.service';
import { ApiService, User } from '../../services/api.service';
import { TeacherHeaderComponent } from '../teacher-header/teacher-header.component';
import { StudentFooterComponent } from '../student-footer/student-footer.component';
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
    MatMenuModule,
    TeacherHeaderComponent,
    StudentFooterComponent
  ],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  
  students: User[] = [];
  filteredStudents: User[] = [];
  searchTerm = '';
  isLoading = false;
  
  
  displayedColumns: string[] = ['name', 'username', 'actions'];

  constructor(
    private authService: AuthService,
    private excelService: ExcelService,
    private studentManagementService: StudentManagementService,
    private apiService: ApiService,
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
    this.isLoading = true;
    
    // Load students from API
    this.apiService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Filter out teachers, only keep students
            this.students = (response.users || []).filter(user => user.role === 'student');
            this.filteredStudents = [...this.students];
            console.log('✅ Students loaded from API:', {
              count: response.count,
              students: this.students.length,
              filtered: this.students.length
            });
          } else {
            this.snackBar.open('Không thể tải danh sách học sinh', 'Đóng', {
              duration: 3000
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error loading students:', error);
          this.snackBar.open('Lỗi khi tải danh sách học sinh: ' + error.message, 'Đóng', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/teacher-dashboard']);
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
        (student.name && student.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        student.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }

  editStudent(student: User): void {
    const studentName = student.name || student.username || 'học sinh';
    this.snackBar.open(`Chỉnh sửa thông tin ${studentName}`, 'Đóng', {
      duration: 2000
    });
    // TODO: Open edit dialog
  }

  deleteStudent(student: User): void {
    const studentName = student.name || student.username || 'học sinh';
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh ${studentName}?`)) {
      this.isLoading = true;
      
      this.apiService.deleteUser(student.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              // Remove the student from the local lists
              this.students = this.students.filter(s => s.id !== student.id);
              this.filteredStudents = this.filteredStudents.filter(s => s.id !== student.id);
              
              this.snackBar.open(`Đã xóa học sinh ${studentName} thành công`, 'Đóng', {
                duration: 3000
              });
            } else {
              this.snackBar.open('Không thể xóa học sinh. Vui lòng thử lại', 'Đóng', {
                duration: 3000
              });
            }
            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ Error deleting student:', error);
            let errorMessage = 'Lỗi khi xóa học sinh';
            
            if (error.error?.statusCode === 404) {
              errorMessage = 'Không tìm thấy học sinh';
            } else if (error.error?.statusCode === 500) {
              errorMessage = 'Lỗi máy chủ khi xóa học sinh';
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            this.snackBar.open(errorMessage, 'Đóng', {
              duration: 3000
            });
            this.isLoading = false;
          }
        });
    }
  }

}
