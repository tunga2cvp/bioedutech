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
import { TeacherUser } from '../../models/user.model';
import { ExerciseStats } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
}

interface ClassInfo {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  assignmentCount: number;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    LayoutComponent
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
  totalQuizzes = 0;
  averageScore = 0;
  exerciseStats: ExerciseStats | null = null;
  isLoadingStats = true;
  
  recentActivities: Activity[] = [
    {
      icon: 'assignment_turned_in',
      title: 'Bài tập mới được nộp',
      description: 'Lớp 12A1 - Bài tập về Di truyền học',
      time: '2 giờ trước'
    },
    {
      icon: 'quiz',
      title: 'Đề thi trắc nghiệm đã tạo',
      description: 'Đề thi giữa kỳ - Chương 3: Sinh sản',
      time: '1 ngày trước'
    },
    {
      icon: 'group_add',
      title: 'Học sinh mới tham gia',
      description: 'Nguyễn Văn A đã tham gia lớp 12A1',
      time: '2 ngày trước'
    },
    {
      icon: 'assessment',
      title: 'Báo cáo điểm số',
      description: 'Điểm trung bình lớp 12A1: 8.5/10',
      time: '3 ngày trước'
    }
  ];
  
  teacherClasses: ClassInfo[] = [
    {
      id: '1',
      name: 'Lớp 12A1',
      grade: 12,
      studentCount: 25,
      assignmentCount: 8
    },
    {
      id: '2',
      name: 'Lớp 12A2',
      grade: 12,
      studentCount: 20,
      assignmentCount: 6
    },
    {
      id: '3',
      name: 'Lớp 11B1',
      grade: 11,
      studentCount: 22,
      assignmentCount: 5
    }
  ];

  constructor(
    private authService: AuthService,
    private exerciseService: ExerciseService,
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
    this.totalAssignments = stats.totalExercises;
    this.totalQuizzes = stats.publishedExercises;
    
    // Calculate average score (mock for now, would need submission data)
    this.averageScore = stats.totalExercises > 0 ? Math.round(85 + Math.random() * 10) : 0;
    
    // Student count would come from student management API
    // For now, keep mock data
    this.totalStudents = 45;
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

  viewClass(classId: string): void {
    this.snackBar.open(`Xem chi tiết lớp ${classId}`, 'Đóng', {
      duration: 2000
    });
    // TODO: Navigate to class detail page
  }

  manageClass(classId: string): void {
    this.snackBar.open(`Quản lý lớp ${classId}`, 'Đóng', {
      duration: 2000
    });
    // TODO: Navigate to class management page
  }
}