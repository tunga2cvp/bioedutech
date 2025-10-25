import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, TestListItem, TestListResponse } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  exams: TestListItem[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getTests(this.currentPage, this.itemsPerPage).subscribe({
      next: (response: TestListResponse) => {
        this.exams = response.exams || [];
        this.totalPages = Math.ceil((response.count || 0) / this.itemsPerPage);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Có lỗi xảy ra khi tải danh sách bài thi';
        this.loading = false;
        console.error('Error loading exams:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadExams();
  }

  onExamClick(exam: TestListItem): void {
    // Navigate to exam detail or start exam
    this.router.navigate(['/student/exam', exam.id]);
  }

  startExam(exam: TestListItem): void {
    if (this.canTakeExam(exam)) {
      // Navigate to take exam page
      this.router.navigate(['/student/exam', exam.id]);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  getStatusText(status: string): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'active':
        return 'Đang mở';
      case 'inactive':
        return 'Đã đóng';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  }

  canTakeExam(exam: TestListItem): boolean {
    // Mặc định cho phép làm bài nếu không có status hoặc status là 'active'
    return !exam.status || exam.status.toLowerCase() === 'active';
  }
}
