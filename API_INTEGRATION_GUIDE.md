# 🌐 API Integration Guide - BioEduTech

## 📋 Tổng quan

Tài liệu này hướng dẫn tích hợp frontend Angular với backend API của BioEduTech. Backend API được cung cấp qua Swagger documentation tại: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)

## 🔗 API Base URL

```
Base URL: https://chimeara.pythonanywhere.com
Swagger UI: https://chimeara.pythonanywhere.com/apidocs/
```

## 🔐 Authentication

### No Authentication Required
API hiện tại không yêu cầu token authentication. Tất cả endpoints có thể truy cập trực tiếp mà không cần xác thực.

```typescript
// Headers cho mọi request
{
  "Content-Type": "application/json"
}
```

### Login Endpoint
```http
POST /login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com"
  }
}
```

### Exams Endpoint (Bài thi)

#### 1. Tạo bài thi

**Endpoint:** `POST /exams`  
**Mô tả:** API này cho phép tạo bài thi mới trên server. Khi giáo viên tạo bài tập và xuất bản, hệ thống sẽ gọi API này để tạo bài thi tương ứng trên server.

#### 2. Lấy danh sách bài thi

**Endpoint:** `GET /exams`  
**Mô tả:** API này cho phép lấy danh sách các bài thi đã tạo từ server. Hệ thống sẽ sử dụng API này để đồng bộ dữ liệu bài thi.

#### GET Request Format
```http
GET /exams?page=1&limit=10
Content-Type: application/json
```

#### POST Request Format
```http
POST /exams
Content-Type: application/json

{
  "test_name": "Bài kiểm tra Sinh học lớp 10",
  "questions": [
    {
      "content": "Tế bào là đơn vị cơ bản của sự sống?",
      "answers": ["Đúng", "Sai"],
      "correct_answers": [0],
      "image": "optional_image_url"
    },
    {
      "content": "Các thành phần chính của tế bào bao gồm:",
      "answers": ["Màng tế bào", "Tế bào chất", "Nhân tế bào", "Vỏ tế bào"],
      "correct_answers": [0, 1, 2],
      "image": null
    }
  ]
}
```

#### Request Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `test_name` | String | ✅ | Tên bài thi |
| `questions` | Array | ✅ | Danh sách câu hỏi |
| `questions[].content` | String | ✅ | Nội dung câu hỏi |
| `questions[].answers` | Array | ✅ | Danh sách các đáp án |
| `questions[].correct_answers` | Array | ✅ | Index của các đáp án đúng |
| `questions[].image` | String | ❌ | URL hình ảnh (optional) |

#### GET Response Format
```json
{
  "exams": [
    {
      "test_id": "test_001",
      "test_name": "Bài kiểm tra Sinh học lớp 10",
      "created_at": "2024-01-15T10:30:00Z",
      "status": "published",
      "total_questions": 2
    },
    {
      "test_id": "test_002", 
      "test_name": "Bài kiểm tra Sinh học lớp 11",
      "created_at": "2024-01-16T09:15:00Z",
      "status": "draft",
      "total_questions": 1
    }
  ],
  "count": 2,
  "success": true
}
```

