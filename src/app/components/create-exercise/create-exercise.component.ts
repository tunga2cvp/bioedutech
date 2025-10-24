import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { ApiService, TestCreationRequest } from '../../services/api.service';
import { CreateExerciseRequest, Question, QuestionParseResult, Exercise } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-create-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LayoutComponent],
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss']
})
export class CreateExerciseComponent implements OnInit {
  exerciseForm: FormGroup;
  questions: Question[] = [];
  questionsText: string = '';
  parseResult: QuestionParseResult | null = null;
  isSubmitting = false;
  showStudentPreview = false;
  isEditMode = false;
  exerciseId: string | null = null;
  originalExercise: Exercise | null = null;

  // Các lớp học và chương học

  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Check if this is edit mode
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    console.log('CreateExerciseComponent ngOnInit - Exercise ID:', this.exerciseId);
    if (this.exerciseId) {
      this.isEditMode = true;
      console.log('Edit mode activated');
      this.loadExerciseForEdit(this.exerciseId);
    } else {
      console.log('Create mode activated');
    }
  }

  loadExerciseForEdit(id: string): void {
    console.log('Loading exercise for edit with ID:', id);
    this.exerciseService.getExerciseById(id).subscribe({
      next: (exercise) => {
        console.log('Exercise loaded for edit:', exercise);
        if (exercise) {
          this.originalExercise = exercise;
          this.exerciseForm.patchValue({
            title: exercise.title
          });
          this.questions = [...exercise.questions];
          console.log('Exercise loaded successfully for edit:', exercise.title);
        } else {
          console.error('Exercise not found for edit');
          this.router.navigate(['/exercise-list']);
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải bài tập để chỉnh sửa:', error);
        this.router.navigate(['/exercise-list']);
      }
    });
  }


  // Parse câu hỏi từ text
  parseQuestions(): void {
    if (!this.questionsText.trim()) {
      this.parseResult = { questions: [], errors: ['Vui lòng nhập câu hỏi'] };
      return;
    }

    this.parseResult = this.exerciseService.parseQuestions(this.questionsText);
    this.questions = this.parseResult.questions;
    
    // Tự động chuyển sang preview học sinh nếu có câu hỏi
    if (this.questions.length > 0) {
      this.showStudentPreview = true;
    }
  }

  // Xử lý khi thay đổi text câu hỏi
  onQuestionsTextChange(): void {
    // Reset parse result khi thay đổi text
    this.parseResult = null;
  }

  // Xóa text câu hỏi
  clearQuestionsText(): void {
    this.questionsText = '';
    this.parseResult = null;
  }

  // Thêm câu hỏi thủ công
  addManualQuestion(): void {
    const newQuestion: Question = {
      id: this.generateId(),
      content: '',
      options: [
        { id: this.generateId(), content: '', isCorrect: false, order: 0 },
        { id: this.generateId(), content: '', isCorrect: false, order: 1 }
      ],
      type: 'single',
      order: this.questions.length + 1
    };
    this.questions.push(newQuestion);
  }

  // Thêm đáp án cho câu hỏi
  addOption(questionIndex: number): void {
    const question = this.questions[questionIndex];
    const newOption = {
      id: this.generateId(),
      content: '',
      isCorrect: false,
      order: question.options.length
    };
    question.options.push(newOption);
  }

  // Xóa đáp án
  removeOption(questionIndex: number, optionIndex: number): void {
    const question = this.questions[questionIndex];
    if (question.options.length > 2) {
      question.options.splice(optionIndex, 1);
      // Cập nhật lại order
      question.options.forEach((opt, index) => {
        opt.order = index;
      });
    }
  }

  // Xóa câu hỏi
  removeQuestion(questionIndex: number): void {
    this.questions.splice(questionIndex, 1);
    // Cập nhật lại order
    this.questions.forEach((q, index) => {
      q.order = index + 1;
    });
  }

  // Thay đổi loại câu hỏi
  changeQuestionType(questionIndex: number, type: 'single' | 'multiple'): void {
    this.questions[questionIndex].type = type;
    
    // Nếu chuyển từ multiple về single, chỉ giữ lại 1 đáp án đúng
    if (type === 'single') {
      const question = this.questions[questionIndex];
      const correctOptions = question.options.filter(opt => opt.isCorrect);
      if (correctOptions.length > 1) {
        // Chỉ giữ lại đáp án đúng đầu tiên
        question.options.forEach(opt => {
          opt.isCorrect = opt === correctOptions[0];
        });
      }
    }
  }

  // Upload ảnh cho câu hỏi
  onImageUpload(event: any, questionIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      console.log('📸 Uploading image for question', questionIndex + 1, ':', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      this.exerciseService.uploadImage(file).subscribe({
        next: (result) => {
          if (result.success && result.imageUrl) {
            this.questions[questionIndex].imageUrl = result.imageUrl;
            console.log('✅ Image uploaded successfully:', {
              questionIndex: questionIndex + 1,
              imageType: 'server_filename',
              filename: result.imageUrl,
              serverFilename: result.serverFilename
            });
          } else {
            console.error('❌ Image upload failed:', result.error);
            alert('Lỗi upload ảnh: ' + result.error);
          }
        },
        error: (error) => {
          console.error('❌ Image upload error:', error);
          alert('Lỗi upload ảnh: ' + error);
        }
      });
    }
  }

  // Xóa ảnh
  removeImage(questionIndex: number): void {
    this.questions[questionIndex].imageUrl = undefined;
  }

  // Xem preview bài tập
  togglePreview(): void {
    this.showStudentPreview = !this.showStudentPreview;
  }

  // Lưu bài tập - gọi API trực tiếp, không lưu local
  saveExercise(): void {
    if (this.exerciseForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.questions.length === 0) {
      alert('Vui lòng thêm ít nhất 1 câu hỏi');
      return;
    }

    // Validate câu hỏi
    const validationErrors = this.validateQuestions();
    if (validationErrors.length > 0) {
      alert('Có lỗi trong câu hỏi:\n' + validationErrors.join('\n'));
      return;
    }

    this.isSubmitting = true;

    // Tạo test data để gửi trực tiếp lên server
    const testData: TestCreationRequest = {
      exam_name: this.exerciseForm.value.title,
      questions: this.questions.map(question => ({
        content: question.content,
        answers: question.options.map(option => option.content),
        correct_answers: question.options
          .map((option, index) => option.isCorrect ? index : null)
          .filter(index => index !== null) as number[],
        image: question.imageUrl || undefined
      }))
    };

    console.log('🚀 Gửi bài tập trực tiếp lên server...', {
      examName: testData.exam_name,
      questionsCount: testData.questions.length,
      questionsWithImages: testData.questions.filter(q => q.image).length
    });

    // Gọi API trực tiếp, không lưu local
    this.apiService.createTest(testData).subscribe({
      next: (result) => {
        console.log('✅ Bài tập đã được tạo thành công trên server:', result);
        alert(`✅ Tạo bài tập thành công!\n\n📝 Tên: ${testData.exam_name}\n📊 Số câu hỏi: ${testData.questions.length}\n🆔 ID: ${String(result.id)}\n📅 Thời gian: ${new Date(result.created_at).toLocaleString()}`);
        this.router.navigate(['/exercise-list']);
      },
      error: (error) => {
        console.error('❌ Lỗi khi tạo bài tập trên server:', error);
        alert('❌ Lỗi khi tạo bài tập:\n\n' + error + '\n\nVui lòng kiểm tra kết nối mạng và thử lại.');
        this.isSubmitting = false;
      }
    });
  }

  // Validate câu hỏi
  private validateQuestions(): string[] {
    const errors: string[] = [];

    this.questions.forEach((question, index) => {
      if (!question.content.trim()) {
        errors.push(`Câu hỏi ${index + 1}: Nội dung không được để trống`);
      }

      if (question.options.length < 2) {
        errors.push(`Câu hỏi ${index + 1}: Cần ít nhất 2 đáp án`);
      }

      const correctAnswers = question.options.filter(opt => opt.isCorrect);
      if (correctAnswers.length === 0) {
        errors.push(`Câu hỏi ${index + 1}: Cần ít nhất 1 đáp án đúng`);
      }

      if (question.type === 'single' && correctAnswers.length > 1) {
        errors.push(`Câu hỏi ${index + 1}: Câu hỏi single choice chỉ được có 1 đáp án đúng`);
      }

      question.options.forEach((option, optIndex) => {
        if (!option.content.trim()) {
          errors.push(`Câu hỏi ${index + 1}, đáp án ${String.fromCharCode(97 + optIndex)}: Nội dung không được để trống`);
        }
      });
    });

    return errors;
  }

  // Mark form as touched
  private markFormGroupTouched(): void {
    Object.keys(this.exerciseForm.controls).forEach(key => {
      const control = this.exerciseForm.get(key);
      control?.markAsTouched();
    });
  }

  // Generate ID
  private generateId(): string {
    return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Tạo URL cho ảnh từ server
  getImageUrl(filename: string): string {
    return this.apiService.getImageUrl(filename);
  }

  // Xử lý lỗi khi load ảnh
  onImageError(event: any): void {
    console.error('❌ Error loading image:', event);
    // Có thể hiển thị placeholder hoặc ẩn ảnh
    event.target.style.display = 'none';
  }

  // Get option letter
  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  // Check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.exerciseForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Get field error message
  getFieldError(fieldName: string): string {
    const field = this.exerciseForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return 'Trường này là bắt buộc';
      }
      if (field.errors['minlength']) {
        return `Tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
      }
      if (field.errors['min']) {
        return `Giá trị tối thiểu là ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Giá trị tối đa là ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  // Back to dashboard
  backToDashboard(): void {
    this.router.navigate(['/teacher-dashboard']);
  }
}
