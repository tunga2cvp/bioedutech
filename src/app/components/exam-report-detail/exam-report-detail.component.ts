import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ExamResultsResponse, ReportStats, ScoreDistribution } from '../../models/report.model';
import { TeacherHeaderComponent } from '../teacher-header/teacher-header.component';

@Component({
  selector: 'app-exam-report-detail',
  standalone: true,
  imports: [CommonModule, TeacherHeaderComponent],
  templateUrl: './exam-report-detail.component.html',
  styleUrl: './exam-report-detail.component.scss'
})
export class ExamReportDetailComponent implements OnInit {
  examId: number = 0;
  examTitle: string = '';
  results: ExamResultsResponse | null = null;
  stats: ReportStats | null = null;
  scoreDistribution: ScoreDistribution[] = [];
  topPerformers: any[] = [];
  recentSubmissions: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.examId = +params['examId'];
      this.loadExamReport();
    });
  }

  loadExamReport(): void {
    this.isLoading = true;
    this.error = null;

    this.reportService.getExamResults(this.examId).subscribe({
      next: (response) => {
        this.results = response;
        this.stats = this.reportService.calculateReportStats(response.results);
        this.scoreDistribution = this.reportService.calculateScoreDistribution(response.results);
        this.topPerformers = this.reportService.getTopPerformers(response.results);
        this.recentSubmissions = this.reportService.getRecentSubmissions(response.results);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam report:', error);
        this.error = 'Không thể tải báo cáo bài thi. Vui lòng thử lại.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/exercise-list']);
  }

  refreshReport(): void {
    this.loadExamReport();
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString('vi-VN');
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 70) return '#8BC34A';
    if (percentage >= 50) return '#FFC107';
    return '#F44336';
  }

  getGradeText(percentage: number): string {
    if (percentage >= 90) return 'Xuất sắc';
    if (percentage >= 80) return 'Giỏi';
    if (percentage >= 70) return 'Khá';
    if (percentage >= 50) return 'Trung bình';
    return 'Yếu';
  }
}