#### POST Response Format
```json
{
  "result": "success",
  "message": "Bài thi đã được tạo thành công",
  "test_id": "test_001",
  "server_test_id": "server_test_12345",
  "created_at": "2024-01-15T10:30:00Z",
  "status": "published",
  "total_questions": 1,
  "max_score": 100,
  "time_limit": 60
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `result` | String | Trạng thái kết quả ("success" hoặc "error") |
| `message` | String | Thông báo kết quả |
| `test_id` | String | ID bài thi gốc |
| `server_test_id` | String | ID bài thi trên server |
| `created_at` | String | Thời gian tạo bài thi (ISO 8601) |
| `status` | String | Trạng thái bài thi ("published", "draft") |
| `total_questions` | Number | Tổng số câu hỏi |
| `max_score` | Number | Điểm số tối đa |
| `time_limit` | Number | Thời gian làm bài (phút) |

#### Error Responses
```json
{
  "result": "error",
  "message": "Không thể tạo bài thi",
  "error_code": "CREATE_TEST_FAILED",
  "details": "Thiếu thông tin bắt buộc"
}
```

#### Usage Notes
- API được gọi khi giáo viên tạo và xuất bản bài tập
- Hỗ trợ cả câu hỏi trắc nghiệm đơn và đa lựa chọn
- Thời gian được tính bằng phút
- Bài thi được tạo trên server với ID duy nhất
- Trạng thái xuất bản được đồng bộ giữa frontend và server

**Lưu ý**: API hiện tại có các endpoints cơ bản như `/login` và `/tests`. Cần kiểm tra Swagger UI để xem đầy đủ các endpoints có sẵn.

## 📚 Available APIs

### 1. Login Endpoint
```http
POST /login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "student1",
    "email": "student1@example.com"
  }
}
```

### 2. Exams Endpoint (Bài thi) - Nộp bài thi
```http
POST /exams
Content-Type: application/json

{
  "test_data": {
    "student_id": "S001",
    "test_id": "test_001", 
    "answers": [
      {
        "question_id": "q001",
        "selected_options": ["a"],
        "time_spent": 30
      }
    ],
    "total_time": 1200
  }
}
```

**Response:**
```json
{
  "result": "success",
  "score": 85,
  "max_score": 100,
  "correct_answers": 17,
  "total_questions": 20,
  "submission_id": "sub_001",
  "submitted_at": "2024-01-15T10:30:00Z",
  "detailed_results": [
    {
      "question_id": "q001",
      "is_correct": true,
      "selected_options": ["a"],
      "correct_options": ["a"],
      "explanation": "Đáp án đúng"
    }
  ]
}
```

### 3. Student Registration Excel Endpoint
```http
POST /register_excel
Content-Type: multipart/form-data

Parameters:
- file: Excel file (.xlsx or .xlsm) with columns: name, username, password
- Header row supported (case-insensitive)
```

**Success Response (201):**
```json
{
  "created": 2,
  "created_items": [
    {
      "id": 1,
      "name": "Nguyễn Văn An",
      "username": "an.nguyen"
    },
    {
      "id": 2,
      "name": "Trần Thị Bình", 
      "username": "binh.tran"
    }
  ],
  "success": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "bad request / invalid file"
}
```

**Lưu ý quan trọng:**
- API chỉ yêu cầu 3 cột: `name`, `username`, `password`
- Không hỗ trợ các trường khác như email, grade, class, school, studentId
- File phải là định dạng Excel (.xlsx hoặc .xlsm)
- Header row được hỗ trợ và không phân biệt hoa thường

### 4. Other Endpoints
Để xem đầy đủ các endpoints có sẵn, vui lòng truy cập:
**Swagger UI**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)

**Lưu ý**: API hiện tại hỗ trợ đăng ký hàng loạt học sinh qua file Excel/CSV thông qua endpoint `/register_excel`.

## 🔧 Frontend Integration

### API Service Implementation
```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // Login
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
  }

  // Exams (Bài thi)
  submitTest(testData: TestSubmissionData): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.baseUrl}/exams`, testData);
  }

  // Student Registration Excel
  registerStudentsExcel(file: File): Observable<ExcelRegistrationResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExcelRegistrationResponse>(`${this.baseUrl}/register_excel`, formData);
  }
}
```

### Type Definitions
```typescript
// models/api.model.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

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

// Error response for test submission
export interface TestErrorResponse {
  result: string;
  message: string;
  error_code?: string;
}

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
```

### Usage Examples

#### Login Example
```typescript
// components/login.component.ts
export class LoginComponent {
  constructor(private apiService: ApiService) {}

  onLogin() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Login successful:', response.user);
          // Handle successful login
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Handle login error
      }
    });
  }
}
```

