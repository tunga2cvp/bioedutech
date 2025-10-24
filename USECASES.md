# 📚 Use Cases - BioEduTech Platform

## 📋 Mục lục
- [Tổng quan Use Cases](#tổng-quan-use-cases)
- [Use Cases cho Học sinh](#use-cases-cho-học-sinh)
- [Use Cases cho Giáo viên](#use-cases-cho-giáo-viên)
- [Use Cases cho Quản trị viên](#use-cases-cho-quản-trị-viên)
- [Use Cases kỹ thuật](#use-cases-kỹ-thuật)
- [API Use Cases](#api-use-cases)

## 🎯 Tổng quan Use Cases

BioEduTech được thiết kế để phục vụ 3 nhóm người dùng chính:
- **Học sinh THPT** (Lớp 10-12)
- **Giáo viên Sinh học**
- **Quản trị viên hệ thống**

---

## 👨‍🎓 Use Cases cho Học sinh

### UC-001: Đăng nhập tài khoản học sinh
**Mô tả**: Học sinh đăng nhập vào hệ thống bằng tài khoản được giáo viên tạo

**Luồng thực hiện**:
1. Truy cập trang chủ BioEduTech
2. Click nút "Đăng nhập"
3. Chọn loại tài khoản "Học sinh"
4. Nhập thông tin:
   - Username (được giáo viên cung cấp)
   - Password (được giáo viên cung cấp)
5. Click "Đăng nhập"
6. Hệ thống xác thực thông tin
7. Chuyển hướng đến Student Dashboard

**Kết quả mong đợi**: Học sinh đăng nhập thành công và truy cập được dashboard

**Code Example**:
```typescript
// services/auth.service.ts
login(credentials: LoginCredentials): AuthResponse {
  if (credentials.role === 'student') {
    const existingStudents = this.getStoredStudents();
    const student = existingStudents.find(s => s.username === credentials.username);
    
    if (student && student.password === credentials.password) {
      this.currentUserSubject.next(student);
      return { success: true, user: student, token: 'mock-jwt-token' };
    }
  }
  return { success: false, message: 'Tài khoản không tồn tại' };
}
```

### UC-002: Đăng nhập hệ thống
**Mô tả**: Học sinh đăng nhập vào hệ thống

**Luồng thực hiện**:
1. Truy cập trang đăng nhập
2. Nhập email và mật khẩu
3. Click "Đăng nhập"
4. Hệ thống xác thực thông tin
5. Chuyển hướng đến Student Dashboard

**Kết quả mong đợi**: Học sinh được đăng nhập và truy cập dashboard

### UC-003: Xem tài liệu học tập
**Mô tả**: Học sinh xem tài liệu học tập theo chương

**Luồng thực hiện**:
1. Đăng nhập vào hệ thống
2. Từ dashboard, chọn "Tài liệu"
3. Chọn lớp học (10/11/12)
4. Chọn chương học
5. Xem danh sách tài liệu:
   - Bài giảng PowerPoint
   - Tóm tắt lý thuyết
   - Đề kiểm tra mẫu
6. Click để tải xuống hoặc xem online

**Kết quả mong đợi**: Học sinh có thể truy cập tài liệu học tập

### UC-004: Làm bài tập thực hành
**Mô tả**: Học sinh làm bài tập theo chương học

**Luồng thực hiện**:
1. Chọn "Bài tập" từ menu
2. Chọn lớp và chương
3. Xem danh sách bài tập:
   - Bài tập cơ bản
   - Bài tập nâng cao
   - Bài tập tổng hợp
4. Chọn bài tập để làm
5. Làm bài và submit
6. Xem kết quả và đáp án

**Kết quả mong đợi**: Học sinh hoàn thành bài tập và nhận phản hồi

### UC-005: Thi trắc nghiệm
**Mô tả**: Học sinh tham gia thi trắc nghiệm tự động

**Luồng thực hiện**:
1. Chọn "Trắc nghiệm" từ menu
2. Chọn chủ đề và độ khó
3. Hệ thống tạo đề thi ngẫu nhiên
4. Làm bài trong thời gian quy định
5. Submit bài thi
6. Xem kết quả ngay lập tức:
   - Điểm số
   - Đáp án đúng/sai
   - Giải thích chi tiết
7. Lưu kết quả vào lịch sử

**Kết quả mong đợi**: Học sinh nhận được đánh giá chính xác về kiến thức

### UC-006: Theo dõi tiến độ học tập
**Mô tả**: Học sinh xem báo cáo tiến độ học tập

**Luồng thực hiện**:
1. Truy cập "Tiến độ học tập" từ dashboard
2. Xem thống kê tổng quan:
   - Số bài tập đã hoàn thành
   - Điểm trung bình các bài thi
   - Thời gian học tập
   - Xếp hạng trong lớp
3. Xem chi tiết theo từng chương
4. Tải báo cáo PDF

**Kết quả mong đợi**: Học sinh có cái nhìn tổng quan về tiến độ học tập

---

## 👩‍🏫 Use Cases cho Giáo viên

### UC-007: Đăng nhập tài khoản giáo viên
**Mô tả**: Giáo viên đăng nhập vào hệ thống bằng tài khoản cố định

**Luồng thực hiện**:
1. Truy cập trang chủ BioEduTech
2. Click nút "Đăng nhập"
3. Chọn loại tài khoản "Giáo viên"
4. Nhập thông tin:
   - Username: `giaovien`
   - Password: `123456`
5. Click "Đăng nhập"
6. Hệ thống xác thực thông tin
7. Chuyển hướng đến Teacher Dashboard

**Kết quả mong đợi**: Giáo viên đăng nhập thành công và truy cập được dashboard

### UC-008: Quản lý học sinh
**Mô tả**: Giáo viên tạo và quản lý tài khoản học sinh

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Click "Quản lý học sinh"
3. Chọn phương thức tạo tài khoản:

**A. Upload file Excel/CSV (Tab mặc định)**:
4. Click "Tải template Excel"
5. Điền thông tin học sinh vào file Excel:
   - name, username, email, password, grade, class, school, studentId
6. Upload file Excel/CSV
7. Hệ thống xử lý và tạo tài khoản hàng loạt qua API backend

**B. Tạo học sinh nhanh**:
4. Chuyển sang tab "Thêm học sinh nhanh"
5. Điền thông tin học sinh:
   - Họ tên, Username, Email, Mật khẩu
   - Lớp, Lớp học, Trường học, Mã học sinh
6. Click "Thêm học sinh"

**Kết quả mong đợi**: Tài khoản học sinh được tạo thành công

**Code Example**:
```typescript
// services/excel.service.ts
parseStudentExcel(file: File): Observable<ExcelParseResult> {
  // Parse Excel file and create student accounts
  const students = this.convertToStudents(data);
  this.authService.saveStudents(students);
  return { success: true, students, errors: [] };
}
```

### UC-008A: Đăng ký hàng loạt học sinh qua API
**Mô tả**: Giáo viên đăng ký nhiều học sinh cùng lúc thông qua API backend

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Truy cập "Quản lý học sinh"
3. Chọn "Upload file Excel/CSV"
4. Tải template Excel hoặc chuẩn bị file CSV
5. Điền thông tin học sinh vào file:
   - Họ tên, Username, Email, Mật khẩu
   - Lớp (10/11/12), Lớp học, Trường học, Mã học sinh
6. Upload file lên hệ thống
7. Hệ thống parse file và gửi dữ liệu đến API `/register_excel`
8. API xử lý và tạo tài khoản học sinh
9. Hiển thị kết quả:
   - Số lượng tài khoản tạo thành công
   - Danh sách lỗi (nếu có)
   - Thông tin chi tiết từng học sinh đã tạo

**Kết quả mong đợi**: 
- Tài khoản học sinh được tạo thành công trên backend
- Dữ liệu được đồng bộ giữa frontend và backend
- Báo cáo chi tiết về kết quả đăng ký

**Code Example**:
```typescript
// services/api.service.ts
registerStudentsExcel(file: File): Observable<ExcelRegistrationResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<ExcelRegistrationResponse>(`${this.baseUrl}/register_excel`, formData);
}

// services/excel.service.ts
registerStudentsFromExcel(file: File): Observable<ExcelRegistrationResponse> {
  // Validate file type (.xlsx, .xls, .xlsm)
  const allowedExtensions = ['.xlsx', '.xls', '.xlsm'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(fileExtension)) {
    return of({
      success: false,
      created: 0,
      created_items: []
    });
  }

  // Call API directly with file
  return this.apiService.registerStudentsExcel(file);
}
```

### UC-009: Xem danh sách học sinh
**Mô tả**: Giáo viên xem và quản lý danh sách học sinh đã tạo

**Luồng thực hiện**:
1. Truy cập trang "Quản lý học sinh"
2. Xem danh sách học sinh trong bảng
3. Sử dụng tính năng tìm kiếm:
   - Tìm theo tên, email, mã học sinh
4. Lọc theo lớp:
   - Lớp 10, 11, 12
5. Thực hiện thao tác:
   - Chỉnh sửa thông tin học sinh
   - Xóa tài khoản học sinh

**Kết quả mong đợi**: Giáo viên có thể quản lý hiệu quả danh sách học sinh

### UC-009: Tạo và quản lý tài liệu
**Mô tả**: Giáo viên upload và quản lý tài liệu học tập

**Luồng thực hiện**:
1. Chọn "Quản lý tài liệu"
2. Tạo thư mục theo chương
3. Upload tài liệu:
   - PowerPoint bài giảng
   - PDF tóm tắt
   - Video bài giảng
   - Hình ảnh minh họa
4. Phân loại và gắn tag
5. Cài đặt quyền truy cập
6. Xuất bản tài liệu

**Kết quả mong đợi**: Tài liệu được tổ chức và chia sẻ với học sinh

### UC-010: Tạo bài tập trắc nghiệm
**Mô tả**: Giáo viên tạo bài tập trắc nghiệm với câu hỏi có thể có ảnh minh họa

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Chọn "Tạo bài tập" từ menu
3. Nhập thông tin bài tập cơ bản:
   - Tên bài tập
   - Mô tả bài tập
   - Lớp học áp dụng (10/11/12)
   - Chương học
   - Thời gian làm bài (phút)
   - Điểm tối đa
4. Thêm danh sách câu hỏi trắc nghiệm:

**A. Nhập câu hỏi theo format chuẩn**:
5. Chọn "Thêm câu hỏi"
6. Nhập câu hỏi theo format:
   ```
   Câu hỏi: avc?
   a) aaa
   b) bbb  
   c) ccc (đúng)
   ```
   Hoặc cho câu hỏi multiple choice:
   ```
   Câu hỏi: Chọn các đáp án đúng?
   a) aaa (đúng)
   b) bbb
   c) ccc (đúng)
   d) ddd
   ```

**B. Thêm ảnh minh họa (tùy chọn)**:
7. Click "Thêm ảnh" cho câu hỏi
8. Upload file ảnh (JPG, PNG, GIF)
9. Hệ thống tự động resize và tối ưu ảnh
10. Xem preview ảnh trước khi lưu

**C. Quản lý câu hỏi**:
11. Xem danh sách câu hỏi đã thêm
12. Chỉnh sửa câu hỏi bất kỳ
13. Xóa câu hỏi không cần thiết
14. Sắp xếp thứ tự câu hỏi
15. Xem preview toàn bộ bài tập

**D. Cài đặt và xuất bản**:
16. Cài đặt tham số bổ sung:
    - Số lần làm lại cho phép
    - Hiển thị đáp án sau khi làm xong
    - Thời gian bắt đầu và kết thúc
    - Phân bổ cho lớp học cụ thể
17. Lưu bài tập
18. Xuất bản cho học sinh

**Kết quả mong đợi**: Bài tập trắc nghiệm được tạo hoàn chỉnh với câu hỏi có ảnh minh họa và phân bổ cho học sinh

**Code Example**:
```typescript
// models/exercise.model.ts
export interface Exercise {
  id: string;
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number; // minutes
  maxScore: number;
  questions: Question[];
  createdAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
}

export interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  options: AnswerOption[];
  type: 'single' | 'multiple';
  explanation?: string;
}

export interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

// services/exercise.service.ts
createExercise(exerciseData: CreateExerciseRequest): Observable<Exercise> {
  // Parse questions from text format
  const questions = this.parseQuestions(exerciseData.questionsText);
  const exercise = { ...exerciseData, questions };
  return this.saveExercise(exercise);
}

parseQuestions(questionsText: string): Question[] {
  // Parse format: "avc? a) aaa b) bbb c) ccc (đúng)"
  const lines = questionsText.split('\n');
  // Implementation for parsing question format
}
```

### UC-011: Chấm bài và đánh giá
**Mô tả**: Giáo viên chấm bài và đánh giá kết quả học sinh

**Luồng thực hiện**:
1. Truy cập "Chấm bài"
2. Xem danh sách bài nộp:
   - Bài tập tự luận
   - Bài thi trắc nghiệm (tự động chấm)
3. Chấm bài tự luận:
   - Xem bài làm của học sinh
   - Chấm điểm và nhận xét
   - Lưu kết quả
4. Xem báo cáo tổng hợp
5. Gửi phản hồi cho học sinh

**Kết quả mong đợi**: Học sinh nhận được đánh giá chi tiết

### UC-012: Theo dõi tiến độ lớp học
**Mô tả**: Giáo viên theo dõi tiến độ học tập của cả lớp

**Luồng thực hiện**:
1. Chọn "Báo cáo lớp học"
2. Chọn lớp và thời gian
3. Xem thống kê:
   - Tỷ lệ hoàn thành bài tập
   - Điểm trung bình lớp
   - Học sinh cần hỗ trợ
   - Xu hướng học tập
4. Xuất báo cáo chi tiết
5. Gửi báo cáo cho phụ huynh

**Kết quả mong đợi**: Giáo viên có cái nhìn tổng quan về lớp học

---

## 👨‍💼 Use Cases cho Quản trị viên

### UC-013: Quản lý người dùng
**Mô tả**: Admin quản lý tất cả tài khoản trong hệ thống

**Luồng thực hiện**:
1. Đăng nhập Admin Panel
2. Truy cập "Quản lý người dùng"
3. Xem danh sách tài khoản:
   - Học sinh
   - Giáo viên
   - Admin
4. Thực hiện các thao tác:
   - Duyệt tài khoản giáo viên
   - Khóa/mở khóa tài khoản
   - Reset mật khẩu
   - Xóa tài khoản
5. Xuất báo cáo người dùng

**Kết quả mong đợi**: Hệ thống được quản lý hiệu quả

### UC-014: Quản lý nội dung hệ thống
**Mô tả**: Admin quản lý nội dung và cấu hình hệ thống

**Luồng thực hiện**:
1. Truy cập "Quản lý nội dung"
2. Quản lý danh mục:
   - Môn học
   - Khối lớp
   - Chương học
3. Quản lý câu hỏi trắc nghiệm:
   - Thêm/sửa/xóa câu hỏi
   - Phân loại theo độ khó
   - Import từ file Excel
4. Cấu hình hệ thống:
   - Thời gian thi
   - Điểm đậu
   - Thông báo

**Kết quả mong đợi**: Nội dung hệ thống được cập nhật và tổ chức

---

## 🔧 Use Cases kỹ thuật

### UC-015: Backup và restore dữ liệu
**Mô tả**: Hệ thống tự động backup và có thể restore dữ liệu

**Luồng thực hiện**:
1. Hệ thống tự động backup hàng ngày
2. Lưu trữ backup tại nhiều vị trí
3. Admin có thể restore dữ liệu:
   - Chọn thời điểm restore
   - Chọn loại dữ liệu
   - Xác nhận restore
4. Hệ thống thông báo kết quả

**Kết quả mong đợi**: Dữ liệu được bảo vệ an toàn

### UC-016: Monitoring và logging
**Mô tả**: Hệ thống theo dõi hoạt động và ghi log

**Luồng thực hiện**:
1. Hệ thống ghi log tất cả hoạt động:
   - Đăng nhập/đăng xuất
   - Thao tác với dữ liệu
   - Lỗi hệ thống
2. Admin xem dashboard monitoring:
   - Số lượng người dùng online
   - Hiệu suất hệ thống
   - Lỗi và cảnh báo
3. Cấu hình cảnh báo tự động

**Kết quả mong đợi**: Hệ thống hoạt động ổn định

---

## 🌐 API Use Cases

### UC-017: RESTful API Integration
**Mô tả**: Tích hợp với Backend API qua Swagger documentation

**API Base URL**: `https://chimeara.pythonanywhere.com`
**Swagger UI**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)

**Endpoints chính**:
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token

// Student APIs
GET /api/students/profile
GET /api/students/exercises
GET /api/students/exercises/{id}
POST /api/students/exercises/{id}/submit
GET /api/students/progress

// Teacher APIs
GET /api/teachers/profile
GET /api/teachers/students
POST /api/teachers/students
POST /api/teachers/students/bulk
GET /api/teachers/exercises
POST /api/teachers/exercises
GET /api/teachers/exercises/{id}/submissions

// Content APIs
GET /api/materials/{chapterId}
GET /api/quizzes/{quizId}
POST /api/quizzes/submit
```

**Luồng thực hiện**:
1. Frontend gọi API authentication để đăng nhập
2. Nhận JWT token và lưu vào localStorage
3. Sử dụng token cho tất cả API calls tiếp theo
4. Implement error handling và retry logic
5. Cache dữ liệu để tối ưu performance

**Code Example**:
```typescript
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://chimeara.pythonanywhere.com';
  private token = localStorage.getItem('auth_token');

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/api/auth/login`, credentials);
  }

  getStudentProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/api/students/profile`, {
      headers: this.getHeaders()
    });
  }
}
```

### UC-018: JWT Authentication Flow
**Mô tả**: Xác thực người dùng qua JWT token với Backend API

**Luồng thực hiện**:
1. Người dùng nhập thông tin đăng nhập
2. Frontend gửi POST request đến `/api/auth/login`
3. Backend xác thực và trả về JWT token
4. Frontend lưu token vào localStorage
5. Tất cả API calls tiếp theo đều kèm token trong header
6. Token có thời hạn và cần refresh khi hết hạn

**Code Example**:
```typescript
// services/auth.service.ts
login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.apiService.login(credentials).pipe(
    tap(response => {
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        this.currentUserSubject.next(response.user);
      }
    }),
    catchError(error => {
      console.error('Login failed:', error);
      return throwError(error);
    })
  );
}

