import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ApiService, TestCreationRequest, TestListResponse } from '../../services/api.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  template: `
    <div class="api-test-container">
      <h2>API Test - /tests Endpoint</h2>
      <div class="button-group">
        <button (click)="testCreateTest()" [disabled]="isLoading">
          {{ isLoading ? 'Đang tạo bài thi...' : 'Test Tạo Bài Thi' }}
        </button>
        <button (click)="testGetTests()" [disabled]="isLoading">
          {{ isLoading ? 'Đang lấy danh sách...' : 'Test Lấy Danh Sách' }}
        </button>
      </div>
      <div *ngIf="result" class="result">
        <h3>Kết quả:</h3>
        <pre>{{ result | json }}</pre>
      </div>
      <div *ngIf="error" class="error">
        <h3>Lỗi:</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .api-test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .button-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .result, .error {
      margin-top: 20px;
      padding: 15px;
      border-radius: 4px;
    }
    .result {
      background: #d4edda;
      border: 1px solid #c3e6cb;
    }
    .error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
    }
    pre {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class ApiTestComponent {
  isLoading = false;
  result: any = null;
  error: string = '';

  constructor(private apiService: ApiService) {}

  testCreateTest(): void {
    this.isLoading = true;
    this.result = null;
    this.error = '';

    const testData: TestCreationRequest = {
      exam_name: "Bài kiểm tra Sinh học lớp 10",
      questions: [
        {
          content: "Tế bào là đơn vị cơ bản của sự sống?",
          answers: ["Đúng", "Sai"],
          correct_answers: [0], // Index của đáp án đúng
          image: undefined
        },
        {
          content: "Các thành phần chính của tế bào bao gồm:",
          answers: ["Màng tế bào", "Tế bào chất", "Nhân tế bào", "Vỏ tế bào"],
          correct_answers: [0, 1, 2], // Các index của đáp án đúng
          image: undefined
        }
      ]
    };

    this.apiService.createTest(testData).subscribe({
      next: (response) => {
        this.result = response;
        this.isLoading = false;
        console.log('API Test Success:', response);
      },
      error: (error) => {
        this.error = error.message || 'Unknown error';
        this.isLoading = false;
        console.error('API Test Error:', error);
      }
    });
  }

  testGetTests(): void {
    this.isLoading = true;
    this.result = null;
    this.error = '';

    this.apiService.getTests(1, 10).subscribe({
      next: (response) => {
        this.result = response;
        this.isLoading = false;
        console.log('API Test Success:', response);
      },
      error: (error) => {
        this.error = error.message || 'Unknown error';
        this.isLoading = false;
        console.error('API Test Error:', error);
      }
    });
  }
}
