import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Exercise, Question, CreateExerciseRequest, QuestionParseResult, ImageUploadResult, ExerciseListFilter, ExerciseStats } from '../models/exercise.model';
import { ApiService, TestCreationRequest, TestCreationResponse, TestListResponse, TestListItem, TestDetailResponse, TestDetailQuestion } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  public exercises$ = this.exercisesSubject.asObservable();
  
  private statsSubject = new BehaviorSubject<ExerciseStats>({
    totalExercises: 0,
    publishedExercises: 0,
    draftExercises: 0,
    totalQuestions: 0,
    averageQuestionsPerExercise: 0
  });
  public stats$ = this.statsSubject.asObservable();

  private readonly STORAGE_KEY = 'bioedutech_exercises';

  constructor(private apiService: ApiService) {
    // Không load ngay từ constructor để tránh duplicate calls
    // Sẽ load khi component cần
  }

  // Tạo bài tập mới (chỉ lưu locally, không gọi API)
  createExercise(exerciseData: CreateExerciseRequest): Observable<Exercise> {
    try {
      const exercise: Exercise = {
        id: this.generateId(),
        title: exerciseData.title,
        description: exerciseData.description,
        grade: exerciseData.grade,
        chapter: exerciseData.chapter,
        timeLimit: exerciseData.timeLimit,
        maxScore: exerciseData.maxScore,
        questions: exerciseData.questions || [],
        createdAt: new Date(),
        isPublished: false,
        retryLimit: exerciseData.retryLimit || 1,
        showAnswersAfterSubmit: exerciseData.showAnswersAfterSubmit || true,
        startDate: exerciseData.startDate,
        endDate: exerciseData.endDate,
        assignedClasses: exerciseData.assignedClasses || [],
        createdBy: this.getCurrentUserId()
      };

      // Chỉ lưu locally cho draft, không gọi API
      const currentExercises = this.exercisesSubject.value;
      const updatedExercises = [...currentExercises, exercise];
      this.exercisesSubject.next(updatedExercises);
      this.saveExercisesToStorage(updatedExercises);

      console.log('Bài tập đã được tạo locally (draft):', exercise.title);

      return of(exercise);
    } catch (error) {
      return throwError(() => new Error('Không thể tạo bài tập: ' + error));
    }
  }

  // Parse câu hỏi từ text format
  parseQuestions(questionsText: string): QuestionParseResult {
    const questions: Question[] = [];
    const errors: string[] = [];

    try {
      const lines = questionsText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      let currentQuestion: Partial<Question> | null = null;
      let questionOrder = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Phát hiện câu hỏi mới (có dấu ?)
        if (line.includes('?') && !line.startsWith('a)') && !line.startsWith('b)') && !line.startsWith('c)') && !line.startsWith('d)')) {
          // Lưu câu hỏi trước đó nếu có
          if (currentQuestion && currentQuestion.content && currentQuestion.options && currentQuestion.options.length > 0) {
            questions.push(this.finalizeQuestion(currentQuestion, questionOrder++));
          }

          // Bắt đầu câu hỏi mới
          currentQuestion = {
            id: this.generateId(),
            content: line,
            options: [],
            type: 'single' // Mặc định là single choice
          };
        }
        // Phát hiện đáp án (bắt đầu bằng a), b), c), d))
        else if (currentQuestion && (line.startsWith('a)') || line.startsWith('b)') || line.startsWith('c)') || line.startsWith('d)'))) {
          const optionMatch = line.match(/^([a-d])\)\s*(.+?)(?:\s*\(đúng\))?\s*$/);
          if (optionMatch) {
            const optionLetter = optionMatch[1];
            const optionContent = optionMatch[2].trim();
            const isCorrect = line.includes('(đúng)');

            if (!currentQuestion.options) {
              currentQuestion.options = [];
            }

            currentQuestion.options.push({
              id: this.generateId(),
              content: optionContent,
              isCorrect: isCorrect,
              order: optionLetter.charCodeAt(0) - 97 // a=0, b=1, c=2, d=3
            });

            // Nếu có nhiều đáp án đúng, chuyển thành multiple choice
            if (isCorrect && currentQuestion.type === 'single') {
              const correctCount = currentQuestion.options.filter(opt => opt.isCorrect).length;
              if (correctCount > 1) {
                currentQuestion.type = 'multiple';
              }
            }
          }
        }
      }

      // Lưu câu hỏi cuối cùng
      if (currentQuestion && currentQuestion.content && currentQuestion.options && currentQuestion.options.length > 0) {
        questions.push(this.finalizeQuestion(currentQuestion, questionOrder++));
      }

      // Validation
      questions.forEach((question, index) => {
        if (!question.content || question.content.trim().length === 0) {
          errors.push(`Câu hỏi ${index + 1}: Nội dung câu hỏi không được để trống`);
        }
        if (!question.options || question.options.length < 2) {
          errors.push(`Câu hỏi ${index + 1}: Cần ít nhất 2 đáp án`);
        }
        const correctAnswers = question.options.filter(opt => opt.isCorrect);
        if (correctAnswers.length === 0) {
          errors.push(`Câu hỏi ${index + 1}: Cần ít nhất 1 đáp án đúng`);
        }
        if (question.type === 'single' && correctAnswers.length > 1) {
          errors.push(`Câu hỏi ${index + 1}: Câu hỏi single choice chỉ được có 1 đáp án đúng`);
        }
      });

      return { questions, errors };
    } catch (error) {
      errors.push('Lỗi khi parse câu hỏi: ' + error);
      return { questions, errors };
    }
  }

  private finalizeQuestion(question: Partial<Question>, order: number): Question {
    return {
      id: question.id || this.generateId(),
      content: question.content || '',
      imageUrl: question.imageUrl,
      options: question.options || [],
      type: question.type || 'single',
      explanation: question.explanation,
      order: order
    };
  }

  // Upload ảnh minh họa lên server và nhận đường dẫn
  uploadImage(file: File): Observable<ImageUploadResult> {
    return new Observable(observer => {
      if (!file) {
        observer.next({ success: false, error: 'Không có file được chọn' });
        observer.complete();
        return;
      }

      // Kiểm tra loại file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        observer.next({ success: false, error: 'Chỉ chấp nhận file ảnh JPG, PNG, GIF' });
        observer.complete();
        return;
      }

      // Kiểm tra kích thước file (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        observer.next({ success: false, error: 'File ảnh không được vượt quá 5MB' });
        observer.complete();
        return;
      }

      console.log('📤 Uploading image to server:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Gọi API upload ảnh
      this.apiService.uploadImage(file).subscribe({
        next: (response) => {
          console.log('✅ Image uploaded successfully:', response);
          // Lưu filename thay vì full URL để sử dụng với GET API
          const filename = response.path.split('/').pop() || response.path;
          observer.next({ 
            success: true, 
            imageUrl: filename, // Lưu filename để dùng với GET API
            serverFilename: response.filename || filename
          });
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Error uploading image:', error);
          observer.next({ success: false, error: 'Lỗi khi upload ảnh: ' + error.message });
          observer.complete();
        }
      });
    });
  }

  // Lấy danh sách bài tập
  getExercises(filter?: ExerciseListFilter): Observable<Exercise[]> {
    let exercises = this.exercisesSubject.value;

    if (filter) {
      if (filter.grade) {
        exercises = exercises.filter(ex => ex.grade === filter.grade);
      }
      if (filter.chapter) {
        exercises = exercises.filter(ex => ex.chapter === filter.chapter);
      }
      if (filter.isPublished !== undefined) {
        exercises = exercises.filter(ex => ex.isPublished === filter.isPublished);
      }
      if (filter.createdBy) {
        exercises = exercises.filter(ex => ex.createdBy === filter.createdBy);
      }
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        exercises = exercises.filter(ex => 
          ex.title.toLowerCase().includes(searchTerm) ||
          ex.description.toLowerCase().includes(searchTerm)
        );
      }
    }

    return of(exercises);
  }

  // Lấy bài tập theo ID
  getExerciseById(id: string): Observable<Exercise | null> {
    const exercise = this.exercisesSubject.value.find(ex => ex.id === id);
    return of(exercise || null);
  }

  // Cập nhật bài tập
  updateExercise(id: string, updates: Partial<Exercise>): Observable<Exercise> {
    const exercises = this.exercisesSubject.value;
    const index = exercises.findIndex(ex => ex.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Không tìm thấy bài tập'));
    }

    exercises[index] = { ...exercises[index], ...updates };
    this.exercisesSubject.next(exercises);
    this.saveExercisesToStorage(exercises);

    return of(exercises[index]);
  }

  // Xóa bài tập
  deleteExercise(id: string): Observable<boolean> {
    const exercises = this.exercisesSubject.value;
    const filteredExercises = exercises.filter(ex => ex.id !== id);
    
    if (filteredExercises.length === exercises.length) {
      return throwError(() => new Error('Không tìm thấy bài tập để xóa'));
    }

    this.exercisesSubject.next(filteredExercises);
    this.saveExercisesToStorage(filteredExercises);

    return of(true);
  }

  // Xuất bản bài tập
  publishExercise(id: string): Observable<Exercise> {
    const exercise = this.exercisesSubject.value.find(ex => ex.id === id);
    if (!exercise) {
      return throwError(() => new Error('Không tìm thấy bài tập'));
    }

    // Cập nhật trạng thái xuất bản
    const updatedExercise = this.updateExercise(id, { 
      isPublished: true, 
      publishedAt: new Date() 
    });

    // Subscribe để lấy Exercise object và gọi API
    updatedExercise.subscribe({
      next: (exercise) => {
        // Gọi API để tạo bài thi trên server khi publish
        this.createTestOnServer(exercise).subscribe({
          next: (result) => {
            console.log('✅ Bài thi đã được tạo và xuất bản trên server:', result);
            console.log('Server test ID:', result.server_test_id);
            console.log('Test status:', result.status);
            console.log('Total questions:', result.total_questions);
            
            // Cập nhật exercise với server ID
            this.updateExercise(exercise.id, { 
              id: result.server_test_id,
              publishedAt: new Date(result.created_at)
            }).subscribe({
              next: () => {
                console.log('✅ Exercise ID updated with server ID');
                // Reload data từ server sau khi publish thành công
                this.loadExercisesFromServerInternal();
              },
              error: (updateError) => {
                console.error('Lỗi khi cập nhật exercise ID:', updateError);
                // Vẫn reload data từ server
                this.loadExercisesFromServerInternal();
              }
            });
          },
          error: (error) => {
            console.error('❌ Lỗi khi tạo bài thi trên server:', error);
            console.error('Error details:', error);
            // Không throw error vì bài tập đã được lưu locally
            alert('Bài tập đã được lưu locally nhưng không thể đồng bộ lên server. Vui lòng thử lại sau.');
          }
        });
      }
    });

    return updatedExercise;
  }

  // Refresh exercises từ server
  refreshExercises(): Observable<Exercise[]> {
    return new Observable(observer => {
      // Kiểm tra xem đã có data chưa, nếu chưa thì load từ server
      if (this.exercisesSubject.value.length === 0) {
        this.loadExercisesFromServerInternal();
      }
      
      // Return current data
      observer.next(this.exercisesSubject.value);
      observer.complete();
    });
  }

  // Lấy thống kê bài tập
  getExerciseStats(): Observable<ExerciseStats> {
    const exercises = this.exercisesSubject.value;
    const totalExercises = exercises.length;
    const publishedExercises = exercises.filter(ex => ex.isPublished).length;
    const draftExercises = totalExercises - publishedExercises;
    const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
    const averageQuestionsPerExercise = totalExercises > 0 ? totalQuestions / totalExercises : 0;

    return of({
      totalExercises,
      publishedExercises,
      draftExercises,
      totalQuestions,
      averageQuestionsPerExercise
    });
  }

  // Tính toán thống kê từ danh sách bài tập
  private calculateStats(exercises: Exercise[]): ExerciseStats {
    const totalExercises = exercises.length;
    const publishedExercises = exercises.filter(ex => ex.isPublished).length;
    const draftExercises = totalExercises - publishedExercises;
    const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
    const averageQuestionsPerExercise = totalExercises > 0 ? totalQuestions / totalExercises : 0;

    return {
      totalExercises,
      publishedExercises,
      draftExercises,
      totalQuestions,
      averageQuestionsPerExercise
    };
  }

  // Helper methods
  private generateId(): string {
    return 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getCurrentUserId(): string {
    // Trong thực tế sẽ lấy từ auth service
    return 'teacher_001';
  }

  // Load exercises từ server (public method)
  loadExercisesFromServer(): Observable<Exercise[]> {
    return new Observable(observer => {
      this.apiService.getTests(1, 100).subscribe({
        next: (response: TestListResponse) => {
          console.log('API Response:', response);
          console.log('Exams from API:', response.exams);
          
          // Convert TestListItem to Exercise format
          const exercises = response.exams.map(test => this.convertTestToExercise(test));
          this.exercisesSubject.next(exercises);
          console.log('Loaded exercises from server:', exercises.length);
          console.log('Converted exercises:', exercises);
          
          // Emit stats update
          this.statsSubject.next(this.calculateStats(exercises));
          
          observer.next(exercises);
          observer.complete();
        },
        error: (error) => {
          console.error('Lỗi khi load bài tập từ server:', error);
          // Fallback to localStorage nếu server lỗi
          this.loadExercisesFromStorage();
          observer.error(error);
        }
      });
    });
  }

  // Get test detail từ server
  getTestDetailFromServer(testId: string): Observable<Exercise | null> {
    return new Observable(observer => {
      console.log('=== GETTING TEST DETAIL FROM SERVER ===');
      console.log('Test ID to fetch:', testId);
      console.log('API URL: GET /exams/' + testId);
      
      // Luôn gọi API, không skip nữa
      this.apiService.getTestDetail(testId).subscribe({
        next: (response: TestDetailResponse) => {
          console.log('✅ Test Detail API Response received:', response);
          console.log('Response test_id:', response.test_id);
          console.log('Response questions count:', response.questions?.length || 0);
          
          // Convert TestDetailResponse to Exercise format
          const exercise = this.convertTestDetailToExercise(response);
          console.log('✅ Converted exercise from detail:', exercise);
          console.log('Final exercise ID:', exercise.id);
          console.log('Final exercise questions count:', exercise.questions.length);
          
          observer.next(exercise);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ Lỗi khi load chi tiết bài thi từ server:', error);
          console.log('Error details:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          
          // Nếu là lỗi 404, có thể test ID không tồn tại trên server
          if (error.status === 404) {
            console.log('⚠️ Test không tồn tại trên server (404), sẽ fallback về local data');
          } else if (error.status === 0) {
            console.log('⚠️ Network error (CORS or server down), sẽ fallback về local data');
          }
          
          observer.error(error);
        }
      });
    });
  }

  // Kiểm tra xem test ID có phù hợp với server format không
  private isValidServerTestId(testId: string): boolean {
    // Server test ID thường có format khác với frontend ID
    // Frontend ID: ex_timestamp_randomstring
    // Server ID có thể là: test_001, test_002, hoặc UUID format
    
    if (testId.startsWith('ex_')) {
      console.log('Detected frontend-generated ID, may not exist on server:', testId);
      return false;
    }
    
    // Chấp nhận các format server ID phổ biến
    if (testId.startsWith('test_') || 
        testId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ||
        testId.length > 5) { // Các ID khác có độ dài > 5
      console.log('Detected server-compatible ID:', testId);
      return true;
    }
    
    console.log('Unknown ID format, will try API call:', testId);
    return true; // Thử gọi API để xem có hoạt động không
  }

  // Load exercises từ server (private method for internal use)
  private loadExercisesFromServerInternal(): void {
    this.apiService.getTests(1, 100).subscribe({
      next: (response: TestListResponse) => {
        // Convert TestListItem to Exercise format
        const exercises = response.exams.map(test => this.convertTestToExercise(test));
        this.exercisesSubject.next(exercises);
        console.log('Loaded exercises from server:', exercises.length);
        
        // Emit stats update
        this.statsSubject.next(this.calculateStats(exercises));
      },
      error: (error) => {
        console.error('Lỗi khi load bài tập từ server:', error);
        // Fallback to localStorage nếu server lỗi
        this.loadExercisesFromStorage();
      }
    });
  }

  // Convert TestListItem to Exercise format
  private convertTestToExercise(test: TestListItem): Exercise {
    console.log('=== CONVERTING TEST TO EXERCISE ===');
    console.log('Raw test object from API:', JSON.stringify(test, null, 2));
    console.log('Test ID field:', test.test_id);
    console.log('Exam name field:', test.exam_name);
    console.log('All test fields:', Object.keys(test));
    
    // Tạo questions mặc định nếu không có
    const defaultQuestions = [{
      id: this.generateId(),
      content: 'Câu hỏi mẫu - Vui lòng chỉnh sửa',
      options: [
        { id: this.generateId(), content: 'Đáp án A', isCorrect: false, order: 0 },
        { id: this.generateId(), content: 'Đáp án B', isCorrect: true, order: 1 },
        { id: this.generateId(), content: 'Đáp án C', isCorrect: false, order: 2 },
        { id: this.generateId(), content: 'Đáp án D', isCorrect: false, order: 3 }
      ],
      type: 'single' as const,
      order: 1
    }];

    // Sử dụng server test_id làm exercise ID - kiểm tra kỹ hơn
    let exerciseId: string;
    if (test.test_id && test.test_id.trim() !== '') {
      exerciseId = test.test_id;
      console.log('✅ Using server test_id as exercise ID:', exerciseId);
    } else {
      // Nếu không có test_id, tạo ID từ exam_name hoặc generate
      exerciseId = test.exam_name || this.generateId();
      console.log('⚠️ No test_id found, using fallback ID:', exerciseId);
      console.log('Available fields:', Object.keys(test));
    }
    
    console.log('Final exercise ID will be:', exerciseId);
    console.log('This ID will be used for API calls to /exams/' + exerciseId);

    const exercise = {
      id: exerciseId, // Sử dụng server test_id hoặc fallback
      title: test.exam_name || 'Bài tập không có tên',
      description: test.description || 'Mô tả bài tập',
      grade: test.grade || 10,
      chapter: 'Chương 1: Cơ chế di truyền và biến dị',
      timeLimit: test.time_limit || 60,
      maxScore: test.max_score || 100,
      questions: test.questions && Array.isArray(test.questions) && test.questions.length > 0 ? test.questions : defaultQuestions,
      createdAt: new Date(test.created_at),
      isPublished: test.status === 'published' || test.status === 'active',
      publishedAt: (test.status === 'published' || test.status === 'active') ? new Date(test.created_at) : undefined,
      retryLimit: test.retry_limit || 1,
      showAnswersAfterSubmit: test.show_answers_after_submit !== false,
      startDate: test.start_date ? new Date(test.start_date) : undefined,
      endDate: test.end_date ? new Date(test.end_date) : undefined,
      assignedClasses: test.assigned_classes || [],
      createdBy: test.created_by || 'teacher_001'
    };

    console.log('✅ Converted exercise with ID:', exercise.id);
    console.log('Exercise title:', exercise.title);
    return exercise;
  }

  // Convert TestDetailResponse to Exercise format
  private convertTestDetailToExercise(testDetail: TestDetailResponse): Exercise {
    console.log('Converting test detail to exercise:', testDetail);
    console.log('Test Detail ID:', testDetail.test_id);
    console.log('Test Detail name:', testDetail.exam_name);
    
    // Convert questions từ TestDetailQuestion format sang Question format
    const questions: Question[] = testDetail.questions.map((question, index) => {
      const options = question.answers.map((answer, answerIndex) => ({
        id: this.generateId(),
        content: answer,
        isCorrect: question.correct_answers.includes(answerIndex),
        order: answerIndex
      }));

      return {
        id: question.question_id || this.generateId(),
        content: question.content,
        imageUrl: question.image,
        options: options,
        type: question.correct_answers.length > 1 ? 'multiple' : 'single',
        explanation: question.explanation,
        order: question.order || index + 1
      };
    });

    const exercise: Exercise = {
      id: testDetail.test_id,
      title: testDetail.exam_name,
      description: testDetail.description || 'Mô tả bài tập',
      grade: testDetail.grade || 10,
      chapter: 'Chương 1: Cơ chế di truyền và biến dị', // Default chapter
      timeLimit: testDetail.time_limit || 60,
      maxScore: testDetail.max_score || 100,
      questions: questions,
      createdAt: new Date(testDetail.created_at),
      isPublished: testDetail.status === 'published' || testDetail.status === 'active',
      publishedAt: (testDetail.status === 'published' || testDetail.status === 'active') ? new Date(testDetail.created_at) : undefined,
      retryLimit: testDetail.retry_limit || 1,
      showAnswersAfterSubmit: testDetail.show_answers_after_submit !== false,
      startDate: testDetail.start_date ? new Date(testDetail.start_date) : undefined,
      endDate: testDetail.end_date ? new Date(testDetail.end_date) : undefined,
      assignedClasses: testDetail.assigned_classes || [],
      createdBy: testDetail.created_by || 'teacher_001'
    };

    console.log('Converted exercise from detail:', exercise);
    return exercise;
  }

  private loadExercisesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const exercises = JSON.parse(stored);
        this.exercisesSubject.next(exercises);
      }
    } catch (error) {
      console.error('Lỗi khi load bài tập từ storage:', error);
    }
  }

  private saveExercisesToStorage(exercises: Exercise[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercises));
    } catch (error) {
      console.error('Lỗi khi lưu bài tập vào storage:', error);
    }
  }

  // Tạo bài thi trên server thông qua API /exams
  private createTestOnServer(exercise: Exercise): Observable<TestCreationResponse> {
    const testData: TestCreationRequest = {
      exam_name: exercise.title,
      questions: exercise.questions.map(question => {
        const questionData = {
          content: question.content,
          answers: question.options.map(option => option.content),
          correct_answers: question.options
            .map((option, index) => option.isCorrect ? index : null)
            .filter(index => index !== null) as number[],
          image: question.imageUrl || undefined // Server URL sẽ được gửi ở đây
        };

        // Log thông tin về image nếu có
        if (question.imageUrl) {
          console.log('📸 Question with image:', {
            questionContent: question.content.substring(0, 50) + '...',
            hasImage: !!question.imageUrl,
            imageType: 'server_filename',
            filename: question.imageUrl
          });
        }

        return questionData;
      })
    };

    console.log('🚀 Sending test data to server:', {
      examName: testData.exam_name,
      questionsCount: testData.questions.length,
      questionsWithImages: testData.questions.filter(q => q.image).length
    });
    
    // Log chi tiết từng câu hỏi
    testData.questions.forEach((q, index) => {
      console.log(`Question ${index + 1}:`, {
        content: q.content.substring(0, 50) + '...',
        answersCount: q.answers.length,
        correctAnswers: q.correct_answers,
        hasImage: !!q.image,
        imageLength: q.image ? q.image.length : 0
      });
    });
    
    return this.apiService.createTest(testData);
  }

}
