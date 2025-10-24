# API Endpoint Update: /tests → /exams

## Tổng quan
API endpoint đã được cập nhật từ `/tests` sang `/exams` để rõ ràng hơn trong việc tạo bài thi.

## Thay đổi được thực hiện

### 1. API Service Updates (`src/app/services/api.service.ts`)

#### Endpoints được cập nhật:
- `POST /tests` → `POST /exams` (tạo bài thi)
- `GET /tests` → `GET /exams` (lấy danh sách bài thi)
- `GET /tests/{id}` → `GET /exams/{id}` (lấy chi tiết bài thi)
- `POST /tests` (submit) → `POST /exams` (submit bài thi)

#### Interface Updates:
```typescript
// Cũ
export interface TestListResponse {
  tests: TestListItem[];
  total: number;
  page: number;
  limit: number;
}

// Mới
export interface TestListResponse {
  exams: TestListItem[];  // Changed from 'tests' to 'exams'
  count: number;          // Changed from 'total' to 'count'
  page?: number;          // Made optional
  limit?: number;         // Made optional
  success: boolean;       // Added success field
}
```

### 2. Exercise Service Updates (`src/app/services/exercise.service.ts`)

#### Cập nhật response handling:
- `response.tests` → `response.exams`
- Cập nhật comments để phản ánh endpoint mới
- Cập nhật console logs để hiển thị đúng API URL

## API Response Format

### Endpoint mới `/exams`:
```json
{
  "count": 0,
  "exams": [],
  "success": true
}
```

### So sánh với endpoint cũ `/tests`:
- Endpoint cũ vẫn hoạt động nhưng có thể deprecated
- Endpoint mới có format response rõ ràng hơn với field `success`
- Field `exams` thay vì `tests` để phù hợp với mục đích tạo bài thi

## Lợi ích của việc thay đổi

1. **Rõ ràng hơn**: `/exams` rõ ràng hơn `/tests` trong ngữ cảnh giáo dục
2. **Phù hợp với mục đích**: Tập trung vào việc tạo bài thi thay vì test chung chung
3. **Response format tốt hơn**: Có field `success` để xác nhận trạng thái
4. **Tương thích ngược**: Endpoint cũ vẫn hoạt động trong thời gian chuyển đổi

## Kiểm tra hoạt động

### Test API endpoints:
```bash
# Test endpoint mới
curl -X GET "https://chimeara.pythonanywhere.com/exams"

# Response:
{"count":0,"exams":[],"success":true}
```

### Test trong ứng dụng:
1. Tạo bài tập mới → Gọi `POST /exams`
2. Xem danh sách bài tập → Gọi `GET /exams`
3. Xem chi tiết bài tập → Gọi `GET /exams/{id}`

## Lưu ý

- Tất cả các thay đổi đã được test và không có lỗi linter
- Code đã được cập nhật để sử dụng endpoint mới
- Console logs đã được cập nhật để hiển thị đúng API URL
- Interface đã được cập nhật để phù hợp với response format mới

## Ngày cập nhật
24/10/2025
