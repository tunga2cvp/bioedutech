# UC-TEACHER-005: Xem danh sách bài thi

## Tóm tắt

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Giáo viên |
| Màn hình liên quan | [Màn hình quản lý bài thi](../screens/exercise-list.md) |
| Mục tiêu | Quản lý các bài thi đã tạo |
| Tiền điều kiện | Giáo viên vào `/exercise-list` |
| Kích hoạt | Màn hình load |
| Kết quả thành công | Danh sách bài thi hiển thị |
| Đối chiếu | Production ngày 28/07/2026 |

## Luồng chính

### Use case diagram

```mermaid
flowchart LR
  Actor["Giáo viên"] --> UC["UC-TEACHER-005<br/>Xem danh sách bài thi"]
  UC --> Screen["Màn hình: Màn hình quản lý bài thi<br/>Route: /exercise-list"]
  Screen --> Action["Thao tác: tìm kiếm và chọn bài thi cần xem hoặc quản lý"]
```

### Các bước thao tác

1. Từ header, giáo viên bấm `Bài tập`; hệ thống mở
   [màn hình quản lý bài thi](../screens/exercise-list.md) tại `/exercise-list`.
2. Hệ thống gọi `GET /exams` và hiển thị các card bài thi.
3. Mỗi card hiển thị tên bài, số câu, trạng thái, `Xem bài thi` và `Xóa`.
4. Giáo viên nhập tên vào ô tìm kiếm để lọc danh sách nếu cần.
5. Giáo viên có thể chọn kiểu hiển thị `Danh sách` hoặc `Thẻ`.

## Luồng thay thế

- API lỗi: hiện lỗi/alert theo component hiện tại.
- Danh sách rỗng: hiện trạng thái rỗng.
