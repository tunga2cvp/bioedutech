import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, TestDetailResponse, ExamSubmissionResponse } from '../../services/api.service';
import { AIExplanationService, AIExplanationRequest, AIExplanationResponse } from '../../services/ai-explanation.service';

interface QuestionResult {
  questionIndex: number;
  question: any;
  userAnswers: number[];
  correctAnswers: number[];
  isCorrect: boolean;
  explanation?: string;
  aiExplanation?: string;
  isGettingAIExplanation?: boolean;
}

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.scss']
})
export class ExamResultComponent implements OnInit {
  exam: TestDetailResponse | null = null;
  submissionResult: ExamSubmissionResponse | null = null;
  questionResults: QuestionResult[] = [];
  isLoading = true;
  error: string | null = null;
  examId: string | null = null;
  userAnswers: number[][] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private aiExplanationService: AIExplanationService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    const answersParam = this.route.snapshot.queryParamMap.get('answers');
    
    if (this.examId && answersParam) {
      try {
        this.userAnswers = JSON.parse(answersParam);
        this.loadExamAndCompare();
      } catch (error) {
        console.error('Error parsing answers:', error);
        this.error = 'Dữ liệu câu trả lời không hợp lệ';
        this.isLoading = false;
      }
    } else {
      this.error = 'Thiếu thông tin bài thi hoặc câu trả lời';
      this.isLoading = false;
    }
  }

  loadExamAndCompare(): void {
    if (!this.examId) return;

    this.apiService.getTestDetail(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.compareAnswers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.error = 'Không thể tải thông tin bài thi';
        this.isLoading = false;
      }
    });
  }

  compareAnswers(): void {
    if (!this.exam?.questions) return;

    this.questionResults = this.exam.questions.map((question, index) => {
      const userAnswer = this.userAnswers[index] || [];
      const correctAnswer = question.correct_answers || [];
      
      // Sort arrays for comparison
      const sortedUserAnswer = [...userAnswer].sort((a, b) => a - b);
      const sortedCorrectAnswer = [...correctAnswer].sort((a, b) => a - b);
      
      const isCorrect = this.arraysEqual(sortedUserAnswer, sortedCorrectAnswer);

      return {
        questionIndex: index,
        question: question,
        userAnswers: userAnswer,
        correctAnswers: correctAnswer,
        isCorrect: isCorrect,
        explanation: question.explanation
      };
    });

    // Calculate overall result
    const correctCount = this.questionResults.filter(r => r.isCorrect).length;
    const totalQuestions = this.questionResults.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    this.submissionResult = {
      success: true,
      student_id: 1,
      test_id: parseInt(this.examId!),
      submission_id: Date.now(), // Temporary ID
      score: correctCount,
      max_score: totalQuestions,
      percentage: percentage
    };
  }

  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  getImageUrl(filename: string | null | undefined): string {
    if (!filename) return '';
    return this.apiService.getImageUrl(filename);
  }

  backToDashboard(): void {
    this.router.navigate(['/student']);
  }

  retakeExam(): void {
    if (this.examId) {
      this.router.navigate(['/student/exam', this.examId]);
    }
  }

  getScoreColor(percentage: number): string {
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-poor';
  }

  getScoreText(percentage: number): string {
    if (percentage >= 90) return 'Xuất sắc!';
    if (percentage >= 80) return 'Tốt!';
    if (percentage >= 70) return 'Khá!';
    if (percentage >= 60) return 'Đạt!';
    if (percentage >= 40) return 'Cần cố gắng!';
    return 'Cần học thêm!';
  }

  getCorrectCount(): number {
    return this.questionResults.filter(r => r.isCorrect).length;
  }

  getIncorrectCount(): number {
    return this.questionResults.filter(r => !r.isCorrect).length;
  }

  askAIExplanation(questionIndex: number): void {
    const result = this.questionResults[questionIndex];
    if (!result || result.isGettingAIExplanation) return;

    result.isGettingAIExplanation = true;

    const request: AIExplanationRequest = {
      question: result.question.content,
      answers: result.question.answers,
      correctAnswers: result.correctAnswers,
      userAnswers: result.userAnswers,
      explanation: result.explanation
    };

    this.aiExplanationService.getExplanation(request).subscribe({
      next: (response: AIExplanationResponse) => {
        result.isGettingAIExplanation = false;
        if (response.success) {
          result.aiExplanation = response.explanation;
        } else {
          console.error('AI Explanation Error:', response.error);
          // Có thể hiển thị thông báo lỗi cho user
        }
      },
      error: (error) => {
        result.isGettingAIExplanation = false;
        console.error('AI Explanation Service Error:', error);
      }
    });
  }
}
