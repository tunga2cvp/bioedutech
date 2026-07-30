# Development Guide

Tài liệu dành cho developer làm việc trên code hiện tại của BioEduTech.

## Stack Hiện Tại

- Angular 17 standalone components.
- TypeScript 5.4.
- SCSS.
- Angular Material 17.
- RxJS.
- `xlsx` cho xử lý Excel.
- Backend API: `https://chimeara.pythonanywhere.com`.

## Setup

```bash
npm install
npm start
```

Dev server mặc định:

```text
http://localhost:4200
```

Build:

```bash
npm run build
```

## Scripts

| Script | Mục đích |
| --- | --- |
| `npm start` | Chạy `ng serve` |
| `npm run build` | Build production |
| `npm run build:dev` | Build development |
| `npm test` | Chạy Angular/Karma tests |
| `npm run test:ci` | Test headless |
| `npm run clean` | Xóa `dist` |

## Kiến Trúc Code

App hiện dùng standalone components và route trực tiếp trong `app.routes.ts`.

Các thư mục chính:

```text
src/app/
  components/
  services/
  models/
  config/
  app.routes.ts
  app.config.ts
```

Đọc thêm:

- `PROJECT_STRUCTURE.md`
- `API_INTEGRATION_GUIDE.md`

## Quy Ước Khi Sửa Code

- Ưu tiên giữ pattern hiện tại của component/service.
- Với API contract, cập nhật interface trong `api.service.ts` trước rồi mới dùng ở component.
- Khi route thay đổi, cập nhật `app.routes.ts`, navigation trong header/footer, và `README.md`.
- Khi thay đổi response/request API, cập nhật `API_INTEGRATION_GUIDE.md`.
- Khi thêm flow người dùng mới, cập nhật `USECASES.md` hoặc tài liệu feature tương ứng.

## API

Base URL hiện hard-code:

```ts
private baseUrl = 'https://chimeara.pythonanywhere.com';
```

Code hiện chưa có `src/environments`. Nếu cần tách dev/prod API URL, nên làm thành một refactor riêng:

1. Tạo `src/environments/environment.ts`.
2. Tạo `src/environments/environment.prod.ts`.
3. Cập nhật `angular.json` file replacements.
4. Inject `environment.apiUrl` vào `ApiService`.
5. Cập nhật tài liệu và kiểm tra build.

## Auth

- `LoginComponent` gọi `AuthService.login()`.
- `AuthService` gọi `ApiService.loginStudent()`.
- Role lấy từ backend response.
- User được lưu ở `localStorage.currentUser`.
- Một số màn giáo viên/học sinh đọc user từ `AuthService`.

## Exams

Luồng tạo bài:

```text
CreateExerciseComponent
  -> ApiService.createTest()
  -> POST /exams
```

Luồng danh sách:

```text
ExerciseListComponent
  -> ExerciseService.loadExercisesFromServer()
  -> ApiService.getTests()
  -> GET /exams
```

Luồng làm bài:

```text
StudentDashboardComponent
  -> TakeExamComponent
  -> ApiService.getTestDetail()
  -> ApiService.submitExam()
```

## Students

Luồng quản lý học sinh:

```text
StudentManagementComponent
  -> ApiService.getStudents()
  -> ExcelService.registerStudentsFromExcel()
  -> ApiService.registerStudentsExcel()
```

## Reports

`TeacherReportsComponent` load danh sách bài thi, sau đó gọi song song kết quả từng bài:

```text
GET /exams
GET /exams/{exam_id}/results
```

## Timer

`TimerService.parseTimerString()` hiện hỗ trợ:

- `30m`
- `1h`
- `45s`
- `1h30m`
- `2h15m30s`

## AI

AI config:

```text
src/app/config/ai-config.ts
src/app/config/ai-config.template.ts
```

Các service:

- `ChatbotService`
- `AIExplanationService`

Lưu ý production: không nên để API key thật ở frontend. Nên chuyển qua backend proxy nếu triển khai public.

## Testing

Hiện project có Angular/Karma test setup mặc định và một vài spec cơ bản.

Chạy:

```bash
npm test
npm run test:ci
```

Tài liệu cũ có nhắc Jest/Cypress nhưng repo hiện chưa cấu hình hai công cụ này.

## Performance

Hiện code chưa áp dụng lazy loading hay OnPush đồng loạt. Đây là hướng cải thiện tương lai, không phải trạng thái hiện hành.

Các việc nên làm khi tối ưu:

- Lazy-load các route lớn.
- Tách AI/chatbot hoặc report logic khỏi initial bundle nếu cần.
- Thêm `trackBy` cho danh sách dài.
- Giảm log debug trong production.
- Xem lại Angular budget trong `angular.json`.

## Known Issues / Ghi Chú Khi Phát Triển

- `ExerciseListComponent.viewReport()` navigate `/exam-report/:id`, route này chưa tồn tại.
- Edit bài thi qua `/edit-exercise/:id` đang dựa vào local state, refresh trực tiếp có thể không load được từ server.
- API URL hard-code trong service.
- Một số tài liệu lịch sử còn mô tả endpoints hoặc kiến trúc cũ.
- Một số file backup/temp trong `src/app/services` không nên dùng làm source of truth.

## Checklist Trước Khi Kết Thúc Một Thay Đổi

- Chạy `npm run build`.
- Test flow chính liên quan bằng browser nếu thay đổi UI.
- Cập nhật tài liệu nếu thay đổi route/API/user flow.
- Không commit API key thật hoặc dữ liệu nhạy cảm.
- Kiểm tra `git diff` để tránh kéo theo thay đổi ngoài phạm vi.
