import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

// API Models
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiAuthResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: 'teacher' | 'student';
    name?: string;
    grade?: number;
    school?: string;
    class?: string;
    studentId?: string;
    teacherId?: string;
    subject?: string;
    phone?: string;
    department?: string;
    experience?: number;
    qualifications?: string[];
    isVerified?: boolean;
  };
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// Correct Test Creation API Models based on Swagger docs
export interface TestCreationRequest {
  exam_name: string;
  questions: TestQuestionRequest[];
  timer?: string; // Timer field in format like "2m", "1h", etc.
}

export interface TestQuestionRequest {
  content: string;
  answers: string[];
  correct_answers: number[];
  image?: string;
}

export interface TestCreationResponse {
  result: string;
  message: string;
  test_id: string;
  id: string | number;
  created_at: string;
  status: string;
  total_questions: number;
  max_score: number;
  time_limit: number;
}

// Test List API Models
export interface TestListItem {
  id: string | number;
  exam_name: string;
  created_at: string;
  status: string;
  question_count: number; // Đổi từ total_questions thành question_count
  description?: string;
  grade?: number;
  time_limit?: number;
  max_score?: number;
  questions?: any[];
  retry_limit?: number;
  show_answers_after_submit?: boolean;
  start_date?: string;
  end_date?: string;
  assigned_classes?: string[];
  created_by?: string;
  timer?: string; // Timer field in format like "2m", "1h", etc.
}

export interface TestListResponse {
  exams: TestListItem[];  // Changed from 'tests' to 'exams' to match new API response
  count: number;          // Changed from 'total' to 'count' to match new API response
  page?: number;          // Made optional as it might not be in response
  limit?: number;         // Made optional as it might not be in response
  success: boolean;       // Added success field from new API response
}

// Test Detail API Models - Updated to match actual API response
export interface TestDetailQuestion {
  content: string;
  answers: string[];
  correct_answers: number[];
  image?: string | null;
  explanation?: string;
  order?: number;
  question_id?: string; // Optional since API doesn't always provide this
}

// Actual API response structure
export interface TestDetailApiResponse {
  success: boolean;
  exam: {
    exam_name: string;
    id: string | number;
    questions: TestDetailQuestion[];
    description?: string;
    grade?: number;
    time_limit?: number;
    max_score?: number;
    question_count?: number;
    created_at?: string;
    status?: string;
    retry_limit?: number;
    show_answers_after_submit?: boolean;
    start_date?: string;
    end_date?: string;
    assigned_classes?: string[];
    created_by?: string;
    timer?: string; // Timer field in format like "2m", "1h", etc.
  };
}

export interface TestDetailResponse {
  id: string | number;
  exam_name: string;
  description?: string;
  grade?: number;
  time_limit?: number;
  max_score?: number;
  questions?: TestDetailQuestion[];
  question_count?: number; // Thêm question_count cho detail response
  created_at: string;
  status: string;
  retry_limit?: number;
  show_answers_after_submit?: boolean;
  start_date?: string;
  end_date?: string;
  assigned_classes?: string[];
  created_by?: string;
  timer?: string; // Timer field in format like "2m", "1h", etc.
}

// New Exam Submission API Models based on /exams/{exam_id}/submit
export interface ExamSubmissionRequest {
  student_id: number;
  answers: number[][];
  time_taken: number;
}

export interface ExamSubmissionResponse {
  success: boolean;
  student_id: number;
  test_id: number;
  submission_id: number;
  score: number;
  max_score: number;
  percentage: number;
}

// Legacy interfaces for backward compatibility
export interface TestSubmissionData {
  test_data: {
    student_id: string;
    test_id: string;
    answers: AnswerSubmission[];
    total_time: number;
  };
}

export interface AnswerSubmission {
  question_id: string;
  selected_options: string[];
  time_spent: number;
}

export interface TestResult {
  result: string;
  score: number;
  max_score: number;
  correct_answers: number;
  total_questions: number;
  submission_id: string;
  submitted_at?: string;
  detailed_results?: QuestionResult[];
}

export interface QuestionResult {
  question_id: string;
  is_correct: boolean;
  selected_options: string[];
  correct_options: string[];
  explanation?: string;
}

// Student Registration Excel API Models
export interface ExcelRegistrationResponse {
  created: number;
  created_items: CreatedStudent[];
  success: boolean;
}

export interface CreatedStudent {
  id: number;
  name: string;
  username: string;
}

export interface ImageUploadResponse {
  success: boolean;
  path: string; // Đường dẫn ảnh từ server
  filename?: string;
  message?: string;
}

