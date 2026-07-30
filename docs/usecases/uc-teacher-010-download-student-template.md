# UC-TEACHER-010: Tải template học sinh

## Tóm tắt

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Giáo viên |
| Màn hình liên quan | [Màn hình quản lý học sinh](../screens/student-management.md) |
| Mục tiêu | Lấy file mẫu import học sinh |
| Tiền điều kiện | Giáo viên ở màn quản lý học sinh |
| Kích hoạt | Bấm tải template |
| Kết quả thành công | File template được tải xuống |
| Đối chiếu | Nút và hướng dẫn đã xác nhận trên production; không tải file |

## Luồng chính

### Use case diagram

```mermaid
flowchart LR
  Actor["Giáo viên"] --> UC["UC-TEACHER-010<br/>Tải template học sinh"]
  UC --> Screen["Màn hình: Màn hình quản lý học sinh<br/>Route: /teacher/students"]
  Screen --> Action["Thao tác: bấm Tải template Excel để nhận file mẫu import"]
```

### Các bước thao tác

1. Giáo viên mở [màn hình quản lý học sinh](../screens/student-management.md) tại
   `/teacher/students`.
2. Giáo viên đọc hướng dẫn các cột bắt buộc: họ tên, tên đăng nhập và mật khẩu.
3. Giáo viên bấm `Tải template Excel`.
4. Hệ thống gọi `GET /register_excel/template` và trình duyệt tải file.

## Luồng thay thế

- API template lỗi: `ExcelService` tạo file mẫu cục bộ để tải thay thế.