#### Test Submission Example
```typescript
// components/test.component.ts
import { TestSubmissionData, TestResult } from '../models/api.model';

export class TestComponent {
  constructor(private apiService: ApiService) {}

  submitTest() {
    const testData: TestSubmissionData = {
      test_data: {
        student_id: "S001",
        test_id: "test_001",
        answers: [
          {
            question_id: "q001",
            selected_options: ["a"],
            time_spent: 30
          },
          {
            question_id: "q002",
            selected_options: ["b", "c"],
            time_spent: 45
          }
        ],
        total_time: 1200
      }
    };

    this.apiService.submitTest(testData).subscribe({
      next: (result: TestResult) => {
        console.log('Test submitted successfully:', result);
        console.log(`Score: ${result.score}/${result.max_score}`);
        console.log(`Correct answers: ${result.correct_answers}/${result.total_questions}`);
        
        // Display detailed results
        if (result.detailed_results) {
          result.detailed_results.forEach(detail => {
            console.log(`Question ${detail.question_id}: ${detail.is_correct ? 'Correct' : 'Incorrect'}`);
            if (detail.explanation) {
              console.log(`Explanation: ${detail.explanation}`);
            }
          });
        }
      },
      error: (error) => {
        console.error('Test submission failed:', error);
        // Handle submission error
      }
    });
  }
}
```

#### Student Registration Excel Example
```typescript
// components/student-management.component.ts
export class StudentManagementComponent {
  constructor(private apiService: ApiService) {}

  uploadFile(file: File) {
    this.apiService.registerStudentsExcel(file).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(`Successfully created ${response.created} students`);
          console.log('Created students:', response.created_items);
        } else {
          console.error('Registration failed');
        }
      },
      error: (error) => {
        console.error('API call failed:', error);
        // Handle API error
      }
    });
  }
}
```

## 📚 Swagger Documentation

Để xem đầy đủ các endpoints có sẵn và cấu trúc API chi tiết, vui lòng truy cập:

**Swagger UI**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)

Swagger UI cung cấp:
- Danh sách đầy đủ các endpoints
- Mô tả chi tiết về request/response
- Khả năng test API trực tiếp
- Schema definitions cho tất cả data models

### 2. Type Definitions

```typescript
// models/api.model.ts
export interface LoginCredentials {
  username: string;
  password: string;
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  grade?: number;
  class?: string;
  school?: string;
  studentId?: string;
}

export interface Student extends User {
  grade: number;
  class: string;
  school: string;
  studentId: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number;
  maxScore: number;
  questionCount?: number;
  questions?: Question[];
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
}

export interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  type: 'single' | 'multiple';
  options: AnswerOption[];
  explanation?: string;
}

export interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface ExerciseSubmission {
  answers: AnswerSubmission[];
  timeSpent: number;
}

export interface AnswerSubmission {
  questionId: string;
  selectedOptions: string[];
}

export interface SubmissionResult {
  submissionId: string;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  submittedAt: string;
  results: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  selectedOptions: string[];
  correctOptions: string[];
  explanation?: string;
}

export interface ExerciseParams {
  grade?: number;
  chapter?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface StudentListParams {
  grade?: number;
  class?: string;
  page?: number;
  limit?: number;
}

export interface CreateStudentRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  grade: number;
  class: string;
  school: string;
  studentId: string;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number;
  maxScore: number;
  questions: Omit<Question, 'id'>[];
  isPublished: boolean;
}

export interface BulkCreateResponse {
  success: boolean;
  created: number;
  errors: BulkCreateError[];
  summary: {
    totalRows: number;
    successful: number;
    failed: number;
  };
}

export interface BulkCreateError {
  row: number;
  error: string;
  data: any;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExerciseListResponse {
  exercises: Exercise[];
  pagination: PaginationInfo;
}

export interface StudentListResponse {
  students: Student[];
  pagination: PaginationInfo;
}
```

