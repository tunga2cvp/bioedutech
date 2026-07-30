# Hướng Dẫn Phát Triển BioEduTech

Đây là bản hướng dẫn tiếng Việt ngắn gọn cho code hiện tại. Để xem chi tiết kỹ thuật, đọc thêm `DEVELOPMENT.md`, `PROJECT_STRUCTURE.md` và `API_INTEGRATION_GUIDE.md`.

## 1. Bắt Đầu

```bash
npm install
npm start
```

Mở ứng dụng tại:

```text
http://localhost:4200
```

Build:

```bash
npm run build
```

## 2. Các Luồng Chính

### Giáo viên

- Đăng nhập tại `/login`.
- Dashboard: `/teacher` hoặc `/teacher-dashboard`.
- Tạo bài thi: `/create-exercise`.
- Quản lý bài thi: `/exercise-list`.
- Quản lý học sinh: `/teacher/students`.
- Báo cáo: `/reports`.

### Học sinh

- Dashboard: `/student`.
- Làm bài: `/student/exam/:id`.
- Xem kết quả: `/student/exam-result/:id`.

## 3. Khi Thêm/Sửa Tính Năng

1. Đọc component/service liên quan trong `src/app`.
2. Xác định API contract trong `api.service.ts`.
3. Sửa code theo pattern hiện tại.
4. Cập nhật tài liệu liên quan:
   - Route/user flow: `README.md`, `QUICK_START_GUIDE.md`.
   - API: `API_INTEGRATION_GUIDE.md`.
   - Cấu trúc: `PROJECT_STRUCTURE.md`.
5. Chạy `npm run build`.

## 4. API

Frontend đang dùng backend:

```text
https://chimeara.pythonanywhere.com
```

Endpoint chính:

- `/login`
- `/exams`
- `/exams/{id}`
- `/exams/{id}/submit`
- `/exams/{id}/results`
- `/images`
- `/users`
- `/register_excel`

Không dùng `/tests` cho luồng chính hiện tại.

## 5. Lưu Ý Quan Trọng

- Code hiện chưa có `src/environments`; API URL đang hard-code trong `ApiService`.
- Code hiện chưa lazy-load routes.
- Code hiện chưa dùng OnPush đồng loạt.
- Test setup hiện là Angular/Karma mặc định, chưa có Jest/Cypress config.
- Timer service hiện parse `30m`, `1h`, `45s`, `1h30m`, `2h15m30s`.
- Không đưa API key thật vào frontend nếu deploy public.

## 6. Tài Liệu Nên Đọc

- `DOCUMENTATION_INDEX.md`: phân loại tài liệu hiện hành và tài liệu lịch sử.
- `README.md`: tổng quan dự án.
- `PROJECT_STRUCTURE.md`: cấu trúc code.
- `API_INTEGRATION_GUIDE.md`: API contract.
- `QUICK_START_GUIDE.md`: chạy và test nhanh.
- `USECASES.md`: use cases nghiệp vụ.
