# Tài liệu BioEduTech

Thư mục này mô tả trạng thái hiện tại của ứng dụng theo code trong `src/app` và
giao diện production tại `https://bioedutech.net/`.

Các màn hình nghiệp vụ đã được đối chiếu trực tiếp trên production ngày
28/07/2026. Riêng thao tác gửi request tới AI chưa thể kiểm thử do tài khoản
không còn quota. Những số liệu quan sát được
(số bài thi, số học sinh, số lượt làm) chỉ là dữ liệu tại thời điểm kiểm tra,
không phải ràng buộc cố định của hệ thống.

## Cấu trúc tài liệu

| Khu vực | Nội dung |
| --- | --- |
| [Danh mục màn hình](screen-specs.md) | Route, component và liên kết đến đặc tả từng màn hình |
| [Đặc tả màn hình](screens/) | Mô tả UI, wireframe, hành động, API và UC liên quan |
| [Danh mục use case](usecases-current.md) | Danh sách UC theo tác nhân |
| [Đặc tả use case](usecases/) | Tóm tắt, màn hình liên quan, use case diagram và luồng thao tác |
| [Luồng dữ liệu và API](data-and-api-flows.md) | Tổng quan service/API và các rủi ro dữ liệu |

## Quy ước cập nhật

- Mỗi màn hình hoặc nhóm component dùng chung có một file riêng trong `screens/`.
- Mỗi use case có một file riêng trong `usecases/`.
- Wireframe nằm ngay trong file màn hình.
- Use case diagram nằm trong mục `Luồng chính` của file UC.
- Mỗi screen phải liên kết đến UC và mỗi UC phải liên kết ngược về screen.
- Sơ đồ dùng Mermaid để render trực tiếp trên GitHub hoặc Markdown viewer.
- Nếu code và tài liệu lệch nhau, lấy code hiện tại làm nguồn đối chiếu rồi cập nhật tài liệu.
- Với hành vi nhìn thấy được, ưu tiên giao diện production; với API và nhánh lỗi
  không thể kích hoạt an toàn, đối chiếu thêm source code.
- Không thực hiện các thao tác tạo, lưu, nộp, import hoặc xóa dữ liệu trong quá
  trình khảo sát production.

## Điểm kỹ thuật đã biết

- API base URL đang được hard-code trong `ApiService`.
- API lấy đề hiện trả `correct_answers` cho frontend khi học sinh làm bài.
- Hosting production chưa cấu hình SPA fallback: tải mới hoặc mở trực tiếp một
  route con có thể trả trang 404, trong khi điều hướng bên trong Angular vẫn chạy.
- Code còn hàm điều hướng đến `/exam-report/:id`, nhưng card bài thi production
  không hiển thị thao tác này và route cũng chưa được khai báo.
- Route `/edit-exercise/:id` phụ thuộc dữ liệu local nên chưa ổn định khi refresh trực tiếp.
- AI đang được gọi trực tiếp từ frontend và đọc key từ `src/app/config/ai-config.ts` ở máy local.
