import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, TestListItem, TestListResponse } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  exams: TestListItem[] = [];
  filteredExams: TestListItem[] = [];
  paginatedExams: TestListItem[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  searchText = '';

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

    this.apiService.getTests(1, 1000).subscribe({
      next: (response: TestListResponse) => {
        this.exams = response.exams || [];
        this.filteredExams = [...this.exams];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Có lỗi xảy ra khi tải danh sách bài thi';
        this.loading = false;
        console.error('Error loading exams:', error);
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    if (this.searchText.trim() === '') {
      this.filteredExams = [...this.exams];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredExams = this.exams.filter(exam =>
        exam.exam_name?.toLowerCase().includes(searchLower)
      );
    }
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchText = '';
    this.onSearchChange();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredExams.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedExams = this.filteredExams.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onExamClick(exam: TestListItem): void {
    this.router.navigate(['/student/exam', exam.id]);
  }

  startExam(exam: TestListItem): void {
    if (this.canTakeExam(exam)) {
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
    return !exam.status || exam.status.toLowerCase() === 'active';
  }
}
