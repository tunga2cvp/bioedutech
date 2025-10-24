import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { Exercise } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-view-exercise',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {
  exercise: Exercise | null = null;
  isLoading = true;
  currentQuestionIndex = 0;
  userAnswers: { [questionId: string]: string[] } = {};
  isSubmitted = false;
  score = 0;
  totalQuestions = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    const exerciseId = this.route.snapshot.paramMap.get('id');
    console.log('ViewExerciseComponent ngOnInit - Exercise ID:', exerciseId);
    if (exerciseId) {
      this.loadExercise(exerciseId);
    } else {
      console.error('No exercise ID provided');
      this.router.navigate(['/exercise-list']);
    }
  }

  loadExercise(id: string): void {
    console.log('=== LOADING EXERCISE DETAIL ===');
    console.log('Exercise ID from route:', id);
    console.log('ID format analysis:', {
      id: id,
      startsWithEx: id.startsWith('ex_'),
      startsWithTest: id.startsWith('test_'),
      length: id.length,
      isFrontendGenerated: id.startsWith('ex_') && id.includes('_') && id.length > 20,
      isServerGenerated: id.startsWith('test_') || id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    });
    console.log('Will call API: GET /tests/' + id);
    
    // Luôn thử load từ server trước (không skip nữa)
    console.log('🔄 Attempting to load from server API...');
    this.exerciseService.getTestDetailFromServer(id).subscribe({
      next: (exercise) => {
        console.log('📥 Server API response received:', exercise);
        if (exercise) {
          this.exercise = exercise;
          this.totalQuestions = exercise.questions.length;
          this.initializeAnswers();
          console.log('✅ Exercise loaded successfully from server:', exercise.title);
          console.log('✅ Using server data with full question details');
          console.log('✅ Questions count:', exercise.questions.length);
        } else {
          console.log('⚠️ No exercise returned from server, trying local data');
          this.loadExerciseFromLocal(id);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Server API call failed:', error);
        console.log('Error status:', error.status);
        console.log('Error message:', error.message);
        console.log('🔄 Falling back to local data');
        this.loadExerciseFromLocal(id);
      }
    });
  }

  private loadExerciseFromLocal(id: string): void {
    console.log('Loading exercise from local data with ID:', id);
    this.exerciseService.getExerciseById(id).subscribe({
      next: (exercise) => {
        console.log('Exercise loaded from local:', exercise);
        if (exercise) {
          this.exercise = exercise;
          this.totalQuestions = exercise.questions.length;
          this.initializeAnswers();
          console.log('Exercise loaded successfully from local:', exercise.title);
        } else {
          console.error('Exercise not found in local data');
          this.router.navigate(['/exercise-list']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải bài tập từ local:', error);
        this.isLoading = false;
        this.router.navigate(['/exercise-list']);
      }
    });
  }

  initializeAnswers(): void {
    if (this.exercise) {
      this.exercise.questions.forEach(question => {
        this.userAnswers[question.id] = [];
      });
    }
  }

  selectAnswer(questionId: string, optionId: string, isMultiple: boolean = false): void {
    if (isMultiple) {
      // Multiple choice - toggle selection
      const currentAnswers = this.userAnswers[questionId] || [];
      const index = currentAnswers.indexOf(optionId);
      if (index > -1) {
        currentAnswers.splice(index, 1);
      } else {
        currentAnswers.push(optionId);
      }
      this.userAnswers[questionId] = currentAnswers;
    } else {
      // Single choice - replace selection
      this.userAnswers[questionId] = [optionId];
    }
  }

  isAnswerSelected(questionId: string, optionId: string): boolean {
    return this.userAnswers[questionId]?.includes(optionId) || false;
  }

  nextQuestion(): void {
    if (this.exercise && this.currentQuestionIndex < this.exercise.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  submitExercise(): void {
    if (confirm('Bạn có chắc chắn muốn nộp bài? Sau khi nộp, bạn sẽ không thể chỉnh sửa câu trả lời.')) {
      this.calculateScore();
      this.isSubmitted = true;
    }
  }

  calculateScore(): void {
    if (!this.exercise) return;

    let correctAnswers = 0;
    this.exercise.questions.forEach(question => {
      const userAnswerIds = this.userAnswers[question.id] || [];
      const correctOptionIds = question.options
        .filter(option => option.isCorrect)
        .map(option => option.id);
      
      // Check if user answers match correct answers
      const isCorrect = userAnswerIds.length === correctOptionIds.length &&
        userAnswerIds.every(id => correctOptionIds.includes(id));
      
      if (isCorrect) {
        correctAnswers++;
      }
    });

    this.score = Math.round((correctAnswers / this.totalQuestions) * this.exercise.maxScore);
  }

  getCurrentQuestion() {
    if (this.exercise) {
      return this.exercise.questions[this.currentQuestionIndex];
    }
    return null;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  isCorrectAnswer(questionId: string, optionId: string): boolean {
    if (!this.exercise) return false;
    const question = this.exercise.questions.find(q => q.id === questionId);
    if (!question) return false;
    const option = question.options.find(o => o.id === optionId);
    return option?.isCorrect || false;
  }

  getUserAnswerStatus(questionId: string, optionId: string): 'correct' | 'incorrect' | 'selected' | 'none' {
    if (!this.isSubmitted) {
      return this.isAnswerSelected(questionId, optionId) ? 'selected' : 'none';
    }

    const isSelected = this.isAnswerSelected(questionId, optionId);
    const isCorrect = this.isCorrectAnswer(questionId, optionId);

    if (isSelected && isCorrect) {
      return 'correct';
    } else if (isSelected && !isCorrect) {
      return 'incorrect';
    } else if (!isSelected && isCorrect) {
      return 'correct';
    } else {
      return 'none';
    }
  }

  retakeExercise(): void {
    this.isSubmitted = false;
    this.score = 0;
    this.currentQuestionIndex = 0;
    this.initializeAnswers();
  }

  backToExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  editExercise(): void {
    if (this.exercise) {
      this.router.navigate(['/edit-exercise', this.exercise.id]);
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Math utility for template
  Math = Math;
}
