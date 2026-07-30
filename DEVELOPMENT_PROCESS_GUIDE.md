# Development Process Guide

Tài liệu quy trình cho các thay đổi tiếp theo trên BioEduTech.

## Nguyên Tắc

- Code là source of truth cuối cùng.
- Tài liệu source of truth hiện hành nằm trong `DOCUMENTATION_INDEX.md`.
- Tài liệu dạng `*_FEATURE*.md`, `*_FIX*.md`, `*_UPDATE*.md` là lịch sử triển khai, không nhất thiết phản ánh code mới nhất.
- Mỗi thay đổi nên có phạm vi rõ: route, component, service, API contract, UI, hoặc docs.

## Quy Trình Làm Một Tính Năng

### 1. Hiểu yêu cầu

- Xác định actor: giáo viên, học sinh, hoặc dev/admin.
- Xác định màn hình liên quan.
- Xác định API cần gọi.
- Xác định dữ liệu cần hiển thị/lưu.

### 2. Đọc code liên quan

Ưu tiên đọc theo thứ tự:

1. `app.routes.ts`
2. Component `.ts`
3. Component `.html`
4. Service liên quan
5. Model/interface
6. SCSS nếu thay đổi UI

### 3. Implement

- Giữ pattern standalone component hiện tại.
- Không thêm abstraction nếu chưa cần.
- Không sửa unrelated files.
- Nếu thêm endpoint, thêm interface typed trong `api.service.ts`.
- Nếu thêm route, cập nhật header/footer navigation nếu cần.

### 4. Verify

Tối thiểu:

```bash
npm run build
```

Nếu thay đổi logic testable:

```bash
npm test
```

Nếu thay đổi UI flow, chạy dev server và test thủ công trên browser.

### 5. Cập Nhật Tài Liệu

| Thay đổi | File cần cập nhật |
| --- | --- |
| Route mới/thay đổi navigation | `README.md`, `PROJECT_STRUCTURE.md`, `QUICK_START_GUIDE.md` |
| API request/response mới | `API_INTEGRATION_GUIDE.md` |
| Component/service mới | `PROJECT_STRUCTURE.md` |
| User flow mới | `USECASES.md`, `QUICK_START_GUIDE.md` |
| Tài liệu mới | `DOCUMENTATION_INDEX.md` |

## Checklist Review

- Build thành công.
- Không có route chết mới.
- Không dùng endpoint cũ `/tests` cho flow chính.
- Không commit key hoặc secret thật.
- Không phá dữ liệu localStorage hiện có nếu không có migration.
- Error state/loading state có xử lý.
- UI mobile không bị vỡ nếu thay đổi layout.
- Tài liệu đã cập nhật theo thay đổi.

## Known Technical Debt

- API URL hard-code trong `ApiService`.
- AI API key/config nằm ở frontend.
- Nhiều debug logs trong production code.
- Edit bài thi chưa load server detail bền vững khi refresh.
- Route `/exam-report/:id` được navigate trong code nhưng chưa khai báo.
- Timer validator và timer parser đã thống nhất format compound; vẫn nên thêm test nếu mở rộng thêm định dạng mới.
- Chưa lazy-load route.
- Chưa có coverage test đầy đủ.

## Đề Xuất Roadmap Kỹ Thuật

1. Sửa các route/navigation lệch.
2. Chuyển API URL sang environment config.
3. Chuyển AI calls qua backend proxy.
4. Giảm debug logs.
5. Thêm unit tests cho service quan trọng.
6. Lazy-load các route lớn.
7. Tối ưu bundle và Angular budgets.
