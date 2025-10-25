import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  userRole: 'teacher' | 'student' = 'student';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.snackBar.open('Vui lòng nhập đầy đủ thông tin', 'Đóng', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.isLoading = true;
    
    const credentials: LoginCredentials = {
      username: this.username,
      password: this.password,
      role: this.userRole
    };
    
    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.isLoading = false;
        
        if (result.success) {
          this.snackBar.open(result.message || 'Đăng nhập thành công!', 'Đóng', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          // Navigate based on role
          if (this.userRole === 'teacher') {
            this.router.navigate(['/teacher']);
          } else {
            this.router.navigate(['/student']);
          }
        } else {
          this.snackBar.open(result.message || 'Tên đăng nhập hoặc mật khẩu không đúng', 'Đóng', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.message || 'Có lỗi xảy ra khi đăng nhập', 'Đóng', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
