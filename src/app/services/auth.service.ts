import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, TeacherUser, StudentUser, LoginCredentials, AuthResponse } from '../models/user.model';
import { ApiService, LoginCredentials as ApiLoginCredentials, ApiAuthResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) { }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (credentials.role === 'teacher') {
      // Fixed teacher account - không gọi API
      if (credentials.username === 'giaovien' && credentials.password === '123456') {
        const user: TeacherUser = {
          id: '1',
          username: 'giaovien',
          email: 'giaovien@school.edu.vn',
          role: 'teacher',
          name: 'Cô Thảo',
          createdAt: new Date(),
          isActive: true,
          teacherId: 'T001',
          school: 'Trường THPT Mẫu',
          subject: 'Sinh học',
          phone: '0123456789',
          department: 'Khoa học Tự nhiên',
          experience: 5,
          qualifications: ['Thạc sĩ Sinh học', 'Chứng chỉ Sư phạm'],
          isVerified: true
        };
        
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return of({
          success: true,
          user: user,
          token: 'mock-jwt-token',
          message: 'Đăng nhập thành công'
        });
      } else {
        return of({
          success: false,
          message: 'Tài khoản giáo viên không tồn tại. Vui lòng sử dụng username: giaovien và password: 123456'
        });
      }
    } else {
      // Student accounts - gọi API
      return this.loginStudentViaAPI(credentials);
    }
  }

  private loginStudentViaAPI(credentials: LoginCredentials): Observable<AuthResponse> {
    const apiCredentials: ApiLoginCredentials = {
      username: credentials.username,
      password: credentials.password
    };

    return this.apiService.loginStudent(apiCredentials).pipe(
      map((response: ApiAuthResponse) => {
        if (response.success) {
          // Tạo StudentUser object từ API response
          const studentUser: StudentUser = {
            id: response.user.id.toString(),
            username: response.user.username,
            email: response.user.email,
            role: 'student',
            name: response.user.username, // Fallback name
            createdAt: new Date(),
            isActive: true,
            grade: 12, // Default grade, có thể cập nhật từ API
            school: 'Trường THPT Mẫu', // Default school
            class: '12A1', // Default class
            studentId: response.user.id.toString()
          };

          this.currentUserSubject.next(studentUser);
          localStorage.setItem('currentUser', JSON.stringify(studentUser));

          return {
            success: true,
            user: studentUser,
            token: 'api-jwt-token',
            message: 'Đăng nhập thành công'
          };
        } else {
          return {
            success: false,
            message: response.message || 'Đăng nhập thất bại'
          };
        }
      }),
      catchError((error) => {
        console.error('API login error:', error);
        return of({
          success: false,
          message: error.message || 'Lỗi kết nối API. Vui lòng thử lại sau.'
        });
      })
    );
  }

  // Backward compatibility method - deprecated, use login() instead
  loginLegacy(username: string, password: string, role: 'teacher' | 'student'): boolean {
    const credentials: LoginCredentials = { username, password, role };
    let result: AuthResponse = { success: false, message: 'Error' };
    
    this.login(credentials).subscribe({
      next: (response) => {
        result = response;
      },
      error: (error) => {
        result = { success: false, message: error.message };
      }
    });
    
    return result.success;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentTeacher(): TeacherUser | null {
    const user = this.currentUserSubject.value;
    return user?.role === 'teacher' ? user as TeacherUser : null;
  }

  getCurrentStudent(): StudentUser | null {
    const user = this.currentUserSubject.value;
    return user?.role === 'student' ? user as StudentUser : null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isTeacher(): boolean {
    return this.currentUserSubject.value?.role === 'teacher';
  }

  isStudent(): boolean {
    return this.currentUserSubject.value?.role === 'student';
  }

  // Check if user is logged in from localStorage on app init
  checkStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Convert date strings back to Date objects
        if (user.createdAt) {
          user.createdAt = new Date(user.createdAt);
        }
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Student management methods
  getStoredStudents(): StudentUser[] {
    const stored = localStorage.getItem('students');
    if (stored) {
      try {
        const students = JSON.parse(stored);
        return students.map((student: any) => ({
          ...student,
          createdAt: new Date(student.createdAt)
        }));
      } catch (error) {
        console.error('Error parsing stored students:', error);
        return [];
      }
    }
    return [];
  }

  saveStudent(student: StudentUser): void {
    const students = this.getStoredStudents();
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
  }

  saveStudents(students: StudentUser[]): void {
    const existingStudents = this.getStoredStudents();
    const allStudents = [...existingStudents, ...students];
    localStorage.setItem('students', JSON.stringify(allStudents));
  }

  updateStudent(updatedStudent: StudentUser): void {
    const students = this.getStoredStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      localStorage.setItem('students', JSON.stringify(students));
    }
  }

  deleteStudent(studentId: string): void {
    const students = this.getStoredStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(filteredStudents));
  }

  // Registration methods (for future implementation)
  registerStudent(studentData: any): Observable<AuthResponse> {
    // TODO: Implement student registration
    throw new Error('Student registration not implemented yet');
  }

  registerTeacher(teacherData: any): Observable<AuthResponse> {
    // TODO: Implement teacher registration
    throw new Error('Teacher registration not implemented yet');
  }
}
