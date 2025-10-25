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
    // Tất cả đăng nhập đều gọi API, server sẽ trả về role
    return this.loginViaAPI(credentials);
  }

  private loginViaAPI(credentials: LoginCredentials): Observable<AuthResponse> {
    const apiCredentials: ApiLoginCredentials = {
      username: credentials.username,
      password: credentials.password
    };

    return this.apiService.loginStudent(apiCredentials).pipe(
      map((response: ApiAuthResponse) => {
        if (response.success) {
          // Tạo User object từ API response dựa trên role từ server
          let user: User;
          
          if (response.user.role === 'teacher') {
            user = {
              id: response.user.id.toString(),
              username: response.user.username,
              email: response.user.email,
              role: 'teacher',
              name: response.user.name || response.user.username,
              createdAt: new Date(),
              isActive: true,
              teacherId: response.user.teacherId || response.user.id.toString(),
              school: response.user.school || 'Trường THPT',
              subject: response.user.subject || 'Sinh học',
              phone: response.user.phone || '',
              department: response.user.department || 'Khoa học Tự nhiên',
              experience: response.user.experience || 0,
              qualifications: response.user.qualifications || [],
              isVerified: response.user.isVerified || false
            } as TeacherUser;
          } else {
            user = {
              id: response.user.id.toString(),
              username: response.user.username,
              email: response.user.email,
              role: 'student',
              name: response.user.name || response.user.username,
              createdAt: new Date(),
              isActive: true,
              grade: response.user.grade || 12,
              school: response.user.school || 'Trường THPT',
              class: response.user.class || '12A1',
              studentId: response.user.studentId || response.user.id.toString()
            } as StudentUser;
          }

          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));

          return {
            success: true,
            user: user,
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

  // Registration methods (for future implementation)
  registerStudent(studentData: any): Observable<AuthResponse> {
    // TODO: Implement student registration via API
    throw new Error('Student registration not implemented yet');
  }

  registerTeacher(teacherData: any): Observable<AuthResponse> {
    // TODO: Implement teacher registration via API
    throw new Error('Teacher registration not implemented yet');
  }
}
