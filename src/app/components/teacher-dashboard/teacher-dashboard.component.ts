import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { ExerciseService } from '../../services/exercise.service';
import { ApiService, UsersResponse, User } from '../../services/api.service';
import { TeacherUser } from '../../models/user.model';
import { ExerciseStats } from '../../models/exercise.model';


@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentTeacher: TeacherUser | null = null;
  
  // Real data from services
  totalStudents = 0;
  totalAssignments = 0;
  exerciseStats: ExerciseStats | null = null;
  isLoadingStats = true;
  
  // Students data from API
  students: User[] = [];
  isLoadingStudents = true;
  
  // Exams data from API
  exams: any[] = [];
  isLoadingExams = true;
  

  constructor(
    private authService: AuthService,
    private exerciseService: ExerciseService,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get current teacher info
    this.currentTeacher = this.authService.getCurrentTeacher();
    
    if (!this.currentTeacher) {
      this.snackBar.open('Vui lòng đăng nhập để truy cập dashboard', 'Đóng', {
        duration: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    // Load teacher data
    this.loadTeacherData();
    
    // Load students data
    this.loadStudentsData();
    
    // Load exams data
    this.loadExamsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTeacherData(): void {
    console.log('Loading teacher data for:', this.currentTeacher?.name);
    
    // Load exercise statistics
    this.exerciseService.getExerciseStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.exerciseStats = stats;
          this.updateStatsFromExerciseData(stats);
          this.isLoadingStats = false;
          console.log('Exercise stats loaded:', stats);
        },
        error: (error) => {
          console.error('Error loading exercise stats:', error);
          this.isLoadingStats = false;
        }
      });
  }

  private updateStatsFromExerciseData(stats: ExerciseStats): void {
    // Update stats based on real exercise data
    // totalAssignments will be updated from exams API call
    
    // Student count will be updated from API call
    this.totalStudents = this.students.length;
  }

  private loadExamsData(): void {
    console.log('Loading exams data from API...');
    
    this.apiService.getTests(1, 100) // Get first 100 exams
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.exams) {
            this.exams = response.exams;
            this.totalAssignments = response.count; // Use total count from API
            this.isLoadingExams = false;
            console.log('Exams loaded successfully:', {
              totalCount: response.count,
              loadedExams: this.exams.length,
              exams: this.exams.map(e => ({ id: e.id, name: e.exam_name, status: e.status }))
            });
          } else {
            console.warn('API response indicates failure:', response);
            this.isLoadingExams = false;
          }
        },
        error: (error) => {
          console.error('Error loading exams:', error);
          this.isLoadingExams = false;
          this.snackBar.open('Không thể tải danh sách bài tập', 'Đóng', {
            duration: 3000
          });
        }
      });
  }

  private loadStudentsData(): void {
    console.log('Loading students data from API...');
    
    this.apiService.getStudents(1, 100) // Get first 100 students
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: UsersResponse) => {
          if (response.success && response.users) {
            this.students = response.users;
            this.totalStudents = response.count; // Use total count from API
            this.isLoadingStudents = false;
            console.log('Students loaded successfully:', {
              totalCount: response.count,
              loadedStudents: this.students.length,
              students: this.students.map(s => ({ id: s.id, name: s.name, username: s.username }))
            });
          } else {
            console.warn('API response indicates failure:', response);
            this.isLoadingStudents = false;
          }
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.isLoadingStudents = false;
          this.snackBar.open('Không thể tải danh sách học sinh', 'Đóng', {
            duration: 3000
          });
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Đã đăng xuất thành công', 'Đóng', {
      duration: 2000
    });
    this.router.navigate(['/']);
  }

  createExercise(): void {
    this.router.navigate(['/create-exercise']);
  }

  viewExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  manageStudents(): void {
    this.router.navigate(['/teacher/students']);
  }

  viewReports(): void {
    this.snackBar.open('Tính năng xem báo cáo sẽ được phát triển sớm', 'Đóng', {
      duration: 3000
    });
    // TODO: Navigate to reports page
  }

}