logout(): void {
  localStorage.removeItem('auth_token');
  this.currentUserSubject.next(null);
  this.router.navigate(['/login']);
}
```

**Kết quả mong đợi**: Người dùng được xác thực an toàn và có quyền truy cập phù hợp

### UC-019: API Error Handling
**Mô tả**: Xử lý lỗi từ Backend API một cách graceful

**Luồng thực hiện**:
1. Implement HTTP Interceptor để catch tất cả API errors
2. Phân loại lỗi theo status code (400, 401, 403, 404, 500)
3. Hiển thị thông báo lỗi phù hợp cho người dùng
4. Log lỗi để debug và monitoring
5. Retry logic cho network errors
6. Fallback UI khi API không khả dụng

**Code Example**:
```typescript
// interceptors/error.interceptor.ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }
}
```

**Kết quả mong đợi**: Ứng dụng hoạt động ổn định ngay cả khi có lỗi API

### UC-020: Real-time notifications
**Mô tả**: Gửi thông báo real-time cho người dùng

**Luồng thực hiện**:
1. Sử dụng WebSocket hoặc Server-Sent Events
2. Gửi thông báo khi:
   - Có bài tập mới
   - Có kết quả chấm bài
   - Có thông báo từ giáo viên
3. Người dùng nhận thông báo ngay lập tức

**Kết quả mong đợi**: Người dùng được thông báo kịp thời

---

## 📊 Metrics và KPIs

### Học sinh
- Thời gian học tập trung bình/ngày
- Tỷ lệ hoàn thành bài tập
- Điểm trung bình các bài thi
- Số lần truy cập tài liệu

### Giáo viên
- Số lượng học sinh trong lớp
- Tỷ lệ hoàn thành bài tập của lớp
- Thời gian phản hồi bài tập
- Mức độ tương tác với học sinh

### Hệ thống
- Uptime (99.9%)
- Thời gian phản hồi API (< 200ms)
- Số lượng người dùng đồng thời
- Tỷ lệ lỗi (< 0.1%)
- API response time (< 500ms)
- JWT token refresh success rate (> 95%)
- API error rate (< 1%)

---

## 🔄 Workflow Integration

### Integration với hệ thống khác
- **Backend API**: Tích hợp với [https://chimeara.pythonanywhere.com](https://chimeara.pythonanywhere.com)
- **Swagger Documentation**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)
- **LMS hiện có**: Import/export dữ liệu
- **Google Classroom**: Đồng bộ lớp học
- **Microsoft Teams**: Tích hợp video call
- **Email system**: Gửi thông báo tự động

### Mobile App Integration
- **React Native**: Ứng dụng mobile
- **Push notifications**: Thông báo đẩy
- **Offline mode**: Học offline
- **Sync**: Đồng bộ dữ liệu
- **API Integration**: Sử dụng cùng Backend API

---

**Lưu ý**: Tài liệu Use Cases này sẽ được cập nhật thường xuyên theo yêu cầu phát triển của dự án.
