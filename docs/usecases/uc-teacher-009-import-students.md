# UC-TEACHER-009: Import học sinh bằng Excel/CSV

## Tóm tắt

| Mục | Nội dung |
| --- | --- |
| Tác nhân | Giáo viên |
| Màn hình liên quan | [Màn hình quản lý học sinh](../screens/student-management.md) |
| Mục tiêu | Tạo nhiều tài khoản học sinh bằng file |
| Tiền điều kiện | Giáo viên có file hợp lệ |
| Kích hoạt | Bấm upload file |
| Kết quả thành công | Backend tạo học sinh và danh sách reload |
| Đối chiếu | UI production ngày 28/07/2026; không upload dữ liệu |

## Luồng chính

### Use case diagram

```mermaid
flowchart LR
  Actor["Giáo viên"] --> UC["UC-TEACHER-009<br/>Import học sinh bằng Excel/CSV"]
  UC --> Screen["Màn hình: Màn hình quản lý học sinh<br/>Route: /teacher/students"]
  Screen --> Action["Thao tác: kéo thả hoặc chọn file, kiểm tra file và bấm Upload"]
```

### Các bước thao tác

1. Giáo viên mở [màn hình quản lý học sinh](../screens/student-management.md) tại
   `/teacher/students`.
2. Giáo viên kéo thả hoặc chọn file `.xlsx`, `.xls`, `.csv` trong vùng tải lên.
3. Hệ thống kiểm tra loại file và giới hạn 10 MB, rồi hiển thị file đã chọn.
4. Giáo viên bấm `Upload file`.
5. Hệ thống gọi `POST /register_excel`.
6. Khi backend trả kết quả thành công, hệ thống thông báo số tài khoản đã tạo và
   tải lại danh sách học sinh.

## Luồng thay thế

- File sai định dạng: snackbar lỗi.
- File quá lớn: snackbar lỗi.
- API lỗi: snackbar lỗi.
