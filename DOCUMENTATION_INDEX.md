# Danh mục tài liệu BioEduTech

Repo có nhiều tài liệu được tạo ở các giai đoạn khác nhau. Dùng file này làm điểm bắt đầu để tránh nhầm tài liệu lịch sử với trạng thái hiện hành.

## Nguồn tài liệu hiện hành

| File/thư mục | Mục đích |
| --- | --- |
| `README.md` | Tổng quan dự án, tính năng, route và API chính |
| `PROJECT_STRUCTURE.md` | Cấu trúc component, service và model |
| `QUICK_START_GUIDE.md` | Cách chạy ứng dụng và kiểm tra nhanh các luồng chính |
| `API_INTEGRATION_GUIDE.md` | API contract frontend đang sử dụng |
| [docs/README.md](docs/README.md) | Điểm bắt đầu của bộ đặc tả hiện hành |
| [docs/screen-specs.md](docs/screen-specs.md) | Danh mục và sơ đồ điều hướng màn hình |
| [docs/screens/](docs/screens/) | Đặc tả UI, wireframe và UC của từng màn hình |
| [docs/usecases-current.md](docs/usecases-current.md) | Danh mục use case theo tác nhân |
| [docs/usecases/](docs/usecases/) | Đặc tả và use case diagram của từng UC |
| [docs/data-and-api-flows.md](docs/data-and-api-flows.md) | Tổng quan service, API và rủi ro dữ liệu |

## Tài liệu theo tính năng

Các file dưới đây hữu ích để tìm hiểu lịch sử triển khai, nhưng có thể không phản ánh chính xác 100% code hiện tại.

| Nhóm | File tiêu biểu |
| --- | --- |
| Xác thực | `AUTHENTICATION_README.md`, `LOGIN_GUIDE.md`, `LOGIN_FEATURE_COMPLETE.md` |
| Bài thi | `CREATE_EXAM_FEATURE_COMPLETE.md`, `EXERCISE_FEATURE_README.md` |
| Học sinh | `STUDENT_MANAGEMENT_FEATURE.md`, `STUDENT_MANAGEMENT_COMPLETE.md` |
| Báo cáo | `TEACHER_REPORTS_FEATURE.md` |
| AI | `AI_EXPLANATION_SETUP.md`, `CHATBOT_FEATURE.md` |
| Timer | `TIMER_FEATURE.md`, `TIMER_UPDATE_45S.md` |

## Tài liệu phát triển

| File | Nội dung |
| --- | --- |
| `DEVELOPMENT.md` | Hướng dẫn phát triển theo code hiện tại |
| `DEVELOPMENT_PROCESS_GUIDE.md` | Quy trình làm việc và checklist |
| `HUONG_DAN_PHAT_TRIEN.md` | Hướng dẫn phát triển bằng tiếng Việt |
| `CONTRIBUTING.md` | Quy ước đóng góp |
| `CHANGELOG.md` | Lịch sử phiên bản |

## Điểm lệch đã ghi nhận

- Luồng chính sử dụng `/exams`, không sử dụng `/tests`.
- Repo hiện không có `src/environments`; API URL đang được hard-code trong `ApiService`.
- Route `/exam-report/:id` được gọi trong code nhưng chưa khai báo trong router.
- Timer đã thống nhất các định dạng như `30m`, `1h`, `45s`, `1h30m`, `2h15m30s`.
- Route chỉnh sửa bài thi phụ thuộc state local; refresh trực tiếp có thể không lấy được dữ liệu.
- AI đang gọi trực tiếp OpenAI từ frontend và đọc key từ file config local.

## Quy ước cập nhật

- Thêm hoặc sửa màn hình: cập nhật [docs/screen-specs.md](docs/screen-specs.md) và file tương ứng trong `docs/screens/`.
- Thêm hoặc sửa nghiệp vụ: cập nhật [docs/usecases-current.md](docs/usecases-current.md) và file tương ứng trong `docs/usecases/`.
- Wireframe phải nằm trong file màn hình; use case diagram phải nằm trong mục `Luồng chính` của UC.
- Screen và UC phải liên kết hai chiều.
- Thay đổi API contract: cập nhật `docs/data-and-api-flows.md` và `API_INTEGRATION_GUIDE.md`.
