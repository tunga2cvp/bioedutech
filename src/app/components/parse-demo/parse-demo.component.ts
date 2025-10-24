import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercise.service';
import { QuestionParseResult } from '../../models/exercise.model';

@Component({
  selector: 'app-parse-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="parse-demo-container">
      <h2>Demo Parse Câu Hỏi</h2>
      
      <div class="demo-section">
        <h3>Nhập câu hỏi theo format:</h3>
        <textarea 
          [(ngModel)]="questionsText" 
          placeholder="Nhập câu hỏi theo format..."
          rows="8"
          class="demo-textarea"
        ></textarea>
        
        <div class="demo-actions">
          <button (click)="parseQuestions()" class="btn btn-primary">
            Parse Câu Hỏi
          </button>
          <button (click)="loadSampleQuestions()" class="btn btn-secondary">
            Load Mẫu
          </button>
          <button (click)="clearText()" class="btn btn-outline">
            Xóa
          </button>
        </div>
      </div>

      <div *ngIf="parseResult" class="result-section">
        <h3>Kết quả parse:</h3>
        
        <div *ngIf="parseResult.errors.length > 0" class="errors">
          <h4>Lỗi:</h4>
          <ul>
            <li *ngFor="let error of parseResult.errors">{{ error }}</li>
          </ul>
        </div>
        
        <div *ngIf="parseResult.questions.length > 0" class="questions">
          <h4>Câu hỏi đã parse ({{ parseResult.questions.length }}):</h4>
          <div class="question-item" *ngFor="let question of parseResult.questions; let i = index">
            <div class="question-header">
              <strong>Câu {{ i + 1 }}:</strong> {{ question.content }}
              <span class="question-type">{{ question.type === 'single' ? 'Single Choice' : 'Multiple Choice' }}</span>
            </div>
            <div class="question-options">
              <div class="option" *ngFor="let option of question.options; let j = index">
                <span class="option-letter">{{ getOptionLetter(j) }})</span>
                <span class="option-text">{{ option.content }}</span>
                <span *ngIf="option.isCorrect" class="correct-mark">✓ (Đúng)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .parse-demo-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .demo-section {
      margin-bottom: 30px;
    }

    .demo-textarea {
      width: 100%;
      padding: 15px;
      border: 2px solid #e9ecef;
      border-radius: 6px;
      font-family: monospace;
      font-size: 14px;
      resize: vertical;
      margin-bottom: 15px;
    }

    .demo-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .result-section {
      border-top: 1px solid #e9ecef;
      padding-top: 20px;
    }

    .errors {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .errors h4 {
      color: #721c24;
      margin: 0 0 10px 0;
    }

    .errors ul {
      margin: 0;
      padding-left: 20px;
    }

    .errors li {
      color: #721c24;
      margin-bottom: 5px;
    }

    .questions {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      padding: 15px;
    }

    .questions h4 {
      color: #155724;
      margin: 0 0 15px 0;
    }

    .question-item {
      background: white;
      border: 1px solid #c3e6cb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .question-type {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .question-options {
      margin-left: 20px;
    }

    .option {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .option-letter {
      background: #6c757d;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .option-text {
      flex: 1;
    }

    .correct-mark {
      color: #28a745;
      font-weight: bold;
      font-size: 12px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-outline {
      background: transparent;
      color: #6c757d;
      border: 1px solid #6c757d;
    }

    .btn-outline:hover {
      background: #6c757d;
      color: white;
    }
  `]
})
export class ParseDemoComponent {
  questionsText = '';
  parseResult: QuestionParseResult | null = null;

  constructor(private exerciseService: ExerciseService) {}

  parseQuestions(): void {
    if (!this.questionsText.trim()) {
      this.parseResult = { questions: [], errors: ['Vui lòng nhập câu hỏi'] };
      return;
    }

    this.parseResult = this.exerciseService.parseQuestions(this.questionsText);
  }

  loadSampleQuestions(): void {
    this.questionsText = `Câu hỏi 1: Đâu là đặc điểm của tế bào nhân thực?
a) Có màng nhân
b) Không có màng nhân
c) Có màng nhân (đúng)
d) Chỉ có ở vi khuẩn

Câu hỏi 2: Chọn các bào quan có trong tế bào thực vật?
a) Lục lạp (đúng)
b) Ti thể (đúng)
c) Ribosome (đúng)
d) Trung thể

Câu hỏi 3: Quá trình quang hợp xảy ra ở đâu?
a) Lục lạp (đúng)
b) Ti thể
c) Nhân tế bào
d) Màng tế bào`;
  }

  clearText(): void {
    this.questionsText = '';
    this.parseResult = null;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }
}
