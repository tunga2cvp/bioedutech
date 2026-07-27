import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, TestDetailResponse, ExamSubmissionRequest, ExamSubmissionResponse } from '../../services/api.service';
import { TimerService, TimerConfig } from '../../services/timer.service';
import { AuthService } from '../../services/auth.service';

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
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
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
  
  // Timer state
  timerStatus: 'idle' | 'running' | 'warning' | 'critical' = 'idle';
  showTimeUpAlert: boolean = false;
  hasShownFinalWarning: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private timerService: TimerService,
    private snackBar: MatSnackBar,
    private authService: AuthService
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
    this.timerService.stopTimer();
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
          console.log('📋 Timer from API:', exam.timer);
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
    
    // Initialize timer from API or fallback to time_limit
    this.initializeTimer();
  }

  initializeTimer(): void {
    let durationInSeconds = 0;

    // Try to get timer from API first
    if (this.exam?.timer) {
      durationInSeconds = this.timerService.parseTimerString(this.exam.timer);
      console.log(`⏱️ Timer from API: ${this.exam.timer} (${durationInSeconds} seconds)`);
    } else if (this.exam?.time_limit && this.exam.time_limit > 0) {
      // Fallback to time_limit (in minutes)
      durationInSeconds = this.exam.time_limit * 60;
      console.log(`⏱️ Timer from time_limit: ${this.exam.time_limit} minutes (${durationInSeconds} seconds)`);
    }

    // Only start timer if we have a valid duration
    if (durationInSeconds > 0) {
      this.timeRemaining = durationInSeconds;
      this.startTimer();
    }
  }

  startTimer(): void {
    const timerConfig: TimerConfig = {
      duration: this.timeRemaining,
      onTick: (secondsRemaining) => {
        this.timeRemaining = secondsRemaining;
      },
      onWarning: (secondsRemaining) => {
        console.log('⚠️ Warning: Time is running low');
        this.timerStatus = 'warning';
      },
      onCritical: (secondsRemaining) => {
        console.log('🔴 Critical: Time is almost up!');
        this.timerStatus = 'critical';
        
        // Show toast notification once when entering critical state
        if (!this.hasShownFinalWarning) {
          this.hasShownFinalWarning = true;
          this.showTimeUpNotification(secondsRemaining);
        }
      },
      onTimeUp: () => {
        console.log('⏰ Time is up! Auto-submitting exam...');
        this.timerStatus = 'idle';
        this.showTimeUpAlert = true;
        this.timeUp();
      }
    };

    this.timerService.startTimer(timerConfig);
    this.timerStatus = 'running';
  }

  showTimeUpNotification(secondsRemaining: number): void {
    const formattedTime = this.formatTime(secondsRemaining);
    const message = `⏰ Sắp hết giờ! Còn lại ${formattedTime}. Hệ thống sẽ tự động nộp bài khi hết thời gian.`;
    
    this.snackBar.open(message, '✓', {
      duration: 10000, // Show for 10 seconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['timer-toast-critical']
    });
  }

  timeUp(): void {
    this.timerService.stopTimer();
    // Auto-submit WITHOUT showing alert - directly submit
    setTimeout(() => {
      this.submitExamAuto();
    }, 100);
  }

  formatTime(seconds: number): string {
    return this.timerService.formatSeconds(seconds);
  }

  onAnswerChange(questionIndex: number, answerIndex: number, isChecked: boolean): void {
    if (!this.exam?.questions || !this.exam.questions[questionIndex]) return;
    const question = this.exam.questions[questionIndex];
    
    const answer = this.answers[questionIndex];
    const isMultipleChoice = this.isMultipleChoiceQuestion(question);
    
    if (isChecked) {
      if (isMultipleChoice) {
        // Multiple choice: Add answer if not already selected
        if (!answer.selectedAnswers.includes(answerIndex)) {
          answer.selectedAnswers.push(answerIndex);
        }
      } else {
        // Single choice: Replace previous selection
        answer.selectedAnswers = [answerIndex];
      }
    } else {
      // Remove answer
      answer.selectedAnswers = answer.selectedAnswers.filter(a => a !== answerIndex);
    }
    
    console.log(`Question ${questionIndex + 1} answers:`, answer.selectedAnswers);
  }

  isMultipleChoiceQuestion(question: any): boolean {
    // Kiểm tra nếu có nhiều hơn 1 đáp án đúng
    return question.correct_answers && question.correct_answers.length > 1;
  }

  onInputChange(questionIndex: number, answerIndex: number, event: Event): void {
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
    
    this.performSubmission();
  }

  submitExamAuto(): void {
    if (this.isSubmitting || !this.examId) return;
    this.performSubmission();
  }

  performSubmission(): void {
    this.isSubmitting = true;
    this.timerService.stopTimer();
    
    // Calculate time taken
    const timeTaken = this.examStartTime ? 
      Math.floor((new Date().getTime() - this.examStartTime.getTime()) / 1000) : 0;
    
    // Get student ID from auth service
    const currentStudent = this.authService.getCurrentStudent();
    const studentId = currentStudent ? (typeof currentStudent.id === 'number' ? currentStudent.id : parseInt(currentStudent.id)) : 1; // Fallback to 1 if not found
    
    // Prepare submission data according to API spec
    const submissionData: ExamSubmissionRequest = {
      student_id: studentId,
      answers: this.answers.map(answer => answer.selectedAnswers),
      time_taken: timeTaken
    };
    
    console.log('Submitting exam:', submissionData);
    
    // Ensure examId is not null
    if (!this.examId) {
      this.isSubmitting = false;
      this.error = 'Exam ID không hợp lệ';
      return;
    }
    
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
      this.timerService.stopTimer();
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
