# Test API Call cho Teacher Dashboard

## API Endpoint được sử dụng
- **URL**: `https://chimeara.pythonanywhere.com/users`
- **Method**: GET
- **Parameters**: 
  - `page`: 1 (default)
  - `limit`: 100 (default)
  - `role`: 'student' (để lấy chỉ học sinh)

## Cách test

### 1. Mở Developer Console
- F12 trong browser
- Chuyển đến tab Console

### 2. Kiểm tra logs
Khi load trang teacher dashboard, bạn sẽ thấy các logs sau:

```
📥 Fetching users from API: {
  url: "https://chimeara.pythonanywhere.com/users?page=1&limit=100&role=student",
  page: 1,
  limit: 100,
  role: "student"
}
```

### 3. Kiểm tra response
Nếu API call thành công, bạn sẽ thấy:

```
✅ Users fetched successfully: {
  count: [số lượng học sinh],
  usersCount: [số lượng users trong response],
  success: true
}
```

### 4. Kiểm tra dữ liệu hiển thị
- Số lượng học sinh sẽ được hiển thị trong card "Tổng số học sinh"
- Dữ liệu sẽ được load từ API thay vì mock data

## Troubleshooting

### Nếu gặp lỗi CORS:
- API server cần được cấu hình để cho phép CORS từ domain localhost:4200

### Nếu gặp lỗi 404:
- Kiểm tra URL API có đúng không
- Kiểm tra API server có đang chạy không

### Nếu gặp lỗi 500:
- Kiểm tra API server logs
- Có thể có lỗi trong database hoặc logic server

## Expected Response Format
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "student1",
      "email": "student1@example.com",
      "role": "student",
      "name": "Nguyễn Văn A",
      "grade": 12,
      "school": "THPT ABC",
      "class": "12A1",
      "studentId": "HS001"
    }
  ],
  "count": 1,
  "page": 1,
  "limit": 100
}
```