### 3. Error Handling

```typescript
// services/error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
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
          errorMessage = 'Không có quyền truy cập';
          break;
        case 403:
          errorMessage = 'Truy cập bị từ chối';
          break;
        case 404:
          errorMessage = 'Không tìm thấy tài nguyên';
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
}
```

### 4. HTTP Interceptor

```typescript
// interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

## 🔄 State Management

### 1. NgRx Store Setup

```typescript
// store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { User } from '../../models/api.model';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
```

### 2. Auth Effects

```typescript
// store/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.apiService.login(credentials).pipe(
          map((response) => {
            localStorage.setItem('auth_token', response.token);
            return AuthActions.loginSuccess({
              user: response.user,
              token: response.token
            });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
```

## 📱 Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://chimeara.pythonanywhere.com',
  swaggerUrl: 'https://chimeara.pythonanywhere.com/apidocs/',
  appName: 'BioEduTech',
  version: '1.0.0'
};

// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://chimeara.pythonanywhere.com',
  swaggerUrl: 'https://chimeara.pythonanywhere.com/apidocs/',
  appName: 'BioEduTech',
  version: '1.0.0'
};
```

## 🧪 Testing API Integration

### 1. Unit Tests

```typescript
// services/api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    const mockCredentials = { username: 'test', password: 'test', role: 'student' };
    const mockResponse = { success: true, token: 'mock-token', user: {} };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/api/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
```

### 2. Integration Tests

```typescript
// e2e/api-integration.e2e-spec.ts
import { browser, by, element } from 'protractor';

describe('API Integration', () => {
  beforeEach(() => {
    browser.get('/login');
  });

  it('should login and redirect to dashboard', () => {
    element(by.css('input[formControlName="username"]')).sendKeys('testuser');
    element(by.css('input[formControlName="password"]')).sendKeys('testpass');
    element(by.css('button[type="submit"]')).click();

    expect(browser.getCurrentUrl()).toContain('/dashboard');
  });
});
```

## 🚀 Deployment Considerations

### 1. CORS Configuration
Đảm bảo backend API đã cấu hình CORS để cho phép frontend Angular truy cập:

```python
# Backend CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "https://your-frontend-domain.com"
]
```

### 2. Environment Variables
```bash
# .env file
API_BASE_URL=https://chimeara.pythonanywhere.com
API_TIMEOUT=30000
ENABLE_LOGGING=true
```

### 3. Build Configuration
```json
// angular.json
{
  "projects": {
    "bioedutech": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## 📊 Monitoring & Analytics

### 1. API Performance Monitoring
```typescript
// services/monitoring.service.ts
@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  logApiCall(endpoint: string, duration: number, status: number) {
    console.log(`API Call: ${endpoint} - ${duration}ms - Status: ${status}`);
    // Send to analytics service
  }
}
```

### 2. Error Tracking
```typescript
// services/error-tracking.service.ts
@Injectable({
  providedIn: 'root'
})
export class ErrorTrackingService {
  trackError(error: any, context: string) {
    console.error(`Error in ${context}:`, error);
    // Send to error tracking service (e.g., Sentry)
  }
}
```

## 🔒 Security Best Practices

1. **Token Storage**: Sử dụng secure storage cho JWT tokens
2. **HTTPS Only**: Đảm bảo tất cả API calls đều qua HTTPS
3. **Input Validation**: Validate tất cả input từ API
4. **Error Handling**: Không expose sensitive information trong error messages
5. **Rate Limiting**: Implement rate limiting cho API calls

## 📞 Support & Resources

- **Swagger Documentation**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)
- **API Base URL**: `https://chimeara.pythonanywhere.com`
- **Support Email**: api-support@bioedutech.com
- **Documentation Updates**: Cập nhật thường xuyên theo API changes

---

**Lưu ý**: Tài liệu này sẽ được cập nhật thường xuyên theo sự phát triển của API backend.
