# Tính năng xóa bài thi - DELETE Exam Feature

## Tổng quan
Đã thêm tính năng xóa bài thi cho giáo viên tại màn hình `/exercise-list` với API endpoint `DELETE /exams/{exam_id}`.

## Các thay đổi đã thực hiện

### 1. API Service (`src/app/services/api.service.ts`)
**Đã thêm method `deleteExam()`:**
- Endpoint: `DELETE /exams/{exam_id}`
- Parameter: `examId` (string | number)
- Response: `{ success: boolean, message: string }`
- Console logging để debug

```typescript
deleteExam(examId: string | number): Observable<{ success: boolean; message: string }>
```

### 2. Exercise Service (`src/app/services/exercise.service.ts`)
**Đã thêm imports và method `deleteExercise()`:**
- Import `tap`, `catchError` từ `rxjs/operators`
- Method `deleteExerciseLocal()` cho xóa local (giữ lại để backward compatibility)
- Method `deleteExercise()` mới gọi API server
- Tự động cập nhật local state và stats sau khi xóa thành công

**Logic flow:**
1. Gọi API `deleteExam()` 
2. Nếu thành công, xóa khỏi local state
3. Cập nhật stats
4. Logging chi tiết cho debugging

### 3. Exercise Card Component (`src/app/components/exercise-card/`)
**File `.ts`:**
- Thêm `@Output() deleteExercise = new EventEmitter<Exercise>()`
- Thêm method `onDeleteExercise()` để emit event

**File `.html`:**
- Thêm nút xóa (🗑️) trong `.exercise-meta`
- Button có class `btn-delete`
- Tooltip: "Xóa bài thi"

**File `.scss`:**
- Style cho `.btn-delete`:
  - Background: #ffebee (light red)
  - Color: #f44336 (red)
  - Hình tròn 28x28px
  - Hover effect với scale animation
  - Active state với scale-down animation

### 4. Exercise List Component (`src/app/components/exercise-list/`)
**File `.html`:**
- Thêm event binding `(deleteExercise)="deleteExercise($event)"` cho `app-exercise-card`

**File `.ts`:**
- Thêm method `deleteExercise(exercise: Exercise)`:
  - Validation exercise và exercise.id
  - Confirm dialog với người dùng
  - Gọi `exerciseService.deleteExercise()`
  - Xóa khỏi local arrays (`exercises` và `filteredExercises`)
  - Gọi `applyFilters()` để cập nhật UI
  - Success/error alerts
  - Console logging chi tiết

## Cách sử dụng

### Giáo viên xóa bài thi:
1. Điều hướng đến `/exercise-list` (Quản Lý Bài Tập Trắc Nghiệm)
2. Mỗi thẻ bài thi có nút xóa (🗑️) ở góc phải trên
3. Click nút xóa
4. Confirm dialog xuất hiện: "Bạn có chắc chắn muốn xóa bài thi '{title}'? Hành động này không thể hoàn tác."
5. Nếu xác nhận → API call DELETE
6. Nếu thành công → Bài thi bị xóa khỏi danh sách và server
7. Hiển thị alert thành công/error

## API Integration

**Endpoint:** `DELETE https://chimeara.pythonanywhere.com/exams/{exam_id}`

**Request:**
- Method: DELETE
- Headers: Content-Type: application/json
- Path parameter: exam_id (integer)

**Response:**
```json
{
  "success": true,
  "message": "Exam deleted successfully"
}
```

## Validation & Error Handling

1. **Validation:**
   - Kiểm tra exercise object tồn tại
   - Kiểm tra exercise.id có giá trị
   - Confirmation dialog từ người dùng

2. **Error Handling:**
   - Network errors: Hiển thị alert thông báo lỗi
   - Console logging chi tiết để debug
   - User-friendly error messages

## UI/UX Features

1. **Delete Button:**
   - Icon 🗑️ dễ nhận biết
   - Hover effect (scale up)
   - Active state (scale down)
   - Light red color theme
   - Tooltip "Xóa bài thi"

2. **Confirmation:**
   - JavaScript confirm dialog
   - Hiển thị tên bài thi trong message
   - Warning về tính không thể hoàn tác

3. **Feedback:**
   - Success alert: "Bài thi '{title}' đã được xóa thành công."
   - Error alert: "Có lỗi xảy ra khi xóa bài thi. Vui lòng thử lại sau."
   - Tự động cập nhật danh sách sau khi xóa

## Testing Checklist

- [x] API method `deleteExam()` được thêm vào `api.service.ts`
- [x] Service method `deleteExercise()` được thêm vào `exercise.service.ts`
- [x] Event emitter `deleteExercise` được thêm vào `exercise-card.component.ts`
- [x] Delete button được thêm vào `exercise-card.component.html`
- [x] Styles cho delete button được thêm vào `exercise-card.component.scss`
- [x] Delete handler `deleteExercise()` được thêm vào `exercise-list.component.ts`
- [x] Event binding được thêm vào `exercise-list.component.html`
- [x] No linter errors
- [x] Build successful
- [x] Type safety verified (using `map` operator to convert response)
- [ ] Test với real API
- [ ] Test confirmation dialog
- [ ] Test error handling

## Files Modified

1. `src/app/services/api.service.ts` - Added `deleteExam()` method
2. `src/app/services/exercise.service.ts` - Added `deleteExercise()` method, imports
3. `src/app/components/exercise-card/exercise-card.component.ts` - Added event emitter
4. `src/app/components/exercise-card/exercise-card.component.html` - Added delete button
5. `src/app/components/exercise-card/exercise-card.component.scss` - Added styles
6. `src/app/components/exercise-list/exercise-list.component.ts` - Added delete handler
7. `src/app/components/exercise-list/exercise-list.component.html` - Added event binding

## Notes

- Delete button có vị trí trong `.exercise-meta` section, bên cạnh các badge khác
- Confirmation dialog sử dụng native JavaScript `confirm()`
- Local state được cập nhật ngay sau khi API call thành công
- Stats được tự động cập nhật
- Console logging chi tiết giúp debug

