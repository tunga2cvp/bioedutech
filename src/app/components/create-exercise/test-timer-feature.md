# Test Timer Feature

## Tính năng Timer đã được thêm vào

### 1. Input Field Timer
- Thêm input field "Thời gian làm bài (tùy chọn)" trong form tạo bài thi
- Placeholder: "Ví dụ: 30m, 1h, 1h30m"
- Validation: Chỉ chấp nhận format như 30m, 1h, 1h30m

### 2. Validation Rules
- Format hợp lệ: `(\d+h)?(\d+m)?`
- Ví dụ hợp lệ: 30m, 1h, 1h30m, 2h, 45m
- Ví dụ không hợp lệ: 30, 1.5h, 1h30, abc

### 3. API Integration
- Trường `timer` được gửi trong POST /exams
- Format: string như "30m", "1h", "1h30m"
- Được lưu và trả về từ server

### 4. Model Updates
- `Exercise` interface: thêm `timer?: string`
- `CreateExerciseRequest` interface: thêm `timer?: string`
- `TestCreationRequest` interface: thêm `timer?: string`
- `TestListItem` interface: thêm `timer?: string`
- `TestDetailResponse` interface: thêm `timer?: string`

### 5. Service Updates
- `ExerciseService.createExercise()`: xử lý timer
- `ExerciseService.convertTestToExercise()`: map timer từ API
- `ExerciseService.convertTestDetailToExercise()`: map timer từ API
- `ExerciseService.createTestOnServer()`: gửi timer lên server

### 6. Component Updates
- Form validation cho timer field
- Error message cho invalid timer format
- Load timer khi edit exercise
- Gửi timer khi tạo bài thi mới

## Cách Test

1. Mở trang tạo bài thi mới
2. Nhập tên bài thi
3. Nhập timer với các format khác nhau:
   - 30m (30 phút)
   - 1h (1 giờ)
   - 1h30m (1 giờ 30 phút)
   - 2h (2 giờ)
4. Thêm câu hỏi
5. Lưu bài thi
6. Kiểm tra trong network tab xem timer có được gửi lên server không
7. Kiểm tra response từ server có chứa timer không

## Expected Behavior

- Input timer chấp nhận format đúng
- Hiển thị error message cho format sai
- Timer được gửi lên server trong API call
- Timer được lưu và hiển thị khi load lại bài thi
