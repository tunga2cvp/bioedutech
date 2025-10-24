# 🖼️ Test Guide - Base64 Images

## 📋 Tổng Quan

Tính năng gửi ảnh dưới dạng base64 đã được implement để tương thích với API backend. Ảnh sẽ được chuyển đổi thành base64 string và gửi trong trường `image` của API.

## 🔧 Cấu Trúc API

### Request Format
```json
{
  "test_name": "Tên bài thi",
  "questions": [
    {
      "content": "Nội dung câu hỏi",
      "answers": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correct_answers": [1],
      "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    }
  ]
}
```

### Base64 Format
- **Prefix**: `data:image/[type];base64,`
- **Type**: `jpeg`, `png`, `gif`
- **Data**: Base64 encoded image data

## 🧪 Test Cases

### 1. Test Upload Ảnh

#### A. Upload Ảnh JPG
1. Truy cập `http://localhost:4200/create-exercise`
2. Thêm câu hỏi mới
3. Click "Chọn ảnh" và chọn file JPG
4. Kiểm tra console logs:
   ```
   📸 Uploading image for question 1: {fileName: "test.jpg", fileSize: 12345, fileType: "image/jpeg"}
   ✅ Image converted to base64: {fileName: "test.jpg", fileSize: 12345, fileType: "image/jpeg", base64Length: 67890}
   ✅ Image uploaded successfully: {questionIndex: 1, imageType: "base64", imageLength: 67890}
   ```

#### B. Upload Ảnh PNG
1. Chọn file PNG
2. Kiểm tra base64 prefix: `data:image/png;base64,`

#### C. Upload Ảnh GIF
1. Chọn file GIF
2. Kiểm tra base64 prefix: `data:image/gif;base64,`

### 2. Test Validation

#### A. File Type Validation
- ✅ JPG: `image/jpeg`, `image/jpg`
- ✅ PNG: `image/png`
- ✅ GIF: `image/gif`
- ❌ Other: `image/bmp`, `image/svg+xml`

#### B. File Size Validation
- ✅ < 5MB: Upload thành công
- ❌ > 5MB: Error "File ảnh không được vượt quá 5MB"

### 3. Test Preview

#### A. Hiển Thị Ảnh
1. Upload ảnh thành công
2. Kiểm tra preview hiển thị đúng
3. Ảnh có thể zoom và xem chi tiết

#### B. Xóa Ảnh
1. Click "Xóa ảnh"
2. Preview biến mất
3. `question.imageUrl` = `undefined`

### 4. Test API Call

#### A. Tạo Bài Thi Với Ảnh
1. Tạo bài thi có ảnh
2. Click "Lưu & Xuất Bản"
3. Kiểm tra console logs:
   ```
   📸 Question with image: {questionContent: "...", hasImage: true, imageType: "base64", imageLength: 67890}
   🚀 Sending test data to server: {testName: "...", questionsCount: 3, questionsWithImages: 1}
   Question 1: {content: "...", answersCount: 4, correctAnswers: [1], hasImage: true, imageLength: 67890}
   ```

#### B. Kiểm Tra Network Request
1. Mở Developer Tools → Network
2. Tìm POST request đến `/exams`
3. Kiểm tra request body:
   ```json
   {
     "test_name": "Bài thi test",
     "questions": [
       {
         "content": "Câu hỏi có ảnh?",
         "answers": ["A", "B", "C", "D"],
         "correct_answers": [1],
         "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
       }
     ]
   }
   ```

### 5. Test Demo Component

#### A. Test Parse + Create
1. Truy cập `http://localhost:4200/demo-create-exam`
2. Click "Test Parse" để parse câu hỏi
3. Click "Tạo Bài Thi Demo"
4. Kiểm tra:
   - ✅ Demo image được thêm vào câu hỏi đầu tiên
   - ✅ Base64 data được tạo đúng format
   - ✅ Console logs hiển thị thông tin chi tiết

#### B. Test Publish
1. Click "Xuất Bản Bài Thi"
2. Kiểm tra API call với base64 data
3. Kiểm tra response từ server

## 🔍 Debug Information

### Console Logs

#### Upload Image
```
📸 Uploading image for question 1: {fileName: "test.jpg", fileSize: 12345, fileType: "image/jpeg"}
✅ Image converted to base64: {fileName: "test.jpg", fileSize: 12345, fileType: "image/jpeg", base64Length: 67890}
✅ Image uploaded successfully: {questionIndex: 1, imageType: "base64", imageLength: 67890}
```

#### Create Test
```
📸 Question with image: {questionContent: "Câu hỏi có ảnh?", hasImage: true, imageType: "base64", imageLength: 67890}
🚀 Sending test data to server: {testName: "Bài thi test", questionsCount: 3, questionsWithImages: 1}
Question 1: {content: "Câu hỏi có ảnh?", answersCount: 4, correctAnswers: [1], hasImage: true, imageLength: 67890}
```

### Network Request
- **URL**: `POST /exams`
- **Content-Type**: `application/json`
- **Body**: JSON với base64 data trong trường `image`

## 🐛 Common Issues

### Issue 1: Ảnh không hiển thị
**Nguyên nhân**: Base64 data bị lỗi format
**Giải pháp**: Kiểm tra prefix `data:image/[type];base64,`

### Issue 2: File quá lớn
**Nguyên nhân**: Base64 làm tăng kích thước file ~33%
**Giải pháp**: Nén ảnh trước khi upload

### Issue 3: API reject base64
**Nguyên nhân**: Server không hỗ trợ base64
**Giải pháp**: Kiểm tra API documentation

### Issue 4: Memory issues
**Nguyên nhân**: Quá nhiều ảnh base64
**Giải pháp**: Implement lazy loading

## 📊 Performance

### File Size Impact
- **Original JPG**: 100KB
- **Base64 JPG**: ~133KB (+33%)
- **Original PNG**: 200KB
- **Base64 PNG**: ~267KB (+33%)

### Memory Usage
- **1 ảnh 1MB**: ~1.33MB base64
- **10 ảnh 1MB**: ~13.3MB base64
- **Recommendation**: Limit ảnh < 500KB

## ✅ Expected Results

### Success Case
1. ✅ Upload ảnh thành công
2. ✅ Base64 conversion hoạt động
3. ✅ Preview hiển thị đúng
4. ✅ API call với base64 data
5. ✅ Server nhận được ảnh đúng format

### Error Cases
1. ✅ File type validation
2. ✅ File size validation
3. ✅ Error handling graceful
4. ✅ User feedback rõ ràng

## 🎯 Best Practices

### Image Optimization
1. **Compress trước upload**: Giảm kích thước file
2. **Chọn format phù hợp**: JPG cho ảnh, PNG cho icon
3. **Resize nếu cần**: Không upload ảnh quá lớn

### Code Optimization
1. **Lazy loading**: Chỉ load ảnh khi cần
2. **Memory cleanup**: Xóa ảnh không dùng
3. **Error handling**: Xử lý lỗi upload

---

**Lưu ý**: Test này cần được thực hiện với các loại ảnh khác nhau để đảm bảo tính năng hoạt động ổn định.
