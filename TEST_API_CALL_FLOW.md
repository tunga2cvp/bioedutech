# 🧪 Test API Call Flow - Xem Chi Tiết Bài Thi

## 📋 Vấn đề đã sửa

**Vấn đề**: 
1. Route đến view-exercise nhưng chưa gọi API lấy thông tin test
2. Cần sử dụng ID thực tế từ API get list test thay vì tự tạo ID

## 🛠️ Các thay đổi đã thực hiện

### 1. Enhanced Logging trong convertTestToExercise()
```typescript
console.log('=== CONVERTING TEST TO EXERCISE ===');
console.log('Raw test object from API:', JSON.stringify(test, null, 2));
console.log('Test ID field:', test.test_id);
console.log('All test fields:', Object.keys(test));
```

### 2. Improved ID Handling
```typescript
// Sử dụng server test_id làm exercise ID - kiểm tra kỹ hơn
let exerciseId: string;
if (test.test_id && test.test_id.trim() !== '') {
  exerciseId = test.test_id;
  console.log('✅ Using server test_id as exercise ID:', exerciseId);
} else {
  // Nếu không có test_id, tạo ID từ các field khác hoặc generate
  exerciseId = test.id || test.name || this.generateId();
  console.log('⚠️ No test_id found, using fallback ID:', exerciseId);
}
```

### 3. Always Call API (không skip nữa)
```typescript
// Luôn gọi API, không skip nữa
this.apiService.getTestDetail(testId).subscribe({
  next: (response: TestDetailResponse) => {
    console.log('✅ Test Detail API Response received:', response);
    // ...
  }
});
```

### 4. Enhanced Error Handling
```typescript
error: (error) => {
  console.error('❌ Lỗi khi load chi tiết bài thi từ server:', error);
  if (error.status === 404) {
    console.log('⚠️ Test không tồn tại trên server (404)');
  } else if (error.status === 0) {
    console.log('⚠️ Network error (CORS or server down)');
  }
}
```

## 🧪 Cách Test

### 1. Test Load Exercise List
1. **Truy cập exercise-list:**
   ```
   http://localhost:4200/exercise-list
   ```

2. **Kiểm tra Console logs khi load danh sách:**
   ```
   API Response: {tests: [...], total: X, page: 1, limit: 100}
   === CONVERTING TEST TO EXERCISE ===
   Raw test object from API: {
     "test_id": "actual_server_id",
     "test_name": "Bài kiểm tra Sinh học lớp 10",
     ...
   }
   Test ID field: actual_server_id
   All test fields: ["test_id", "test_name", "created_at", ...]
   ✅ Using server test_id as exercise ID: actual_server_id
   Final exercise ID will be: actual_server_id
   This ID will be used for API calls to /tests/actual_server_id
   ```

### 2. Test Click "Xem đầy đủ"
1. **Click "Xem đầy đủ" và kiểm tra logs:**
   ```
   === VIEW EXERCISE CLICKED ===
   Exercise object: {id: "actual_server_id", title: "..."}
   Exercise ID: actual_server_id
   About to navigate to: /view-exercise/actual_server_id
   ✅ Navigation successful: true
   ```

### 3. Test Load Exercise Detail
1. **Kiểm tra logs khi load chi tiết:**
   ```
   === LOADING EXERCISE DETAIL ===
   Exercise ID from route: actual_server_id
   Will call API: GET /tests/actual_server_id
   🔄 Attempting to load from server API...
   === GETTING TEST DETAIL FROM SERVER ===
   Test ID to fetch: actual_server_id
   API URL: GET /tests/actual_server_id
   ✅ Test Detail API Response received: {...}
   Response test_id: actual_server_id
   Response questions count: 5
   ✅ Converted exercise from detail: {...}
   Final exercise ID: actual_server_id
   Final exercise questions count: 5
   ✅ Exercise loaded successfully from server: Bài kiểm tra Sinh học lớp 10
   ✅ Using server data with full question details
   ✅ Questions count: 5
   ```

## 📊 Expected Results

### 1. Exercise List Loading
- ✅ API `/tests` được gọi và trả về danh sách tests
- ✅ Raw test objects được log chi tiết
- ✅ Server test_id được sử dụng làm exercise.id
- ✅ Không tự tạo ID nữa

### 2. Navigation
- ✅ Click "Xem đầy đủ" chuyển đến `/view-exercise/{actual_server_id}`
- ✅ URL thay đổi đúng
- ✅ Không có page reload

### 3. Exercise Detail Loading
- ✅ API `/tests/{actual_server_id}` được gọi
- ✅ Server trả về chi tiết bài thi với đầy đủ câu hỏi
- ✅ Dữ liệu được convert và hiển thị đúng
- ✅ Fallback về local data nếu API lỗi

## 🔍 Debug Information

### Console Logs để theo dõi:

1. **Load Exercise List:**
   ```
   === CONVERTING TEST TO EXERCISE ===
   Raw test object from API: {...}
   Test ID field: actual_server_id
   ✅ Using server test_id as exercise ID: actual_server_id
   ```

2. **Click View Exercise:**
   ```
   === VIEW EXERCISE CLICKED ===
   Exercise ID: actual_server_id
   About to navigate to: /view-exercise/actual_server_id
   ```

3. **Load Exercise Detail:**
   ```
   === LOADING EXERCISE DETAIL ===
   === GETTING TEST DETAIL FROM SERVER ===
   Test ID to fetch: actual_server_id
   API URL: GET /tests/actual_server_id
   ✅ Test Detail API Response received: {...}
   ```

## 🚨 Troubleshooting

### 1. API `/tests` không trả về test_id
**Logs sẽ hiển thị:**
```
⚠️ No test_id found, using fallback ID: generated_id
Available fields: ["id", "name", "title", ...]
```

**Giải pháp:**
- Kiểm tra API response structure
- Cập nhật TestListItem interface nếu cần
- Sử dụng field khác làm ID

### 2. API `/tests/{id}` trả về 404
**Logs sẽ hiển thị:**
```
❌ Server API call failed: 404
⚠️ Test không tồn tại trên server (404)
🔄 Falling back to local data
```

**Giải pháp:**
- Kiểm tra ID có đúng không
- Kiểm tra API endpoint có hoạt động không
- Test API trực tiếp qua Swagger

### 3. API `/tests/{id}` trả về CORS error
**Logs sẽ hiển thị:**
```
❌ Server API call failed: 0
⚠️ Network error (CORS or server down)
🔄 Falling back to local data
```

**Giải pháp:**
- Kiểm tra CORS configuration
- Kiểm tra server có hoạt động không
- Test API trực tiếp

## 🎯 Key Points

### 1. ID Mapping
- **Server tests** → `exercise.id = test.test_id` (từ API response)
- **Fallback** → `exercise.id = test.id || test.name || generatedId()`

### 2. API Call Flow
- **Load List** → `GET /tests` → Convert to Exercise
- **View Detail** → `GET /tests/{exercise.id}` → Load full details

### 3. Error Handling
- **404** → Test không tồn tại trên server
- **0** → Network error (CORS/server down)
- **Other** → Server error

---

**Lưu ý**: Bây giờ hệ thống sẽ sử dụng ID thực tế từ server và luôn gọi API để lấy chi tiết bài thi, đảm bảo dữ liệu luôn được đồng bộ và chính xác.
