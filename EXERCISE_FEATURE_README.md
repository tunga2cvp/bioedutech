# 📚 Tính Năng Tạo Bài Tập Trắc Nghiệm

## 🎯 Tổng Quan

Tính năng tạo bài tập trắc nghiệm cho phép giáo viên tạo các bài tập trắc nghiệm với câu hỏi có thể có ảnh minh họa. Hệ thống hỗ trợ cả single choice và multiple choice questions.

## 🚀 Tính Năng Chính

### 1. Tạo Bài Tập Trắc Nghiệm
- **Địa chỉ**: `/create-exercise`
- **Mô tả**: Giao diện tạo bài tập với form đầy đủ
- **Tính năng**:
  - Nhập thông tin cơ bản (tên, mô tả, lớp, chương, thời gian, điểm)
  - Nhập câu hỏi theo format text chuẩn
  - Thêm câu hỏi thủ công với giao diện trực quan
  - Upload ảnh minh họa cho câu hỏi
  - Preview bài tập trước khi lưu
  - Lưu bản nháp hoặc xuất bản ngay

### 2. Quản Lý Bài Tập
- **Địa chỉ**: `/exercise-list`
- **Mô tả**: Danh sách và quản lý các bài tập đã tạo
- **Tính năng**:
  - Xem danh sách bài tập với thông tin chi tiết
  - Bộ lọc theo lớp, chương, trạng thái
  - Tìm kiếm bài tập
  - Thống kê tổng quan
  - Các thao tác: Xem, Chỉnh sửa, Sao chép, Xuất bản, Xóa

### 3. Xem Bài Tập
- **Địa chỉ**: `/view-exercise/:id`
- **Mô tả**: Giao diện làm bài tập cho học sinh
- **Tính năng**:
  - Làm bài tập trắc nghiệm
  - Điều hướng giữa các câu hỏi
  - Hiển thị ảnh minh họa
  - Chấm điểm tự động
  - Hiển thị kết quả chi tiết

## 📝 Format Câu Hỏi

### Single Choice
```
Câu hỏi: avc?
a) aaa
b) bbb  
c) ccc (đúng)
```

### Multiple Choice
```
Câu hỏi: Chọn các đáp án đúng?
a) aaa (đúng)
b) bbb
c) ccc (đúng)
d) ddd
```

## 🏗️ Cấu Trúc Code

### Models
- `src/app/models/exercise.model.ts` - Định nghĩa các interface cho Exercise, Question, AnswerOption

### Services
- `src/app/services/exercise.service.ts` - Service quản lý bài tập và câu hỏi

### Components
- `src/app/components/create-exercise/` - Component tạo bài tập
- `src/app/components/exercise-list/` - Component danh sách bài tập
- `src/app/components/view-exercise/` - Component xem/làm bài tập

## 🔧 Cách Sử Dụng

### 1. Tạo Bài Tập Mới
1. Đăng nhập với tài khoản giáo viên
2. Từ Teacher Dashboard, click "Tạo bài tập trắc nghiệm"
3. Điền thông tin cơ bản
4. Thêm câu hỏi bằng một trong hai cách:
   - **Cách 1**: Nhập theo format text và click "Parse Câu Hỏi"
   - **Cách 2**: Click "Thêm Câu Hỏi" và nhập thủ công
5. Upload ảnh minh họa (tùy chọn)
6. Preview bài tập
7. Click "Lưu Bài Tập" hoặc "Lưu & Xuất Bản"

### 2. Quản Lý Bài Tập
1. Từ Teacher Dashboard, click "Quản lý bài tập"
2. Sử dụng bộ lọc để tìm bài tập mong muốn
3. Thực hiện các thao tác:
   - **Xem**: Xem chi tiết bài tập
   - **Chỉnh sửa**: Sửa đổi bài tập
   - **Sao chép**: Tạo bản sao bài tập
   - **Xuất bản**: Xuất bản bài tập cho học sinh
   - **Xóa**: Xóa bài tập

### 3. Làm Bài Tập
1. Truy cập `/view-exercise/:id`
2. Đọc câu hỏi và chọn đáp án
3. Sử dụng điều hướng để chuyển giữa các câu hỏi
4. Click "Nộp bài tập" khi hoàn thành
5. Xem kết quả và điểm số

## 🎨 Giao Diện

### Create Exercise
- Form đầy đủ với validation
- Textarea để nhập câu hỏi theo format
- Giao diện thêm câu hỏi thủ công
- Upload ảnh với preview
- Preview bài tập trước khi lưu

### Exercise List
- Grid layout hiển thị bài tập
- Bộ lọc và tìm kiếm
- Thống kê tổng quan
- Dropdown menu cho các thao tác
- Responsive design

### View Exercise
- Giao diện làm bài tập trực quan
- Điều hướng câu hỏi
- Hiển thị ảnh minh họa
- Kết quả với điểm số và đáp án

## 🔒 Bảo Mật

- Chỉ giáo viên mới có thể tạo và quản lý bài tập
- Validation đầy đủ cho tất cả input
- Kiểm tra quyền truy cập trước khi thực hiện thao tác

## 📱 Responsive

- Hỗ trợ đầy đủ trên desktop, tablet và mobile
- Layout tự động điều chỉnh theo kích thước màn hình
- Touch-friendly cho mobile devices

## 🚀 Tính Năng Sắp Tới

- [ ] Chỉnh sửa bài tập
- [ ] Import/Export bài tập từ Excel
- [ ] Thống kê chi tiết về kết quả học sinh
- [ ] Tự động tạo đề thi từ ngân hàng câu hỏi
- [ ] Hẹn giờ làm bài tự động
- [ ] Lưu tiến độ làm bài tạm thời

## 🐛 Bug Reports

Nếu gặp lỗi, vui lòng báo cáo với thông tin:
- Trình duyệt và phiên bản
- Các bước tái tạo lỗi
- Screenshot (nếu có)
- Console errors (nếu có)

## 📞 Hỗ Trợ

Liên hệ team phát triển để được hỗ trợ:
- Email: support@bioedutech.com
- Hotline: 1900-xxxx
