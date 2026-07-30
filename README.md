# BioEduTech

BioEduTech là ứng dụng web Angular 17 phục vụ quản lý bài thi trắc nghiệm Sinh học. Ứng dụng có hai nhóm người dùng chính: giáo viên tạo/quản lý bài thi và học sinh làm bài, xem kết quả.

## Trạng thái hiện tại

- Framework: Angular 17, standalone components, TypeScript, SCSS.
- UI: kết hợp Angular Material và SCSS custom.
- Backend API: `https://chimeara.pythonanywhere.com`.
- Build hiện tại chạy được với `npm run build`. Bundle production đang có warning vượt initial budget, nhưng không làm fail build.
- Auth, exam, user, image upload, Excel import, reports, timer và AI/chatbot đều đang gọi trực tiếp từ frontend service.

## Tính năng chính

### Giáo viên

- Đăng nhập và vào dashboard giáo viên.
- Xem thống kê tổng quan số bài thi và học sinh.
- Tạo bài thi trắc nghiệm bằng nhập thủ công hoặc parse text.
- Upload ảnh cho câu hỏi qua API `/images`.
- Xem danh sách bài thi, tìm kiếm theo tên, xem chi tiết và xóa bài thi.
- Quản lý học sinh: xem danh sách, upload Excel/CSV, tải template, xóa học sinh.
- Xem báo cáo kết quả theo từng bài thi.

### Học sinh

- Đăng nhập và xem danh sách bài thi đang mở.
- Tìm kiếm bài thi.
- Làm bài trắc nghiệm một đáp án hoặc nhiều đáp án.
- Làm bài có timer, tự động nộp khi hết giờ.
- Xem kết quả, đáp án đúng/sai và yêu cầu AI giải thích từng câu.

### AI

- Chatbot Sinh học dùng OpenAI-compatible Chat Completions endpoint.
- AI explanation trên màn hình kết quả bài thi.
- Cấu hình frontend đọc `OPENAI_API_KEY` từ `src/app/config/ai-config.ts` local và gọi thẳng `https://api.openai.com/v1/chat/completions`.
- `src/app/config/ai-config.ts` nằm trong `.gitignore`; không điền key thật vào file tracked/template.

## Cài đặt

Yêu cầu:

- Node.js 20.x được khuyến nghị theo môi trường hiện tại.
- npm 10.x hoặc tương đương.

```bash
npm install
npm start
```

Ứng dụng chạy mặc định tại:

```text
http://localhost:4200
```

## Scripts

```bash
npm start          # ng serve
npm run build     # ng build production
npm run build:dev # ng build development
npm test          # ng test
npm run lint      # ng lint, nếu project lint config khả dụng
```

## Routes hiện hành

| Route | Màn hình |
| --- | --- |
| `/`, `/home` | Landing page |
| `/login` | Đăng nhập |
| `/teacher`, `/teacher-dashboard` | Dashboard giáo viên |
| `/teacher/students` | Quản lý học sinh |
| `/create-exercise` | Tạo bài thi |
| `/edit-exercise/:id` | Màn tạo bài thi ở chế độ sửa, hiện chủ yếu dựa vào state local |
| `/exercise-list` | Danh sách bài thi của giáo viên |
| `/reports` | Báo cáo kết quả bài thi |
| `/student`, `/student/dashboard`, `/student-dashboard` | Dashboard học sinh |
| `/student/exam/:id` | Làm bài |
| `/student/exam-result/:id` | Xem kết quả sau khi nộp |
| `/view-exercise/:id` | Xem chi tiết bài thi |
| `/parse-demo`, `/api-test`, `/login-test` | Màn hỗ trợ test/dev |

## API chính

Base URL hiện hard-code trong `src/app/services/api.service.ts`:

```ts
private baseUrl = 'https://chimeara.pythonanywhere.com';
```

Các endpoint frontend đang dùng:

- `POST /login`
- `GET /exams?page=&limit=`
- `GET /exams/{exam_id}`
- `POST /exams`
- `POST /exams/{exam_id}/submit`
- `GET /exams/{exam_id}/results`
- `DELETE /exams/{exam_id}`
- `POST /images`
- `GET /images/{filename}`
- `GET /users?page=&limit=&role=`
- `DELETE /users/{user_id}`
- `POST /register_excel`
- `GET /register_excel/template`

## Cấu trúc nhanh

```text
src/app/
  app.routes.ts
  config/
    ai-config.ts
    ai-config.template.ts
  models/
    exercise.model.ts
    user.model.ts
  services/
    api.service.ts
    auth.service.ts
    exercise.service.ts
    excel.service.ts
    student-management.service.ts
    timer.service.ts
    chatbot.service.ts
    ai-explanation.service.ts
  components/
    landing-page/
    login/
    teacher-dashboard/
    teacher-header/
    exercise-list/
    exercise-card/
    create-exercise/
    view-exercise/
    student-layout/
    student-header/
    student-footer/
    student-dashboard/
    take-exam/
    exam-result/
    student-management/
    teacher-reports/
    chatbot/
```

## Tài liệu

Đọc `DOCUMENTATION_INDEX.md` trước để biết tài liệu nào là hiện hành và tài liệu nào là nhật ký lịch sử. Các file `*_FEATURE*.md`, `*_FIX*.md`, `*_UPDATE*.md` phần lớn là tài liệu theo từng đợt triển khai, không phải source of truth mới nhất.

Đặc tả chi tiết theo màn hình/use case hiện nằm trong `docs/`.

## Lưu ý kỹ thuật

- Project hiện không có `src/environments`; API URL đang nằm trực tiếp trong `ApiService`.
- Routes không lazy-load và component chưa dùng `ChangeDetectionStrategy.OnPush` đồng loạt.
- Test hiện có vài spec cơ bản, chưa phải coverage đầy đủ.
- Timer hỗ trợ các format như `30m`, `1h`, `45s`, `1h30m`, `2h15m30s`.
- Có nhiều log debug trong service/component; khi làm production hardening nên gom lại hoặc thay bằng logging strategy rõ ràng.
