import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="test-container">
      <mat-card class="test-card">
        <mat-card-header>
          <mat-card-title>Test Login Flow</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="test-buttons">
            <button mat-raised-button color="primary" (click)="testTeacherLogin()">
              Test Teacher Login (Fixed)
            </button>
            
            <button mat-raised-button color="accent" (click)="testStudentLogin()">
              Test Student Login (API)
            </button>
            
            <button mat-raised-button color="warn" (click)="testInvalidLogin()">
              Test Invalid Login
            </button>
          </div>
          
          <div class="test-results" *ngIf="lastResult">
            <h3>Last Test Result:</h3>
            <pre>{{ lastResult | json }}</pre>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .test-card {
      margin-bottom: 20px;
    }
    
    .test-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .test-results {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    pre {
      background-color: #fff;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class LoginTestComponent {
  lastResult: any = null;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  testTeacherLogin(): void {
    const credentials: LoginCredentials = {
      username: 'giaovien',
      password: '123456',
      role: 'teacher'
    };

    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.lastResult = result;
        this.snackBar.open('Teacher login test completed', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.lastResult = { error: error.message };
        this.snackBar.open('Teacher login test failed', 'Close', { duration: 2000 });
      }
    });
  }

  testStudentLogin(): void {
    const credentials: LoginCredentials = {
      username: 'teststudent',
      password: 'testpass',
      role: 'student'
    };

    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.lastResult = result;
        this.snackBar.open('Student login test completed', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.lastResult = { error: error.message };
        this.snackBar.open('Student login test failed', 'Close', { duration: 2000 });
      }
    });
  }

  testInvalidLogin(): void {
    const credentials: LoginCredentials = {
      username: 'invalid',
      password: 'invalid',
      role: 'student'
    };

    this.authService.login(credentials).subscribe({
      next: (result) => {
        this.lastResult = result;
        this.snackBar.open('Invalid login test completed', 'Close', { duration: 2000 });
      },
      error: (error) => {
        this.lastResult = { error: error.message };
        this.snackBar.open('Invalid login test failed', 'Close', { duration: 2000 });
      }
    });
  }
}
