# 📚 Use Cases - BioEduTech Platform

## 📋 Mục lục
- [Tổng quan Use Cases](#tổng-quan-use-cases)
- [Use Cases cho Học sinh](#use-cases-cho-học-sinh)
- [Use Cases cho Giáo viên](#use-cases-cho-giáo-viên)

## 🎯 Tổng quan Use Cases

BioEduTech được thiết kế để phục vụ 2 nhóm người dùng chính:
- **Học sinh THPT** (Lớp 10-12)
- **Giáo viên Sinh học**

---

## 👨‍🎓 Use Cases cho Học sinh

### UC-001: Đăng nhập tài khoản học sinh
**Mô tả**: Học sinh đăng nhập vào hệ thống bằng tài khoản được giáo viên tạo

**Luồng thực hiện**:
1. Truy cập trang chủ BioEduTech
2. Click nút "Đăng nhập"
3. Chọn loại tài khoản "Học sinh"
4. Nhập thông tin:
   - Username (được giáo viên cung cấp)
   - Password (được giáo viên cung cấp)
5. Click "Đăng nhập"
6. Hệ thống xác thực thông tin
7. Chuyển hướng đến Student Dashboard

**Kết quả mong đợi**: Học sinh đăng nhập thành công và truy cập được dashboard

### UC-002: Đăng nhập hệ thống
**Mô tả**: Học sinh đăng nhập vào hệ thống

**Luồng thực hiện**:
1. Truy cập trang đăng nhập
2. Nhập email và mật khẩu
3. Click "Đăng nhập"
4. Hệ thống xác thực thông tin
5. Chuyển hướng đến Student Dashboard

**Kết quả mong đợi**: Học sinh được đăng nhập và truy cập dashboard

### UC-003: Xem tài liệu học tập
**Mô tả**: Học sinh xem tài liệu học tập theo chương

**Luồng thực hiện**:
1. Đăng nhập vào hệ thống
2. Từ dashboard, chọn "Tài liệu"
3. Chọn lớp học (10/11/12)
4. Chọn chương học
5. Xem danh sách tài liệu:
   - Bài giảng PowerPoint
   - Tóm tắt lý thuyết
   - Đề kiểm tra mẫu
6. Click để tải xuống hoặc xem online

**Kết quả mong đợi**: Học sinh có thể truy cập tài liệu học tập

### UC-004: Làm bài tập thực hành
**Mô tả**: Học sinh làm bài tập theo chương học

**Luồng thực hiện**:
1. Chọn "Bài tập" từ menu
2. Chọn lớp và chương
3. Xem danh sách bài tập:
   - Bài tập cơ bản
   - Bài tập nâng cao
   - Bài tập tổng hợp
4. Chọn bài tập để làm
5. Làm bài và submit
6. Xem kết quả và đáp án

**Kết quả mong đợi**: Học sinh hoàn thành bài tập và nhận phản hồi

### UC-005: Thi trắc nghiệm
**Mô tả**: Học sinh tham gia thi trắc nghiệm tự động

**Luồng thực hiện**:
1. Chọn "Trắc nghiệm" từ menu
2. Chọn chủ đề và độ khó
3. Hệ thống tạo đề thi ngẫu nhiên
4. Làm bài trong thời gian quy định
5. Submit bài thi
6. Xem kết quả ngay lập tức:
   - Điểm số
   - Đáp án đúng/sai
   - Giải thích chi tiết
7. Lưu kết quả vào lịch sử

**Kết quả mong đợi**: Học sinh nhận được đánh giá chính xác về kiến thức

### UC-006: Theo dõi tiến độ học tập
**Mô tả**: Học sinh xem báo cáo tiến độ học tập

**Luồng thực hiện**:
1. Truy cập "Tiến độ học tập" từ dashboard
2. Xem thống kê tổng quan:
   - Số bài tập đã hoàn thành
   - Điểm trung bình các bài thi
   - Thời gian học tập
   - Xếp hạng trong lớp
3. Xem chi tiết theo từng chương
4. Tải báo cáo PDF

**Kết quả mong đợi**: Học sinh có cái nhìn tổng quan về tiến độ học tập

---

## 👩‍🏫 Use Cases cho Giáo viên

### UC-007: Đăng nhập tài khoản giáo viên
**Mô tả**: Giáo viên đăng nhập vào hệ thống bằng tài khoản cố định

**Luồng thực hiện**:
1. Truy cập trang chủ BioEduTech
2. Click nút "Đăng nhập"
3. Chọn loại tài khoản "Giáo viên"
4. Nhập thông tin:
   - Username: `giaovien`
   - Password: `123456`
5. Click "Đăng nhập"
6. Hệ thống xác thực thông tin
7. Chuyển hướng đến Teacher Dashboard

**Kết quả mong đợi**: Giáo viên đăng nhập thành công và truy cập được dashboard

### UC-008: Quản lý học sinh
**Mô tả**: Giáo viên tạo và quản lý tài khoản học sinh

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Click "Quản lý học sinh"
3. Chọn phương thức tạo tài khoản:

**A. Upload file Excel/CSV (Tab mặc định)**:
4. Click "Tải template Excel"
5. Điền thông tin học sinh vào file Excel:
   - name, username, email, password, grade, class, school, studentId
6. Upload file Excel/CSV
7. Hệ thống xử lý và tạo tài khoản hàng loạt qua API backend

**B. Tạo học sinh nhanh**:
4. Chuyển sang tab "Thêm học sinh nhanh"
5. Điền thông tin học sinh:
   - Họ tên, Username, Email, Mật khẩu
   - Lớp, Lớp học, Trường học, Mã học sinh
6. Click "Thêm học sinh"

**Kết quả mong đợi**: Tài khoản học sinh được tạo thành công

### UC-008A: Đăng ký hàng loạt học sinh qua API
**Mô tả**: Giáo viên đăng ký nhiều học sinh cùng lúc thông qua API backend

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Truy cập "Quản lý học sinh"
3. Chọn "Upload file Excel/CSV"
4. Tải template Excel hoặc chuẩn bị file CSV
5. Điền thông tin học sinh vào file:
   - Họ tên, Username, Email, Mật khẩu
   - Lớp (10/11/12), Lớp học, Trường học, Mã học sinh
6. Upload file lên hệ thống
7. Hệ thống parse file và gửi dữ liệu đến API `/register_excel`
8. API xử lý và tạo tài khoản học sinh
9. Hiển thị kết quả:
   - Số lượng tài khoản tạo thành công
   - Danh sách lỗi (nếu có)
   - Thông tin chi tiết từng học sinh đã tạo

**Kết quả mong đợi**: 
- Tài khoản học sinh được tạo thành công trên backend
- Dữ liệu được đồng bộ giữa frontend và backend
- Báo cáo chi tiết về kết quả đăng ký

### UC-009: Xem danh sách học sinh
**Mô tả**: Giáo viên xem và quản lý danh sách học sinh đã tạo

**Luồng thực hiện**:
1. Truy cập trang "Quản lý học sinh"
2. Xem danh sách học sinh trong bảng
3. Sử dụng tính năng tìm kiếm:
   - Tìm theo tên, email, mã học sinh
4. Lọc theo lớp:
   - Lớp 10, 11, 12
5. Thực hiện thao tác:
   - Chỉnh sửa thông tin học sinh
   - Xóa tài khoản học sinh

**Kết quả mong đợi**: Giáo viên có thể quản lý hiệu quả danh sách học sinh

### UC-009: Tạo và quản lý tài liệu
**Mô tả**: Giáo viên upload và quản lý tài liệu học tập

**Luồng thực hiện**:
1. Chọn "Quản lý tài liệu"
2. Tạo thư mục theo chương
3. Upload tài liệu:
   - PowerPoint bài giảng
   - PDF tóm tắt
   - Video bài giảng
   - Hình ảnh minh họa
4. Phân loại và gắn tag
5. Cài đặt quyền truy cập
6. Xuất bản tài liệu

**Kết quả mong đợi**: Tài liệu được tổ chức và chia sẻ với học sinh

### UC-010: Tạo bài tập trắc nghiệm
**Mô tả**: Giáo viên tạo bài tập trắc nghiệm với câu hỏi có thể có ảnh minh họa

**Luồng thực hiện**:
1. Đăng nhập Teacher Dashboard
2. Chọn "Tạo bài tập" từ menu
3. Nhập thông tin bài tập cơ bản:
   - Tên bài tập
   - Mô tả bài tập
   - Lớp học áp dụng (10/11/12)
   - Chương học
   - Thời gian làm bài (phút)
   - Điểm tối đa
4. Thêm danh sách câu hỏi trắc nghiệm:

**A. Nhập câu hỏi theo format chuẩn**:
5. Chọn "Thêm câu hỏi"
6. Nhập câu hỏi theo format:
   ```
   Câu hỏi: avc?
   a) aaa
   b) bbb  
   c) ccc (đúng)
   ```
   Hoặc cho câu hỏi multiple choice:
   ```
   Câu hỏi: Chọn các đáp án đúng?
   a) aaa (đúng)
   b) bbb
   c) ccc (đúng)
   d) ddd
   ```

**B. Thêm ảnh minh họa (tùy chọn)**:
7. Click "Thêm ảnh" cho câu hỏi
8. Upload file ảnh (JPG, PNG, GIF)
9. Hệ thống tự động resize và tối ưu ảnh
10. Xem preview ảnh trước khi lưu

**C. Quản lý câu hỏi**:
11. Xem danh sách câu hỏi đã thêm
12. Chỉnh sửa câu hỏi bất kỳ
13. Xóa câu hỏi không cần thiết
14. Sắp xếp thứ tự câu hỏi
15. Xem preview toàn bộ bài tập

**D. Cài đặt và xuất bản**:
16. Cài đặt tham số bổ sung:
    - Số lần làm lại cho phép
    - Hiển thị đáp án sau khi làm xong
    - Thời gian bắt đầu và kết thúc
    - Phân bổ cho lớp học cụ thể
17. Lưu bài tập
18. Xuất bản cho học sinh

**Kết quả mong đợi**: Bài tập trắc nghiệm được tạo hoàn chỉnh với câu hỏi có ảnh minh họa và phân bổ cho học sinh

### UC-011: Chấm bài và đánh giá
**Mô tả**: Giáo viên chấm bài và đánh giá kết quả học sinh

**Luồng thực hiện**:
1. Truy cập "Chấm bài"
2. Xem danh sách bài nộp:
   - Bài tập tự luận
   - Bài thi trắc nghiệm (tự động chấm)
3. Chấm bài tự luận:
   - Xem bài làm của học sinh
   - Chấm điểm và nhận xét
   - Lưu kết quả
4. Xem báo cáo tổng hợp
5. Gửi phản hồi cho học sinh

**Kết quả mong đợi**: Học sinh nhận được đánh giá chi tiết

### UC-012: Theo dõi tiến độ lớp học
**Mô tả**: Giáo viên theo dõi tiến độ học tập của cả lớp

**Luồng thực hiện**:
1. Chọn "Báo cáo lớp học"
2. Chọn lớp và thời gian
3. Xem thống kê:
   - Tỷ lệ hoàn thành bài tập
   - Điểm trung bình lớp
   - Học sinh cần hỗ trợ
   - Xu hướng học tập
4. Xuất báo cáo chi tiết
5. Gửi báo cáo cho phụ huynh

**Kết quả mong đợi**: Giáo viên có cái nhìn tổng quan về lớp học

---

## 📊 Metrics và KPIs

### Học sinh
- Thời gian học tập trung bình/ngày
- Tỷ lệ hoàn thành bài tập
- Điểm trung bình các bài thi
- Số lần truy cập tài liệu

### Giáo viên
- Số lượng học sinh trong lớp
- Tỷ lệ hoàn thành bài tập của lớp
- Thời gian phản hồi bài tập
- Mức độ tương tác với học sinh

### Hệ thống
- Uptime (99.9%)
- Thời gian phản hồi API (< 200ms)
- Số lượng người dùng đồng thời
- Tỷ lệ lỗi (< 0.1%)
- API response time (< 500ms)
- JWT token refresh success rate (> 95%)
- API error rate (< 1%)

---

## 🔄 Workflow Integration

---

**Lưu ý**: Tài liệu Use Cases này sẽ được cập nhật thường xuyên theo yêu cầu phát triển của dự án.
