# Luồng dữ liệu và API

Tài liệu này mô tả luồng dữ liệu/API chính trong app hiện tại.

## Danh sách service

| Service | Vai trò |
| --- | --- |
| `ApiService` | HTTP wrapper cho backend |
| `AuthService` | Login, current user, localStorage auth |
| `ExerciseService` | Mapping exam API sang model frontend, parse câu hỏi, state bài thi |
| `ExcelService` | Upload/import Excel học sinh, tải template |
| `StudentManagementService` | LocalStorage học sinh cũ/backward compatibility |
| `TimerService` | Parse timer, countdown, warning/critical/time up |
| `ChatbotService` | Chat AI Sinh học |
| `AIExplanationService` | AI giải thích đáp án ở màn kết quả |

## API gốc

```text
https://chimeara.pythonanywhere.com
```

Code:

```ts
private baseUrl = 'https://chimeara.pythonanywhere.com';
```

## Luồng xác thực

```text
LoginComponent
  -> AuthService.login()
  -> ApiService.loginStudent()
  -> POST /login
  -> map ApiAuthResponse to User
  -> localStorage.currentUser
  -> navigate by role
```

## Luồng dashboard giáo viên

```text
TeacherDashboardComponent.ngOnInit()
  -> AuthService.getCurrentTeacher()
  -> ExerciseService.getExerciseStats()
  -> ApiService.getStudents(1, 100)
  -> ApiService.getTests(1, 100)
```

Dashboard gán trực tiếp `response.count` của API học sinh vào `totalStudents`.
Production ngày 28/07/2026 cho thấy endpoint có query `role=student` vẫn trả cả
giáo viên và các role cũ, nên số tổng trên dashboard có thể cao hơn số học sinh thực.

## Luồng tạo bài thi

```text
CreateExerciseComponent.saveExercise()
  -> validate Reactive Form
  -> validate questions array
  -> map Question[] to TestCreationRequest
  -> ApiService.createTest()
  -> POST /exams
  -> navigate /exercise-list
```

### Frontend Question

```ts
{
  id: string;
  content: string;
  imageUrl?: string;
  options: {
    id: string;
    content: string;
    isCorrect: boolean;
    order: number;
  }[];
  type: 'single' | 'multiple';
  explanation?: string;
  order: number;
}
```

### API Question

```ts
{
  content: string;
  answers: string[];
  correct_answers: number[];
  image?: string;
}
```

## Luồng tải ảnh

```text
CreateExerciseComponent.onImageUpload()
  -> ExerciseService.uploadImage()
  -> validate file type/size
  -> ApiService.uploadImage()
  -> POST /images multipart field "file"
  -> save filename to question.imageUrl
```

## Luồng danh sách bài thi

```text
ExerciseListComponent.loadExercises()
  -> ExerciseService.loadExercisesFromServer()
  -> ApiService.getTests(1, 100)
  -> GET /exams
  -> convert TestListItem[] to Exercise[]
  -> applyFilters()
```

## Luồng xem chi tiết bài thi

```text
ViewExerciseComponent.loadExercise(id)
  -> ExerciseService.getTestDetailFromServer(id)
  -> ApiService.getTestDetail(id)
  -> GET /exams/{id}
  -> convert TestDetailResponse to Exercise
  -> render questions/options/correct answers
```

## Luồng dashboard học sinh

```text
StudentDashboardComponent.loadExams()
  -> ApiService.getTests(1, 1000)
  -> GET /exams
  -> filter/search/paginate client-side
```

## Luồng làm bài thi

```text
TakeExamComponent.ngOnInit()
  -> route param id
  -> ApiService.getTestDetail(id)
  -> initialize answers
  -> initialize timer
```

### Timer Priority

```text
if exam.timer:
  TimerService.parseTimerString(exam.timer)
else if exam.time_limit:
  exam.time_limit * 60
else:
  no timer
```

Supported timer examples:

```text
30m
1h
45s
1h30m
1h 30m
2h15m30s
```

### Submit

```text
TakeExamComponent.performSubmission()
  -> calculate time_taken from examStartTime
  -> get student id from AuthService
  -> ApiService.submitExam(examId, submissionData)
  -> POST /exams/{examId}/submit
  -> navigate /student/exam-result/{examId}?answers=...
```

Request:

```json
{
  "student_id": 1,
  "answers": [[1], [0, 2]],
  "time_taken": 120
}
```

## Luồng kết quả bài thi

```text
ExamResultComponent.ngOnInit()
  -> route param id
  -> query param answers
  -> ApiService.getTestDetail(id)
  -> compare user answers with correct_answers
  -> calculate local result
```

AI explanation:

```text
ExamResultComponent.askAIExplanation(index)
  -> AIExplanationService.getExplanation()
  -> POST https://api.openai.com/v1/chat/completions
  -> Authorization: Bearer AI_CONFIG.OPENAI_API_KEY
  -> render aiExplanation
```

## Luồng quản lý học sinh

```text
StudentManagementComponent.ngOnInit()
  -> ApiService.getStudents()
  -> GET /users?role=student
  -> filter role student
  -> paginate filteredStudents locally
  -> render paginatedStudents
```

Danh sách mặc định hiển thị 20 học sinh mỗi trang. Giáo viên có thể chọn 10, 20
hoặc 50 dòng; tìm kiếm và thay đổi kích thước trang đều đưa danh sách về trang đầu.

Upload:

```text
StudentManagementComponent.uploadFile()
  -> ExcelService.registerStudentsFromExcel(file)
  -> ApiService.registerStudentsExcel(file)
  -> POST /register_excel multipart field "file"
  -> reload students
```

Delete:

```text
StudentManagementComponent.deleteStudent(student)
  -> confirm
  -> ApiService.deleteUser(student.id)
  -> DELETE /users/{id}
  -> remove from local arrays
```

## Luồng báo cáo giáo viên

```text
TeacherReportsComponent.loadExamReports()
  -> ExerciseService.loadExercisesFromServer()
  -> GET /exams
  -> processExamReports()
  -> for each exam: ApiService.getExamResults(exam.id)
  -> GET /exams/{id}/results
  -> aggregate totalSubmissions, averageScore, averageTimeTaken
```

Details modal:

```text
TeacherReportsComponent.viewExamDetails(examId)
  -> ApiService.getExamResults(examId)
  -> filter result.student !== null
  -> render selectedExamResults
```

## Luồng chatbot

```text
ChatbotComponent.sendMessage()
  -> append user message
  -> ChatbotService.sendMessage(messages)
  -> POST https://api.openai.com/v1/chat/completions
  -> Authorization: Bearer AI_CONFIG.OPENAI_API_KEY
  -> append assistant response
  -> save local history
```

## Luồng gọi AI trực tiếp

```text
Angular service
  -> reads OPENAI_API_KEY from src/app/config/ai-config.ts
  -> POST https://api.openai.com/v1/chat/completions
```

This follows the legacy direct-browser integration. Keep the real key only in ignored local config, never in tracked template/docs.

## Rủi ro dữ liệu đã biết

- `GET /exams/{id}` includes `correct_answers`; student exam screen receives correct answers before submit.
- Exam result page computes score locally from query param answers and `correct_answers`.
- `student_id` fallback in submit is `1` when no auth student is found.
- Dashboard giáo viên dùng `response.count` từ endpoint học sinh dù response
  production chưa lọc đúng `role=student`.
- Some services still contain localStorage fallback/backward compatibility paths.
