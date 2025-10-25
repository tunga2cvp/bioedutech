# Tính năng Báo cáo Giáo viên (Teacher Reports)

## Tổng quan
Tính năng báo cáo giáo viên cho phép giáo viên xem thống kê và chi tiết kết quả của học sinh cho các bài thi đã tạo.

## Tính năng chính

### 1. Danh sách bài thi và thống kê
- Hiển thị tất cả bài thi đã tạo
- Thống kê số lượt làm bài
- Điểm trung bình (%)
- Thời gian làm trung bình
- Thời gian nộp bài cuối cùng

### 2. Chi tiết kết quả bài thi
- Xem chi tiết từng học sinh đã làm bài
- Điểm số và tỷ lệ đúng của từng học sinh
- Thời gian làm bài
- Thời gian nộp bài

### 3. Giao diện thân thiện
- Thiết kế Material Design hiện đại
- Responsive trên mọi thiết bị
- Loading states và error handling
- Modal popup cho chi tiết

## Cách sử dụng

### Truy cập trang báo cáo
1. **Từ Header**: Click vào nút "📊 Báo cáo" trên thanh điều hướng
2. **Từ Dashboard**: Click vào nút "Xem báo cáo" trong phần "Thao tác nhanh"

### Xem thống kê tổng quan
- Trang báo cáo hiển thị bảng với các cột:
  - **Tên bài thi**: Tên bài thi
  - **Số lượt làm**: Tổng số lần học sinh đã làm bài
  - **Điểm trung bình**: Điểm trung bình của tất cả học sinh (%)
  - **Thời gian làm trung bình**: Thời gian hoàn thành trung bình
  - **Lần làm cuối**: Thời gian nộp bài gần nhất
  - **Thao tác**: Nút xem chi tiết

### Xem chi tiết kết quả
1. Click vào nút "👁️" ở cột "Thao tác"
2. Modal popup sẽ hiển thị chi tiết kết quả của bài thi
3. Bảng chi tiết bao gồm:
   - **Học sinh**: Tên và username
   - **Điểm số**: Điểm đạt được/tổng điểm
   - **Tỷ lệ đúng**: Phần trăm đúng
   - **Thời gian làm**: Thời gian hoàn thành bài thi
   - **Thời gian nộp**: Thời điểm nộp bài

## API Integration

### Endpoint sử dụng
```
GET /exams/{exam_id}/results
```

### Response format
```json
{
  "count": 2,
  "results": [
    {
      "max_score": 1,
      "percentage": 100,
      "score": 1,
      "student": {
        "name": "Nguyễn Thanh Tùng",
        "username": "tungnt23"
      },
      "student_id": 1,
      "submission_id": 1,
      "time_taken": 0,
      "timestamp": "2025-10-24T14:58:54.394316Z"
    }
  ],
  "success": true
}
```

## Cấu trúc Component

### TeacherReportsComponent
- **File**: `src/app/components/teacher-reports/teacher-reports.component.ts`
- **Chức năng**: Logic chính cho trang báo cáo
- **Dependencies**: ApiService, ExerciseService

### Interfaces
- **ExamResult**: Interface cho kết quả của một học sinh
- **ExamResultsResponse**: Interface cho response từ API
- **ExamReportData**: Interface cho dữ liệu hiển thị trong bảng

## Styling

### SCSS Features
- Responsive design cho mobile và desktop
- Material Design color scheme
- Smooth animations và transitions
- Loading states và empty states
- Modal overlay với backdrop blur

### Color Coding
- **Xanh lá (Primary)**: Điểm >= 80%
- **Cam (Accent)**: Điểm >= 60%
- **Đỏ (Warn)**: Điểm < 60%

## Error Handling

### Loading States
- Spinner khi tải dữ liệu
- Skeleton loading cho bảng
- Progress indicator cho modal

### Error Messages
- Toast notifications cho lỗi API
- Fallback UI khi không có dữ liệu
- Retry mechanism cho failed requests

## Responsive Design

### Breakpoints
- **Desktop**: > 768px - Full table layout
- **Tablet**: 768px - Compact table
- **Mobile**: < 480px - Stacked layout

### Mobile Optimizations
- Touch-friendly buttons
- Swipe gestures cho modal
- Optimized font sizes
- Collapsible sections

## Performance

### Optimization Features
- Lazy loading cho exam details
- Debounced search (nếu có)
- Virtual scrolling cho large datasets
- Caching cho API responses

## Testing

### Test Cases
1. Load exam reports successfully
2. Handle empty exam list
3. Handle API errors gracefully
4. Modal open/close functionality
5. Responsive layout testing
6. Data formatting accuracy

## Future Enhancements

### Planned Features
- Export reports to Excel/PDF
- Filter by date range
- Search functionality
- Advanced analytics charts
- Student performance trends
- Class comparison reports

## Troubleshooting

### Common Issues
1. **Không hiển thị dữ liệu**: Kiểm tra API connection và authentication
2. **Modal không mở**: Kiểm tra console errors và component imports
3. **Layout bị vỡ**: Kiểm tra responsive CSS và viewport settings
4. **Performance chậm**: Kiểm tra API response time và data processing

### Debug Tips
- Sử dụng browser dev tools để inspect API calls
- Check console logs cho error messages
- Verify component imports và dependencies
- Test với different screen sizes
