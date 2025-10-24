# 🧪 API Testing Guide - BioEduTech

## 📋 Tổng quan

Tài liệu này hướng dẫn cách test và kiểm tra API `/exams` để **tạo bài thi** trong ứng dụng BioEduTech.

## 🔧 Cách Test API

### 1. Sử dụng API Test Component

1. **Truy cập trang test API:**
   - Đăng nhập với tài khoản teacher
   - Click vào menu "Test API" trong sidebar
   - Hoặc truy cập trực tiếp: `http://localhost:4200/api-test`

2. **Thực hiện test:**
   - Click button "Test Tạo Bài Thi"
   - Xem kết quả trả về trong phần "Kết quả tạo bài thi"
   - Nếu có lỗi, xem thông tin trong phần "Lỗi"

### 2. Test qua Console

Mở Developer Tools (F12) và chạy lệnh sau trong Console:

```javascript
// Test API /exams để tạo bài thi
const testData = {
  test_data: {
    teacher_id: "T001",
    test_id: "test_exercise_001",
    test_title: "Bài kiểm tra Sinh học lớp 10",
    test_description: "Kiểm tra kiến thức chương 1",
    grade: 10,
    chapter: "Chương 1: Sinh học tế bào",
    time_limit: 60,
    max_score: 100,
    questions: [
      {
        question_id: "q001",
        question_text: "Tế bào là đơn vị cơ bản của sự sống?",
        question_type: "single",
        options: [
          { option_id: "a", text: "Đúng", is_correct: true },
          { option_id: "b", text: "Sai", is_correct: false }
        ],
        explanation: "Tế bào là đơn vị cơ bản nhất của sự sống"
      }
    ],
    is_published: true,
    created_at: new Date().toISOString()
  }
};

// Gọi API
fetch('https://chimeara.pythonanywhere.com/exams', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('API Response:', data))
.catch(error => console.error('API Error:', error));
```

## 🚀 Test Khi Tạo Bài Tập

### 1. Tạo Bài Tập Mới

1. **Truy cập trang tạo bài tập:**
   - Đăng nhập với tài khoản teacher
   - Click "Tạo Bài Tập" hoặc truy cập `/create-exercise`

2. **Tạo bài tập:**
   - Điền thông tin cơ bản (tên, mô tả, lớp, chương, thời gian, điểm)
   - Thêm ít nhất 1 câu hỏi
   - Click "Lưu Bài Tập" hoặc "Lưu & Xuất Bản"

3. **Kiểm tra API call:**
   - Mở Developer Tools (F12) → Network tab
   - Tìm request đến `https://chimeara.pythonanywhere.com/exams`
   - Xem request payload và response

### 2. Kiểm tra Console Logs

Khi tạo bài tập, các log sau sẽ xuất hiện trong Console:

```
Bài tập đã được tạo locally, đang gửi lên server...
Bài thi đã được tạo trên server: {result: "success", ...}
Bài tập đã được xuất bản và gửi lên server thành công!
```

## 📊 Kiểm tra API Response

### Response Thành Công

```json
{
  "result": "success",
  "score": 85,
  "max_score": 100,
  "correct_answers": 17,
  "total_questions": 20,
  "submission_id": "sub_001",
  "submitted_at": "2024-01-15T10:30:00Z",
  "detailed_results": [
    {
      "question_id": "q001",
      "is_correct": true,
      "selected_options": ["a"],
      "correct_options": ["a"],
      "explanation": "Đáp án đúng"
    }
  ]
}
```

### Response Lỗi

```json
{
  "result": "error",
  "message": "Invalid test data",
  "error_code": "INVALID_DATA"
}
```

## 🔍 Troubleshooting

### 1. API Không Gọi Được

**Nguyên nhân có thể:**
- Mất kết nối internet
- Server API không hoạt động
- CORS policy blocking

**Cách khắc phục:**
- Kiểm tra kết nối internet
- Kiểm tra server: `https://chimeara.pythonanywhere.com`
- Kiểm tra Console để xem lỗi CORS

### 2. Lỗi 404 Not Found

**Nguyên nhân:**
- Endpoint `/exams` không tồn tại
- URL API không đúng

**Cách khắc phục:**
- Kiểm tra Swagger UI: `https://chimeara.pythonanywhere.com/apidocs/`
- Xác nhận endpoint chính xác

### 3. Lỗi 500 Internal Server Error

**Nguyên nhân:**
- Server có lỗi xử lý
- Dữ liệu gửi lên không hợp lệ

**Cách khắc phục:**
- Kiểm tra format dữ liệu gửi lên
- Liên hệ admin server

## 📝 Logs Quan Trọng

### Khi Tạo Bài Tập

```javascript
// Trong exercise.service.ts
console.log('Bài thi đã được tạo trên server:', result);
console.error('Lỗi khi tạo bài thi trên server:', error);
```

### Khi Xuất Bản Bài Tập

```javascript
// Trong exercise.service.ts
console.log('Bài thi đã được thông báo xuất bản trên server:', result);
console.error('Lỗi khi thông báo xuất bản bài thi:', error);
```

### Trong Component

```javascript
// Trong create-exercise.component.ts
console.log('Bài tập đã được tạo locally, đang gửi lên server...');
console.log('Bài tập đã được xuất bản và gửi lên server thành công!');
console.error('Lỗi khi xuất bản bài tập:', error);
```

## 🎯 Kết Quả Mong Đợi

### 1. Khi Tạo Bài Tập

- ✅ Bài tập được lưu vào localStorage
- ✅ API `/exams` được gọi với dữ liệu bài tập
- ✅ Console hiển thị log thành công
- ✅ Thông báo "Bài tập đã được đồng bộ lên server"

### 2. Khi Xuất Bản Bài Tập

- ✅ Bài tập được đánh dấu là published
- ✅ API `/exams` được gọi lần nữa để thông báo xuất bản
- ✅ Console hiển thị log thành công
- ✅ Thông báo "Bài tập đã được đồng bộ lên server"

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi test API:

1. **Kiểm tra Console logs** để xem lỗi chi tiết
2. **Kiểm tra Network tab** để xem request/response
3. **Test API trực tiếp** qua Swagger UI
4. **Liên hệ developer** với thông tin lỗi chi tiết

---

**Lưu ý**: API `/exams` hiện tại được sử dụng để test việc tích hợp. Trong production, có thể cần API riêng để tạo bài thi thay vì sử dụng API nộp bài thi.