// Users API Models
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'teacher' | 'student';
  name?: string;
  grade?: number;
  school?: string;
  class?: string;
  studentId?: string;
  teacherId?: string;
  subject?: string;
  phone?: string;
  department?: string;
  experience?: number;
  qualifications?: string[];
  isVerified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  count: number;
  page?: number;
  limit?: number;
}

// Exam Results API Models
export interface ExamResult {
  max_score: number;
  percentage: number;
  score: number;
  student: {
    name: string;
    username: string;
  };
  student_id: number;
  submission_id: number;
  time_taken: number;
  timestamp: string;
}

export interface ExamResultsResponse {
  count: number;
  results: ExamResult[];
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://chimeara.pythonanywhere.com';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Có lỗi xảy ra!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Dữ liệu không hợp lệ';
          break;
        case 401:
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
          break;
        case 403:
          errorMessage = 'Truy cập bị từ chối';
          break;
        case 404:
          errorMessage = 'Không tìm thấy tài khoản';
          break;
        case 500:
          errorMessage = 'Lỗi máy chủ';
          break;
        default:
          errorMessage = `Lỗi ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Login API call for students
  loginStudent(credentials: LoginCredentials): Observable<ApiAuthResponse> {
    return this.http.post<ApiAuthResponse>(`${this.baseUrl}/login`, credentials, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Test creation API call (correct format) - Updated to use /exams endpoint
  createTest(testData: TestCreationRequest): Observable<TestCreationResponse> {
    return this.http.post<TestCreationResponse>(`${this.baseUrl}/exams`, testData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get tests list API call - Updated to use /exams endpoint
  getTests(page: number = 1, limit: number = 10): Observable<TestListResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    return this.http.get<TestListResponse>(`${this.baseUrl}/exams?${params.toString()}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get test detail API call - Updated to use /exams endpoint
  getTestDetail(testId: string): Observable<TestDetailResponse> {
    return this.http.get<TestDetailApiResponse>(`${this.baseUrl}/exams/${testId}`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: TestDetailApiResponse) => {
        // Transform API response to expected format
        const exam = response.exam;
        return {
          id: exam.id,
          exam_name: exam.exam_name,
          description: exam.description,
          grade: exam.grade,
          time_limit: exam.time_limit,
          max_score: exam.max_score,
          questions: exam.questions,
          question_count: exam.question_count,
          created_at: exam.created_at || new Date().toISOString(),
          status: exam.status || 'active',
          retry_limit: exam.retry_limit,
          show_answers_after_submit: exam.show_answers_after_submit,
          start_date: exam.start_date,
          end_date: exam.end_date,
          assigned_classes: exam.assigned_classes,
          created_by: exam.created_by,
          timer: exam.timer
        } as TestDetailResponse;
      }),
      catchError(this.handleError)
    );
  }

  // New Exam Submission API call - POST /exams/{exam_id}/submit
  submitExam(examId: string | number, submissionData: ExamSubmissionRequest): Observable<ExamSubmissionResponse> {
    console.log('📤 Submitting exam:', { examId, submissionData });
    
    return this.http.post<ExamSubmissionResponse>(`${this.baseUrl}/exams/${examId}/submit`, submissionData, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: ExamSubmissionResponse) => {
        console.log('✅ Exam submitted successfully:', response);
      }),
      catchError(error => {
        console.error('❌ Exam submission failed:', error);
        return this.handleError(error);
      })
    );
  }

  // Test submission API call (legacy) - Updated to use /exams endpoint
  submitTest(testData: TestSubmissionData): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.baseUrl}/exams`, testData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Upload ảnh lên server và nhận đường dẫn trả về
  uploadImage(file: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('📤 Uploading image to server:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Không set Content-Type header để Angular tự động set với boundary
    return this.http.post<ImageUploadResponse>(`${this.baseUrl}/images`, formData).pipe(
      tap((response: ImageUploadResponse) => {
        console.log('✅ Image uploaded successfully:', response);
      }),
      catchError(error => {
        console.error('❌ Error uploading image:', error);
        return throwError(() => error);
      })
    );
  }

  // Debug method để test API upload ảnh
  debugUploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('🔍 Debug upload image:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      formDataKeys: ['file'], // Fixed: FormData.keys() không có trong TypeScript
      url: `${this.baseUrl}/images`
    });

    return this.http.post(`${this.baseUrl}/images`, formData, {
      observe: 'response' // Để xem full response
    }).pipe(
      tap(response => {
        console.log('🔍 Debug response:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          body: response.body
        });
      }),
      catchError(error => {
        console.error('🔍 Debug error:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        return throwError(() => error);
      })
    );
  }

  // Lấy ảnh từ server theo filename
  getImage(filename: string): Observable<Blob> {
    console.log('📥 Getting image from server:', {
      filename: filename,
      url: `${this.baseUrl}/images/${filename}`
    });

    return this.http.get(`${this.baseUrl}/images/${filename}`, {
      responseType: 'blob'
    }).pipe(
      tap(() => {
        console.log('✅ Image retrieved successfully:', filename);
      }),
      catchError(error => {
        console.error('❌ Error getting image:', error);
        return throwError(() => error);
      })
    );
  }

  // Tạo URL cho ảnh từ server
  getImageUrl(filename: string): string {
    return `${this.baseUrl}/images/${filename}`;
  }

  // Student Registration Excel API call
  registerStudentsExcel(file: File): Observable<ExcelRegistrationResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ExcelRegistrationResponse>(`${this.baseUrl}/register_excel`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Get users list API call
  getUsers(page: number = 1, limit: number = 100, role?: 'teacher' | 'student'): Observable<UsersResponse> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    if (role) {
      params.set('role', role);
    }

    console.log('📥 Fetching users from API:', {
      url: `${this.baseUrl}/users?${params.toString()}`,
      page,
      limit,
      role
    });

    return this.http.get<UsersResponse>(`${this.baseUrl}/users?${params.toString()}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: UsersResponse) => {
        console.log('✅ Users fetched successfully:', {
          count: response.count,
          usersCount: response.users?.length || 0,
          success: response.success
        });
      }),
      catchError(error => {
        console.error('❌ Error fetching users:', error);
        return this.handleError(error);
      })
    );
  }

  // Get students only (filtered by role)
  getStudents(page: number = 1, limit: number = 100): Observable<UsersResponse> {
    return this.getUsers(page, limit, 'student');
  }

  // Get teachers only (filtered by role)
  getTeachers(page: number = 1, limit: number = 100): Observable<UsersResponse> {
    return this.getUsers(page, limit, 'teacher');
  }

  // Download Excel template for student registration
  downloadExcelTemplate(): Observable<Blob> {
    console.log('📥 Downloading Excel template from API:', {
      url: `${this.baseUrl}/register_excel/template`
    });

    return this.http.get(`${this.baseUrl}/register_excel/template`, {
      responseType: 'blob'
    }).pipe(
      tap(() => {
        console.log('✅ Excel template downloaded successfully');
      }),
      catchError(error => {
        console.error('❌ Error downloading Excel template:', error);
        return this.handleError(error);
      })
    );
  }

  // Get exam results API call - GET /exams/{exam_id}/results
  getExamResults(examId: string | number, studentId?: number): Observable<ExamResultsResponse> {
    let url = `${this.baseUrl}/exams/${examId}/results`;
    
    if (studentId) {
      url += `?student_id=${studentId}`;
    }

    console.log('📥 Fetching exam results from API:', {
      examId,
      studentId,
      url
    });

    return this.http.get<ExamResultsResponse>(url, {
      headers: this.getHeaders()
    }).pipe(
      tap((response: ExamResultsResponse) => {
        console.log('✅ Exam results fetched successfully:', {
          examId,
          count: response.count,
          resultsCount: response.results?.length || 0,
          success: response.success
        });
      }),
      catchError(error => {
        console.error('❌ Error fetching exam results:', error);
        return this.handleError(error);
      })
    );
  }

  // Delete user API call - DELETE /users/{user_id}
  deleteUser(userId: number): Observable<{ success: boolean; message: string }> {
    console.log('🗑️ Deleting user from API:', {
      userId,
      url: `${this.baseUrl}/users/${userId}`
    });

    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/users/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response) => {
        console.log('✅ User deleted successfully:', response);
      }),
      catchError(error => {
        console.error('❌ Error deleting user:', error);
        return this.handleError(error);
      })
    );
  }

  // Delete exam API call - DELETE /exams/{exam_id}
  deleteExam(examId: string | number): Observable<{ success: boolean; message: string }> {
    console.log('🗑️ Deleting exam from API:', {
      examId,
      url: `${this.baseUrl}/exams/${examId}`
    });

    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/exams/${examId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap((response) => {
        console.log('✅ Exam deleted successfully:', response);
      }),
      catchError(error => {
        console.error('❌ Error deleting exam:', error);
        return this.handleError(error);
      })
    );
  }
}
