# 🧪 Test Guide - Tạo Bài Thi

## 📋 Hướng dẫn test tính năng tạo bài thi

### 1. Truy cập tính năng tạo bài thi

1. **Đăng nhập với tài khoản giáo viên:**
   - Username: `giaovien`
   - Password: `123456`

2. **Từ Teacher Dashboard:**
   - Click nút "Tạo bài tập trắc nghiệm"
   - Hoặc truy cập trực tiếp: `http://localhost:4200/create-exercise`

### 2. Test tạo bài thi cơ bản

#### A. Điền thông tin cơ bản
```
Tên bài tập: Bài kiểm tra Sinh học lớp 10 - Chương 1
Mô tả: Kiểm tra kiến thức về cơ chế di truyền và biến dị
Lớp: 10
Chương: Chương 1: Cơ chế di truyền và biến dị
Thời gian: 30 phút
Điểm tối đa: 100
```

#### B. Thêm câu hỏi theo format text
```
Câu hỏi: Tế bào là đơn vị cơ bản của sự sống?
a) Đúng
b) Sai (đúng)

Câu hỏi: Các thành phần chính của tế bào bao gồm:
a) Màng tế bào (đúng)
b) Tế bào chất (đúng)
c) Nhân tế bào (đúng)
d) Vỏ tế bào

Câu hỏi: Quá trình phân bào nào tạo ra tế bào con giống hệt tế bào mẹ?
a) Giảm phân
b) Nguyên phân (đúng)
c) Thụ tinh
d) Phát triển
```

#### C. Test parse câu hỏi
1. Paste text vào textarea
2. Click "Parse Câu Hỏi"
3. Kiểm tra:
   - ✅ Câu hỏi được parse đúng
   - ✅ Đáp án được nhận diện đúng
   - ✅ Câu hỏi multiple choice được phát hiện
   - ✅ Preview hiển thị đúng

### 3. Test thêm câu hỏi thủ công

1. Click "Thêm Câu Hỏi"
2. Điền nội dung câu hỏi
3. Thêm đáp án (tối thiểu 2)
4. Chọn đáp án đúng
5. Test chuyển đổi giữa single/multiple choice

### 4. Test upload ảnh

1. Click "Thêm ảnh" cho câu hỏi
2. Chọn file ảnh (JPG, PNG, GIF)
3. Kiểm tra:
   - ✅ File được upload thành công
   - ✅ Preview ảnh hiển thị đúng
   - ✅ Validation file type và size

### 5. Test validation

#### A. Validation form
- Bỏ trống tên bài tập → Error
- Tên bài tập < 5 ký tự → Error
- Mô tả < 10 ký tự → Error
- Thời gian < 5 phút → Error
- Điểm tối đa < 1 → Error

#### B. Validation câu hỏi
- Không có câu hỏi nào → Error
- Câu hỏi không có nội dung → Error
- Câu hỏi < 2 đáp án → Error
- Câu hỏi không có đáp án đúng → Error
- Single choice có > 1 đáp án đúng → Error

### 6. Test preview

1. Click "Xem Preview"
2. Kiểm tra:
   - ✅ Giao diện giống học sinh
   - ✅ Câu hỏi hiển thị đúng
   - ✅ Đáp án hiển thị đúng
   - ✅ Ảnh hiển thị đúng (nếu có)

### 7. Test lưu bản nháp

1. Click "Lưu Bài Tập"
2. Kiểm tra:
   - ✅ Thông báo thành công
   - ✅ Chuyển đến exercise-list
   - ✅ Bài tập xuất hiện trong danh sách với trạng thái "Bản nháp"

### 8. Test lưu và xuất bản

1. Click "Lưu & Xuất Bản"
2. Xác nhận dialog
3. Kiểm tra:
   - ✅ Thông báo xác nhận
   - ✅ API call được gửi đến server
   - ✅ Console logs hiển thị đúng
   - ✅ Chuyển đến exercise-list
   - ✅ Bài tập xuất hiện với trạng thái "Đã xuất bản"

### 9. Test API Integration

#### A. Kiểm tra console logs
```
=== SENDING TEST DATA TO SERVER ===
Test data questions count: 3
First question: {content: "...", answers: [...], correct_answers: [...]}

✅ Bài thi đã được tạo và xuất bản trên server: {...}
Server test ID: test_12345
Test status: published
Total questions: 3
```

#### B. Kiểm tra network requests
- POST `/exams` với đúng format
- Response có `result: "success"`
- Response có `server_test_id`

### 10. Test error handling

#### A. Network error
- Tắt internet
- Thử lưu & xuất bản
- Kiểm tra thông báo lỗi phù hợp

#### B. Server error
- Mock server trả về 500
- Kiểm tra fallback về local storage

### 11. Test responsive design

1. **Desktop (>= 1200px):**
   - Layout 2 cột
   - Form và preview cạnh nhau

2. **Tablet (768px - 1199px):**
   - Layout 1 cột
   - Form và preview xếp dọc

3. **Mobile (< 768px):**
   - Layout 1 cột
   - Touch-friendly buttons
   - Readable text

### 12. Test accessibility

1. **Keyboard navigation:**
   - Tab qua các form fields
   - Enter để submit
   - Escape để đóng dialogs

2. **Screen reader:**
   - Labels cho form fields
   - Alt text cho images
   - ARIA attributes

## 🐛 Common Issues & Solutions

### Issue 1: Parse câu hỏi không hoạt động
**Solution:** Kiểm tra format text có đúng không:
```
Câu hỏi: Nội dung câu hỏi?
a) Đáp án A
b) Đáp án B (đúng)
c) Đáp án C
d) Đáp án D
```

### Issue 2: Upload ảnh lỗi
**Solution:** 
- Kiểm tra file type (JPG, PNG, GIF)
- Kiểm tra file size (< 5MB)
- Kiểm tra browser permissions

### Issue 3: API call thất bại
**Solution:**
- Kiểm tra network connection
- Kiểm tra console logs
- Kiểm tra server status

### Issue 4: Validation không hoạt động
**Solution:**
- Kiểm tra form touched state
- Kiểm tra validation rules
- Kiểm tra error messages

## 📊 Expected Results

### Success Case
1. ✅ Form validation hoạt động
2. ✅ Parse câu hỏi chính xác
3. ✅ Upload ảnh thành công
4. ✅ Preview hiển thị đúng
5. ✅ API call thành công
6. ✅ Bài tập được lưu và xuất bản
7. ✅ Chuyển hướng đúng trang
8. ✅ Responsive design hoạt động

### Error Cases
1. ✅ Validation errors hiển thị rõ ràng
2. ✅ Network errors được handle gracefully
3. ✅ Server errors có fallback
4. ✅ User được thông báo phù hợp

## 🎯 Performance Expectations

- **Form load time:** < 1s
- **Parse câu hỏi:** < 500ms
- **Upload ảnh:** < 2s
- **API call:** < 3s
- **Page navigation:** < 500ms

---

**Lưu ý:** Test này cần được thực hiện trên cả desktop và mobile để đảm bảo tính năng hoạt động tốt trên mọi thiết bị.
