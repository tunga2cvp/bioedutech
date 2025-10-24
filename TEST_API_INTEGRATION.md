# 🧪 Test API Integration - Xem Chi Tiết Bài Thi

## 📋 Tổng quan

Tài liệu này hướng dẫn test tính năng xem chi tiết bài thi từ màn hình exercise-list sử dụng API `/tests/{test_id}`.

## 🔧 Các thay đổi đã thực hiện

### 1. API Service (`src/app/services/api.service.ts`)
- ✅ Thêm interface `TestDetailQuestion` và `TestDetailResponse`
- ✅ Thêm method `getTestDetail(testId: string)` để gọi API GET `/tests/{test_id}`

### 2. Exercise Service (`src/app/services/exercise.service.ts`)
- ✅ Thêm method `getTestDetailFromServer(testId: string)` 
- ✅ Thêm method `convertTestDetailToExercise()` để convert dữ liệu từ API sang format Exercise
- ✅ Import các interface mới từ ApiService

### 3. View Exercise Component (`src/app/components/view-exercise/view-exercise.component.ts`)
- ✅ Cập nhật method `loadExercise()` để ưu tiên load từ server
- ✅ Thêm method `loadExerciseFromLocal()` làm fallback
- ✅ Thêm error handling và logging chi tiết

## 🚀 Cách Test

### 1. Test từ Exercise List
1. **Truy cập trang exercise-list:**
   ```
   http://localhost:4200/exercise-list
   ```

2. **Click vào nút "Xem đầy đủ" hoặc "Xem" trong dropdown:**
   - Component sẽ gọi API `/tests/{test_id}` để lấy chi tiết bài thi
   - Nếu API thành công, hiển thị dữ liệu từ server
   - Nếu API lỗi, fallback về dữ liệu local

### 2. Test API trực tiếp
Mở Developer Tools (F12) và chạy lệnh sau trong Console:

```javascript
// Test API GET /tests/{test_id}
const testId = 'test_001'; // Thay bằng ID bài thi thực tế

fetch(`https://chimeara.pythonanywhere.com/tests/${testId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log('API Response:', data))
.catch(error => console.error('API Error:', error));
```

### 3. Kiểm tra Console Logs
Khi click "Xem đầy đủ" từ exercise-list, các log sau sẽ xuất hiện:

```
ViewExerciseComponent ngOnInit - Exercise ID: test_001
Loading exercise with ID: test_001
Test Detail API Response: {test_id: "test_001", test_name: "...", ...}
Converting test detail to exercise: {...}
Converted exercise from detail: {...}
Exercise loaded from server: {...}
Exercise loaded successfully from server: Bài kiểm tra Sinh học lớp 10
```

## 📊 Expected API Response Format

### GET /tests/{test_id}
```json
{
  "test_id": "test_001",
  "test_name": "Bài kiểm tra Sinh học lớp 10",
  "description": "Kiểm tra kiến thức chương 1",
  "grade": 10,
  "time_limit": 60,
  "max_score": 100,
  "questions": [
    {
      "question_id": "q001",
      "content": "Tế bào là đơn vị cơ bản của sự sống?",
      "answers": ["Đúng", "Sai"],
      "correct_answers": [0],
      "image": "optional_image_url",
      "explanation": "Tế bào là đơn vị cơ bản nhất của sự sống",
      "order": 1
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "status": "published",
  "retry_limit": 1,
  "show_answers_after_submit": true,
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-01-20T23:59:59Z",
  "assigned_classes": ["10A1", "10A2"],
  "created_by": "teacher_001"
}
```

## 🔍 Troubleshooting

### 1. API Không Trả Về Dữ Liệu
**Nguyên nhân có thể:**
- Test ID không tồn tại trên server
- Server API không hoạt động
- CORS policy blocking

**Cách khắc phục:**
- Kiểm tra Console để xem error message
- Test API trực tiếp qua Swagger UI
- Kiểm tra Network tab để xem request/response

### 2. Fallback Về Local Data
**Khi nào xảy ra:**
- API server không phản hồi
- Test ID không tồn tại trên server
- Lỗi network

**Logs sẽ hiển thị:**
```
Lỗi khi tải bài tập từ server: Error message
Falling back to local data
Loading exercise from local data with ID: test_001
```

### 3. Data Conversion Issues
**Kiểm tra:**
- Console logs cho "Converting test detail to exercise"
- Console logs cho "Converted exercise from detail"
- So sánh structure của TestDetailResponse với Exercise model

## 🎯 Kết Quả Mong Đợi

### 1. Khi API Thành Công
- ✅ Load dữ liệu từ server API `/tests/{test_id}`
- ✅ Convert dữ liệu từ TestDetailResponse sang Exercise format
- ✅ Hiển thị đầy đủ thông tin bài thi và câu hỏi
- ✅ Console hiển thị logs thành công

### 2. Khi API Lỗi
- ✅ Fallback về dữ liệu local
- ✅ Hiển thị thông báo lỗi trong Console
- ✅ Vẫn có thể xem bài thi từ dữ liệu local

### 3. Data Integrity
- ✅ Tất cả câu hỏi được load đúng
- ✅ Đáp án đúng được đánh dấu chính xác
- ✅ Thông tin metadata (thời gian, điểm, lớp) hiển thị đúng

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. **Kiểm tra Console logs** để xem chi tiết lỗi
2. **Kiểm tra Network tab** để xem API request/response
3. **Test API trực tiếp** qua Swagger UI: `https://chimeara.pythonanywhere.com/apidocs/`
4. **Kiểm tra test ID** có tồn tại trên server không

---

**Lưu ý**: Tính năng này ưu tiên load dữ liệu từ server để đảm bảo tính nhất quán, nhưng vẫn có fallback về local data để đảm bảo trải nghiệm người dùng.
