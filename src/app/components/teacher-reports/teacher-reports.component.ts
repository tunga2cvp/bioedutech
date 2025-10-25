import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TeacherHeaderComponent } from '../teacher-header/teacher-header.component';
import { ApiService, TestListItem, ExamResultsResponse, ExamResult } from '../../services/api.service';
import { ExerciseService } from '../../services/exercise.service';

export interface ExamReportData {
  exam: TestListItem;
  totalSubmissions: number;
  averageScore: number;
  averageTimeTaken: number;
  lastSubmission?: string;
  isLoading?: boolean;
}

@Component({
  selector: 'app-teacher-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    TeacherHeaderComponent
  ],
  templateUrl: './teacher-reports.component.html',
  styleUrl: './teacher-reports.component.scss'
})
export class TeacherReportsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  examReports: ExamReportData[] = [];
  filteredExamReports: ExamReportData[] = [];
  isLoading = true;
  isLoadingDetails = false;
  isProcessingReports = false;
  selectedExamId: string | number | null = null;
  selectedExamResults: ExamResult[] = [];
  selectedExamName = '';
  
  // Search
  searchTerm = '';
  private searchSubject = new Subject<string>();

  // Table columns
  displayedColumns: string[] = ['examName', 'totalSubmissions', 'averageScore', 'averageTimeTaken', 'lastSubmission', 'actions'];
  detailColumns: string[] = ['studentName', 'score', 'percentage', 'timeTaken', 'timestamp'];

  constructor(
    private apiService: ApiService,
    private exerciseService: ExerciseService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadExamReports();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadExamReports(): void {
    this.isLoading = true;
    this.isProcessingReports = false;
    
    this.exerciseService.loadExercisesFromServer()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exercises) => {
          console.log('📊 Loaded exercises for reports:', exercises);
          this.isLoading = false;
          this.isProcessingReports = true;
          this.processExamReports(exercises);
        },
        error: (error) => {
          console.error('❌ Error loading exercises for reports:', error);
          this.snackBar.open('Lỗi khi tải danh sách bài thi', 'Đóng', {
            duration: 3000
          });
          this.isLoading = false;
          this.isProcessingReports = false;
        }
      });
  }

  private processExamReports(exercises: any[]): void {
    // Initialize with loading state first
    const initialReports: ExamReportData[] = exercises.map(exercise => ({
      exam: {
        id: exercise.id,
        exam_name: exercise.title,
        created_at: exercise.createdAt || new Date().toISOString(),
        status: 'active',
        question_count: exercise.questions?.length || 0,
        max_score: exercise.maxScore || 100,
        description: exercise.description
      },
      totalSubmissions: 0,
      averageScore: 0,
      averageTimeTaken: 0,
      isLoading: true
    }));

    // Set initial data immediately
    this.examReports = initialReports;
    this.filteredExamReports = [...initialReports];
    this.isProcessingReports = false;

    // Process all exams in parallel
    const examPromises = exercises.map(exercise => this.processSingleExam(exercise));
    
    // Use Promise.allSettled to handle all promises regardless of success/failure
    Promise.allSettled(examPromises).then(results => {
      console.log('📊 All exam processing completed:', results);
    });
  }

  private async processSingleExam(exercise: any): Promise<void> {
    try {
      console.log(`📊 Processing exam ${exercise.id}: ${exercise.title}`);
      
      // Get exam results for this exam
      const results = await this.apiService.getExamResults(exercise.id).toPromise();
      
      if (results && results.success && results.results.length > 0) {
        const totalSubmissions = results.results.length;
        const averagePercentage = results.results.reduce((sum, result) => sum + result.percentage, 0) / totalSubmissions;
        const averageTimeTaken = results.results.reduce((sum, result) => sum + result.time_taken, 0) / totalSubmissions;
        
        // Get last submission timestamp
        const lastSubmission = results.results
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
          .timestamp;

        const updatedReport: ExamReportData = {
          exam: {
            id: exercise.id,
            exam_name: exercise.title,
            created_at: exercise.createdAt || new Date().toISOString(),
            status: 'active',
            question_count: exercise.questions?.length || 0,
            max_score: exercise.maxScore || 100,
            description: exercise.description
          },
          totalSubmissions,
          averageScore: Math.round(averagePercentage * 100) / 100,
          averageTimeTaken: Math.round(averageTimeTaken),
          lastSubmission,
          isLoading: false
        };

        // Update the specific exam in the array
        this.updateExamReport(exercise.id, updatedReport);
      } else {
        // No submissions - update with no data but not loading
        const updatedReport: ExamReportData = {
          exam: {
            id: exercise.id,
            exam_name: exercise.title,
            created_at: exercise.createdAt || new Date().toISOString(),
            status: 'active',
            question_count: exercise.questions?.length || 0,
            max_score: exercise.maxScore || 100,
            description: exercise.description
          },
          totalSubmissions: 0,
          averageScore: 0,
          averageTimeTaken: 0,
          isLoading: false
        };
        
        this.updateExamReport(exercise.id, updatedReport);
        console.log(`📊 No submissions for exam ${exercise.id}: ${exercise.title}`);
      }
    } catch (error) {
      console.error(`❌ Error processing exam ${exercise.id}:`, error);
      // Update with error state - not loading but no data
      const errorReport: ExamReportData = {
        exam: {
          id: exercise.id,
          exam_name: exercise.title,
          created_at: exercise.createdAt || new Date().toISOString(),
          status: 'active',
          question_count: exercise.questions?.length || 0,
          max_score: exercise.maxScore || 100,
          description: exercise.description
        },
        totalSubmissions: 0,
        averageScore: 0,
        averageTimeTaken: 0,
        isLoading: false
      };
      
      this.updateExamReport(exercise.id, errorReport);
    }
  }

  private updateExamReport(examId: string | number, updatedReport: ExamReportData): void {
    // Find and update the exam in the reports array
    const index = this.examReports.findIndex(report => report.exam.id === examId);
    if (index !== -1) {
      this.examReports[index] = updatedReport;
      // Update filtered reports if search is active
      if (this.searchTerm.trim()) {
        this.filterReports();
      } else {
        this.filteredExamReports = [...this.examReports];
      }
      console.log(`✅ Updated exam ${examId} with data:`, updatedReport);
    }
  }

  viewExamDetails(examId: string | number, examName: string): void {
    this.selectedExamId = examId;
    this.selectedExamName = examName;
    this.isLoadingDetails = true;

    this.apiService.getExamResults(examId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ExamResultsResponse) => {
          if (response.success) {
            this.selectedExamResults = response.results;
            console.log('📊 Loaded exam details:', response);
          } else {
            this.snackBar.open('Không thể tải chi tiết bài thi', 'Đóng', {
              duration: 3000
            });
          }
          this.isLoadingDetails = false;
        },
        error: (error) => {
          console.error('❌ Error loading exam details:', error);
          this.snackBar.open('Lỗi khi tải chi tiết bài thi', 'Đóng', {
            duration: 3000
          });
          this.isLoadingDetails = false;
        }
      });
  }

  closeDetails(): void {
    this.selectedExamId = null;
    this.selectedExamResults = [];
    this.selectedExamName = '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN');
  }

  formatTimeTaken(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'primary';
    if (percentage >= 60) return 'accent';
    return 'warn';
  }

  refreshReports(): void {
    this.loadExamReports();
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.filterReports();
      });
  }

  onSearchChange(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  private filterReports(): void {
    if (!this.searchTerm.trim()) {
      this.filteredExamReports = [...this.examReports];
    } else {
      this.filteredExamReports = this.examReports.filter(report =>
        report.exam.exam_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
