# Cấu Trúc Dự Án BioEduTech

Tài liệu này mô tả cấu trúc code hiện tại của repo. Nếu có khác biệt với tài liệu feature/fix cũ, ưu tiên tài liệu này và code trong `src/app`.

## Tổng Quan

BioEduTech là Angular 17 application dùng standalone components. App không dùng NgModule truyền thống cho feature modules và hiện chưa lazy-load routes.

```text
bioedutech/
  angular.json
  package.json
  tsconfig*.json
  src/
    main.ts
    styles.scss
    index.html
    assets/
    app/
      app.component.*
      app.config.ts
      app.routes.ts
      config/
      models/
      services/
      components/
```

## Entry Points

- `src/main.ts`: bootstrap `AppComponent` với `appConfig`.
- `src/app/app.config.ts`: cấu hình router, HttpClient và Angular Material animations.
- `src/app/app.routes.ts`: khai báo toàn bộ route hiện hành.
- `src/app/app.component.html`: chỉ chứa `<router-outlet>`.

## Components

### Public/Auth

- `landing-page`: trang giới thiệu đầu tiên, điều hướng đến đăng nhập.
- `login`: form đăng nhập, gọi `AuthService.login()`.
- `login-test`: component dev/test API đăng nhập.

### Teacher

- `teacher-dashboard`: dashboard giáo viên, load số học sinh và bài thi từ API.
- `teacher-header`: header/navigation dùng trong các màn giáo viên.
- `exercise-list`: danh sách bài thi từ API, search, view detail, delete.
- `exercise-card`: card hiển thị từng bài thi.
- `create-exercise`: tạo bài thi, parse câu hỏi, upload ảnh, submit `/exams`.
- `view-exercise`: xem chi tiết bài thi qua `GET /exams/{id}`.
- `teacher-reports`: báo cáo kết quả bài thi, tổng hợp từ `/exams/{id}/results`.
- `student-management`: upload Excel/CSV, xem/xóa học sinh.
- `api-test`, `parse-demo`: màn hỗ trợ dev/test.

### Student

- `student-layout`: layout cha cho nhóm route học sinh.
- `student-header`, `student-footer`: header/footer học sinh.
- `student-dashboard`: danh sách bài thi cho học sinh.
- `take-exam`: làm bài, chọn đáp án, timer, submit.
- `exam-result`: so đáp án, hiển thị kết quả, gọi AI explanation.

### Shared/Other

- `chatbot`: widget chat AI Sinh học.
- `view-exercise-header`, `view-exercise-footer`: layout phụ cho màn xem bài.
- `layout`: layout cũ/tổng quát, hiện không phải route wrapper chính.

## Services

### `ApiService`

File: `src/app/services/api.service.ts`

Vai trò: wrapper HTTP cho backend `https://chimeara.pythonanywhere.com`.

Nhóm method chính:

- Auth: `loginStudent()`
- Exams: `createTest()`, `getTests()`, `getTestDetail()`, `submitExam()`, `getExamResults()`, `deleteExam()`
- Images: `uploadImage()`, `getImage()`, `getImageUrl()`
- Users: `getUsers()`, `getStudents()`, `getTeachers()`, `deleteUser()`
- Excel: `registerStudentsExcel()`, `downloadExcelTemplate()`

### `ExerciseService`

Vai trò: state/mapping cho bài thi theo model frontend.

- Giữ `BehaviorSubject<Exercise[]>`.
- Parse text câu hỏi theo format `a)`, `b)`, `(đúng)`.
- Convert API `exam_name`, `answers`, `correct_answers` sang `Exercise`, `Question`, `AnswerOption`.
- Có một số method localStorage cũ cho draft/backward compatibility.

### `AuthService`

Vai trò: đăng nhập, giữ current user trong `BehaviorSubject`, persist `currentUser` vào `localStorage`.

### `ExcelService`

Vai trò: validate file Excel/CSV, upload qua API, fallback tạo template local nếu API template lỗi.

### `TimerService`

Vai trò: parse timer đơn vị đơn (`2m`, `1h`, `30s`), đếm ngược, warning/critical threshold, format thời gian.

### AI Services

- `ChatbotService`: gửi lịch sử chat lên OpenAI-compatible API.
- `AIExplanationService`: tạo prompt giải thích đáp án sau bài thi.

## Models

### `exercise.model.ts`

- `Exercise`
- `Question`
- `AnswerOption`
- `CreateExerciseRequest`
- `QuestionParseResult`
- `ImageUploadResult`
- `ExerciseStats`

### `user.model.ts`

- `BaseUser`
- `StudentUser`
- `TeacherUser`
- `LoginCredentials`
- registration interfaces
- `AuthResponse`

## Routes

```ts
{ path: '', component: LandingPageComponent }
{ path: 'home', component: LandingPageComponent }
{ path: 'login', component: LoginComponent }
{ path: 'login-test', component: LoginTestComponent }
{ path: 'teacher', component: TeacherDashboardComponent }
{ path: 'teacher-dashboard', component: TeacherDashboardComponent }
{ path: 'teacher/students', component: StudentManagementComponent }
{ path: 'create-exercise', component: CreateExerciseComponent }
{ path: 'edit-exercise/:id', component: CreateExerciseComponent }
{ path: 'exercise-list', component: ExerciseListComponent }
{ path: 'reports', component: TeacherReportsComponent }
{ path: 'parse-demo', component: ParseDemoComponent }
{ path: 'api-test', component: ApiTestComponent }
{ path: 'student', component: StudentLayoutComponent, children: [...] }
{ path: 'student-dashboard', component: StudentLayoutComponent, children: [...] }
{ path: 'view-exercise/:id', component: StudentLayoutComponent, children: [...] }
{ path: '**', redirectTo: '' }
```

Lưu ý: code hiện có call điều hướng `/exam-report/:id` trong `ExerciseListComponent.viewReport()`, nhưng route này chưa được khai báo.

## Styling

- Global styles: `src/styles.scss`.
- Mỗi component có SCSS riêng.
- Angular Material theme được define trong `styles.scss`.
- App dùng nhiều class custom như `btn`, `card`, grid, dashboard layout.

## Testing Và Build

Scripts hiện có:

```bash
npm run build
npm test
npm run test:ci
```

Trạng thái đã kiểm tra:

- `npm run build` thành công.
- Có warning bundle initial vượt budget.
- Tài liệu cũ có nhắc Jest/Cypress, lazy loading, OnPush nhưng code hiện tại chưa cấu hình/áp dụng các phần đó.

## Tài Liệu Lịch Sử

Repo có nhiều file markdown dạng nhật ký triển khai: `*_FEATURE*.md`, `*_FIX*.md`, `*_UPDATE*.md`, `*_GUIDE.md`. Các file này hữu ích để hiểu quyết định cũ, nhưng khi cần thông tin hiện hành hãy ưu tiên:

- `README.md`
- `PROJECT_STRUCTURE.md`
- `QUICK_START_GUIDE.md`
- `API_INTEGRATION_GUIDE.md`
- `DOCUMENTATION_INDEX.md`
