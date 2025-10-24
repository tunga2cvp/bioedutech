# 📝 Changelog - BioEduTech

Tất cả các thay đổi quan trọng của dự án BioEduTech sẽ được ghi lại trong file này.

## [1.0.0] - 2024-12-19

### ✨ Tính năng mới
- **Hệ thống xác thực cơ bản**
  - Tài khoản giáo viên cố định: `giaovien` / `123456`
  - Tài khoản học sinh được tạo bởi giáo viên
  - Phân quyền rõ ràng giữa giáo viên và học sinh

- **Landing Page**
  - Giao diện trang chủ hiện đại
  - Nút đăng nhập dẫn đến trang login
  - Responsive design

- **Teacher Dashboard**
  - Giao diện quản lý cho giáo viên
  - Nút "Quản lý học sinh" dẫn đến trang quản lý
  - Thông tin giáo viên hiển thị

- **Student Management System**
  - **Tab Navigation**: Upload Excel/CSV và Thêm học sinh nhanh
  - **Upload Excel/CSV** (Tab mặc định):
    - Tải template Excel với đầy đủ cột
    - Drag & drop file hoặc click để chọn
    - Hỗ trợ file .xlsx, .xls, .csv
    - Validation dữ liệu đầy đủ
    - Xử lý file Excel thực sự với thư viện xlsx
  - **Thêm học sinh nhanh**:
    - Form tạo tài khoản trực tiếp
    - Validation username, email trùng lặp
    - Xác nhận mật khẩu
  - **Danh sách học sinh**:
    - Bảng hiển thị với Material Table
    - Tìm kiếm theo tên, email, mã học sinh
    - Lọc theo lớp (10, 11, 12)
    - Actions: Chỉnh sửa, Xóa học sinh

- **Student Dashboard**
  - Giao diện cơ bản cho học sinh
  - Hiển thị thông tin cá nhân
  - Nút đăng xuất

### 🔧 Cải tiến kỹ thuật
- **Angular 17 Standalone Components**
- **TypeScript Interfaces**: User, Student, Teacher models
- **Excel Processing**: Thư viện xlsx cho xử lý file thực sự
- **localStorage**: Lưu trữ dữ liệu học sinh
- **Angular Material**: UI components và theming
- **SCSS**: Styling responsive
- **RxJS**: Reactive programming cho state management

### 📋 Template Excel
```
| name | username | email | password | grade | class | school | studentId |
|------|----------|-------|----------|-------|-------|--------|-----------|
| Nguyễn Văn An | an.nguyen | an.nguyen@student.edu.vn | 123456 | 12 | 12A1 | Trường THPT Mẫu | S001 |
```

### 🐛 Bug fixes
- Sửa lỗi validation dòng trống trong file Excel
- Sửa lỗi template Excel không mở được (tạo file Excel thực sự)
- Sửa lỗi TypeScript type cho grade field

### 📚 Documentation
- Cập nhật README.md với hướng dẫn sử dụng
- Cập nhật USECASES.md với use cases mới
- Cập nhật PROJECT_STRUCTURE.md với cấu trúc mới
- Cập nhật DEVELOPMENT.md với dependencies mới

---

## [0.1.0] - 2024-12-18

### 🚀 Khởi tạo dự án
- Tạo dự án Angular 17
- Cấu hình cơ bản
- Setup Material Design
- Tạo cấu trúc thư mục

---

## 📝 Ghi chú
- Format dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
- Versioning dựa trên [Semantic Versioning](https://semver.org/spec/v2.0.0.html)