# Quick Start Guide

Hướng dẫn chạy nhanh BioEduTech trong môi trường local.

## 1. Cài Dependencies

```bash
npm install
```

## 2. Chạy Dev Server

```bash
npm start
```

Mở:

```text
http://localhost:4200
```

## 3. Build

```bash
npm run build
```

Build output:

```text
dist/bioedutech
```

Ghi nhận hiện tại: build thành công, có warning initial bundle vượt budget.

## 4. Luồng Test Nhanh

### Đăng nhập

1. Vào `/login`.
2. Nhập username/password theo dữ liệu backend.
3. Backend trả role:
   - `teacher` chuyển đến `/teacher`.
   - `student` chuyển đến `/student`.

### Giáo viên tạo bài thi

1. Vào `/create-exercise`.
2. Nhập tên bài thi.
3. Nhập timer nếu cần, ví dụ `30m`, `1h`, `1h30m`.
4. Thêm câu hỏi thủ công hoặc paste text rồi parse.
5. Chọn đáp án đúng.
6. Upload ảnh nếu có.
7. Bấm lưu để gửi `POST /exams`.

Format parse câu hỏi:

```text
Câu hỏi ví dụ?
a) Đáp án A
b) Đáp án B (đúng)
c) Đáp án C
d) Đáp án D
```

### Giáo viên quản lý bài thi

1. Vào `/exercise-list`.
2. Tìm theo tên bài thi.
3. Xem chi tiết bài thi qua `/view-exercise/:id`.
4. Xóa bài thi nếu cần.

### Học sinh làm bài

1. Vào `/student`.
2. Chọn bài thi đang mở.
3. Làm bài tại `/student/exam/:id`.
4. Nộp bài hoặc chờ timer tự nộp.
5. Xem kết quả tại `/student/exam-result/:id`.

### Quản lý học sinh

1. Vào `/teacher/students`.
2. Tải template Excel nếu cần.
3. Upload Excel/CSV.
4. Danh sách học sinh được load từ API `/users?role=student`.

### Báo cáo

1. Vào `/reports`.
2. App load danh sách bài thi.
3. Với từng bài, app gọi `/exams/{id}/results`.
4. Bấm xem chi tiết để xem submission theo học sinh.

## 5. API Backend

Base URL hiện tại:

```text
https://chimeara.pythonanywhere.com
```

Swagger nếu backend còn bật:

```text
https://chimeara.pythonanywhere.com/apidocs/
```

## 6. AI Config

Frontend đang dùng flow cũ: gọi trực tiếp OpenAI từ Angular và đọc key từ `src/app/config/ai-config.ts`.

Tạo/cập nhật file local:

```ts
export const AI_CONFIG = {
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  OPENAI_API_KEY: 'YOUR_REAL_OPENAI_API_KEY',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions'
};
```

Sau đó chạy:

```bash
npm start
```

Không commit API key thật vào repo public. Chỉ đặt key trong `src/app/config/ai-config.ts` vì file này đang nằm trong `.gitignore`.

## 7. Lỗi Thường Gặp

### Không load được bài thi/học sinh

- Kiểm tra backend còn hoạt động.
- Kiểm tra CORS/network trong browser devtools.
- Kiểm tra `baseUrl` trong `ApiService`.

### Timer không chạy

- Kiểm tra response exam có `timer` hoặc `time_limit`.
- `TimerService.parseTimerString()` hiện hỗ trợ `30m`, `1h`, `45s`, `1h30m`, `2h15m30s`.

### Không vào được dashboard giáo viên

- `TeacherDashboardComponent` yêu cầu `AuthService.getCurrentTeacher()` có user role `teacher`.
- Đăng nhập lại qua `/login`.

## 8. File Nên Đọc Tiếp

- `README.md`
- `PROJECT_STRUCTURE.md`
- `API_INTEGRATION_GUIDE.md`
- `DOCUMENTATION_INDEX.md`
