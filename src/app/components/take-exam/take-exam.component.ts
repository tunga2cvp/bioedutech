import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, TestDetailResponse, ExamSubmissionRequest, ExamSubmissionResponse } from '../../services/api.service';

interface ExamAnswer {
  questionId: number;
  selectedAnswers: number[];
}

// Helper function to get option letter
export function getOptionLetter(index: number): string {
  return String.fromCharCode(97 + index);
}

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.scss']
})
export class TakeExamComponent implements OnInit, OnDestroy {
  exam: TestDetailResponse | null = null;
  isLoading = true;
  error: string | null = null;
  examId: string | null = null;
  
  // Exam state
  answers: ExamAnswer[] = [];
  currentQuestionIndex = 0;
  timeRemaining: number = 0;
  timer: any = null;
  isSubmitting = false;
  examStartTime: Date | null = null;
  submissionResult: ExamSubmissionResponse | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    console.log('TakeExamComponent ngOnInit - Exam ID:', this.examId);
    
    if (this.examId) {
      this.loadExam(this.examId);
    } else {
      console.error('No exam ID provided');
      this.router.navigate(['/student']);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadExam(examId: string): void {
    console.log('=== LOADING EXAM FOR TAKING ===');
    console.log('Exam ID:', examId);
    
    this.apiService.getTestDetail(examId).subscribe({
      next: (exam) => {
        console.log('📥 Exam data received:', exam);
        if (exam) {
          this.exam = exam;
          this.initializeExam();
          console.log('✅ Exam loaded successfully:', exam.exam_name);
          console.log('✅ Questions count:', exam.questions?.length || 0);
        } else {
          console.log('⚠️ No exam returned from server');
          this.error = 'Không tìm thấy bài thi';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Failed to load exam:', error);
        this.error = 'Có lỗi xảy ra khi tải bài thi';
        this.isLoading = false;
      }
    });
  }

  initializeExam(): void {
    if (!this.exam || !this.exam.questions) return;
    
    // Record exam start time
    this.examStartTime = new Date();
    
    // Initialize answers array
    this.answers = this.exam.questions.map((question, index) => ({
      questionId: question.question_id ? parseInt(question.question_id) : index,
      selectedAnswers: []
    }));
    
    // Initialize timer if time limit exists
    if (this.exam.time_limit && this.exam.time_limit > 0) {
      this.timeRemaining = this.exam.time_limit * 60; // Convert minutes to seconds
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  timeUp(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    alert('Hết thời gian làm bài! Bài thi sẽ được tự động nộp.');
    this.submitExam();
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  onAnswerChange(questionIndex: number, answerIndex: number, isChecked: boolean): void {
    if (!this.exam?.questions || !this.exam.questions[questionIndex]) return;
    const question = this.exam.questions[questionIndex];
    
    const answer = this.answers[questionIndex];
    
    if (isChecked) {
      // Add answer if not already selected
      if (!answer.selectedAnswers.includes(answerIndex)) {
        answer.selectedAnswers.push(answerIndex);
      }
    } else {
      // Remove answer
      answer.selectedAnswers = answer.selectedAnswers.filter(a => a !== answerIndex);
    }
    
    console.log(`Question ${questionIndex + 1} answers:`, answer.selectedAnswers);
  }

  onCheckboxChange(questionIndex: number, answerIndex: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onAnswerChange(questionIndex, answerIndex, target?.checked || false);
  }

  isAnswerSelected(questionIndex: number, answerIndex: number): boolean {
    return this.answers[questionIndex]?.selectedAnswers.includes(answerIndex) || false;
  }

  nextQuestion(): void {
    if (this.exam?.questions && this.currentQuestionIndex < this.exam.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    if (this.exam?.questions && index >= 0 && index < this.exam.questions.length) {
      this.currentQuestionIndex = index;
    }
  }

  submitExam(): void {
    if (this.isSubmitting || !this.examId) return;
    
    const confirmSubmit = confirm('Bạn có chắc chắn muốn nộp bài thi? Sau khi nộp, bạn không thể thay đổi câu trả lời.');
    if (!confirmSubmit) return;
    
    this.isSubmitting = true;
    
    // Calculate time taken
    const timeTaken = this.examStartTime ? 
      Math.floor((new Date().getTime() - this.examStartTime.getTime()) / 1000) : 0;
    
    // Prepare submission data according to API spec
    const submissionData: ExamSubmissionRequest = {
      student_id: 1, // TODO: Get actual student ID from auth service
      answers: this.answers.map(answer => answer.selectedAnswers),
      time_taken: timeTaken
    };
    
    console.log('Submitting exam:', submissionData);
    
    this.apiService.submitExam(this.examId, submissionData).subscribe({
      next: (response: ExamSubmissionResponse) => {
        console.log('✅ Exam submitted successfully:', response);
        this.submissionResult = response;
        this.isSubmitting = false;
        
        // Show result dialog
        this.showSubmissionResult(response);
      },
      error: (error) => {
        console.error('❌ Exam submission failed:', error);
        this.isSubmitting = false;
        this.error = 'Có lỗi xảy ra khi nộp bài thi. Vui lòng thử lại.';
      }
    });
  }

  showSubmissionResult(result: ExamSubmissionResponse): void {
    // Navigate to result page with answers data
    const answersParam = JSON.stringify(this.answers.map(answer => answer.selectedAnswers));
    this.router.navigate(['/student/exam-result', this.examId], {
      queryParams: { answers: answersParam }
    });
  }

  backToDashboard(): void {
    const confirmLeave = confirm('Bạn có chắc chắn muốn rời khỏi bài thi? Tiến trình hiện tại sẽ bị mất.');
    if (confirmLeave) {
      this.router.navigate(['/student']);
    }
  }

  getAnsweredQuestionsCount(): number {
    return this.answers.filter(answer => answer.selectedAnswers.length > 0).length;
  }

  getTotalQuestions(): number {
    return this.exam?.questions?.length || 0;
  }

  getImageUrl(filename: string | null | undefined): string {
    if (!filename) return '';
    return this.apiService.getImageUrl(filename);
  }

  // Helper method for template
  getOptionLetter(index: number): string {
    return getOptionLetter(index);
  }
}
