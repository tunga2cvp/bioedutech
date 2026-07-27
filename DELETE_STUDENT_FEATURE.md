# Tính năng Xóa Học Sinh (Delete Student Feature)

## Tổng quan
Tính năng này cho phép giáo viên xóa tài khoản học sinh khỏi hệ thống thông qua API DELETE `/users/{user_id}`.

## API Endpoint
**DELETE** `/users/{user_id}`

### Tham số
- `user_id` (path, required): ID của người dùng cần xóa (integer)

### Responses
- **200**: Xóa thành công
  ```json
  {
    "message": "string",
    "success": true
  }
  ```
- **404**: Không tìm thấy người dùng
- **500**: Lỗi máy chủ khi xóa

## Thay đổi trong code

### 1. API Service (`src/app/services/api.service.ts`)

Thêm method mới để gọi API xóa người dùng:

```typescript
// Delete user API call - DELETE /users/{user_id}
deleteUser(userId: number): Observable<{ success: boolean; message: string }> {
  console.log('🗑️ Deleting user from API:', {
    userId,
    url: `${this.baseUrl}/users/${userId}`
  });

  return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/users/${userId}`, {
    headers: this.getHeaders()
  }).pipe(
    tap((response) => {
      console.log('✅ User deleted successfully:', response);
    }),
    catchError(error => {
      console.error('❌ Error deleting user:', error);
      return this.handleError(error);
    })
  );
}
```

**Chi tiết:**
- Gọi API DELETE với `userId` làm tham số
- Trả về Observable với response type `{ success: boolean; message: string }`
- Có error handling và logging đầy đủ

### 2. Student Management Component (`src/app/components/student-management/student-management.component.ts`)

Cập nhật method `deleteStudent()` để thực sự xóa người dùng:

```typescript
deleteStudent(student: User): void {
  const studentName = student.name || student.username || 'học sinh';
  if (confirm(`Bạn có chắc chắn muốn xóa học sinh ${studentName}?`)) {
    this.isLoading = true;
    
    this.apiService.deleteUser(student.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Remove the student from the local lists
            this.students = this.students.filter(s => s.id !== student.id);
            this.filteredStudents = this.filteredStudents.filter(s => s.id !== student.id);
            
            this.snackBar.open(`Đã xóa học sinh ${studentName} thành công`, 'Đóng', {
              duration: 3000
            });
          } else {
            this.snackBar.open('Không thể xóa học sinh. Vui lòng thử lại', 'Đóng', {
              duration: 3000
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error deleting student:', error);
          let errorMessage = 'Lỗi khi xóa học sinh';
          
          if (error.error?.statusCode === 404) {
            errorMessage = 'Không tìm thấy học sinh';
          } else if (error.error?.statusCode === 500) {
            errorMessage = 'Lỗi máy chủ khi xóa học sinh';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(errorMessage, 'Đóng', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
  }
}
```

**Chức năng:**
- Hiển thị dialog xác nhận trước khi xóa
- Gọi API để xóa người dùng
- Cập nhật danh sách local sau khi xóa thành công
- Hiển thị thông báo lỗi chi tiết dựa trên HTTP status code:
  - **404**: Không tìm thấy học sinh
  - **500**: Lỗi máy chủ
  - **Khác**: Hiển thị thông báo lỗi từ API
- Quản lý loading state để disable UI trong quá trình xóa

### 3. Styling (`src/app/components/student-management/student-management.component.scss`)

Thêm styling cho action buttons và delete button:

```scss
.action-btn {
  color: #666;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

// Delete action styling
::ng-deep .delete-action {
  color: #f44336 !important;
  
  &:hover {
    background: rgba(244, 67, 54, 0.08) !important;
  }
  
  mat-icon {
    color: #f44336 !important;
  }
}
```

**Mục đích:**
- Action button có màu xám mặc định
- Delete button có màu đỏ để cảnh báo người dùng đây là hành động nguy hiểm
- Hover effect với background color phù hợp

## Flow hoạt động

1. **Người dùng click nút "Xóa"** trong menu của một học sinh
2. **Hiển thị dialog xác nhận** với tên học sinh
3. **Nếu xác nhận**, hiển thị loading state
4. **Gọi API DELETE** `/users/{user_id}` với `userId` của học sinh
5. **Nếu thành công:**
   - Xóa học sinh khỏi danh sách `students` và `filteredStudents`
   - Hiển thị thông báo thành công
6. **Nếu thất bại:**
   - Hiển thị thông báo lỗi dựa trên HTTP status code
7. **Tắt loading state**

## Error Handling

Hệ thống xử lý các lỗi sau:
- **404 Not Found**: "Không tìm thấy học sinh"
- **500 Server Error**: "Lỗi máy chủ khi xóa học sinh"
- **Các lỗi khác**: Hiển thị message từ API

## UI/UX Features

### Xác nhận trước khi xóa
- Dialog confirmation để tránh xóa nhầm
- Hiển thị tên học sinh trong câu hỏi xác nhận

### Visual Feedback
- Loading spinner trong quá trình xóa
- Delete button có màu đỏ (danger color)
- Toast notifications cho success/error states

### Real-time Update
- Danh sách tự động cập nhật sau khi xóa thành công
- Không cần reload trang

## Testing

### Test Cases

1. **Xóa thành công**
   - Click nút "Xóa" → Xác nhận
   - Kiểm tra học sinh biến mất khỏi danh sách
   - Kiểm tra thông báo thành công hiển thị

2. **Hủy xóa**
   - Click nút "Xóa" → Hủy
   - Kiểm tra học sinh vẫn còn trong danh sách

3. **Xóa học sinh không tồn tại**
   - Gọi API với `user_id` không tồn tại
   - Kiểm tra thông báo "Không tìm thấy học sinh"

4. **Lỗi máy chủ**
   - Simulate lỗi 500 từ server
   - Kiểm tra thông báo "Lỗi máy chủ khi xóa học sinh"

## Files Modified

1. ✅ `src/app/services/api.service.ts` - Thêm method `deleteUser()`
2. ✅ `src/app/components/student-management/student-management.component.ts` - Cập nhật `deleteStudent()`
3. ✅ `src/app/components/student-management/student-management.component.scss` - Thêm styling cho delete action

## Files Not Modified
- `src/app/components/student-management/student-management.component.html` - Đã có sẵn delete button

## Next Steps (Optional Enhancements)

1. **Sử dụng Angular Material Dialog** thay vì `confirm()` để có UI đẹp hơn
2. **Add undo functionality** để khôi phục nếu xóa nhầm
3. **Batch delete** để xóa nhiều học sinh cùng lúc
4. **Soft delete** thay vì hard delete để có thể khôi phục sau này
5. **Export danh sách** trước khi xóa để backup

## Notes

- API này sẽ xóa vĩnh viễn tài khoản người dùng khỏi database
- Sau khi xóa, học sinh không thể đăng nhập vào hệ thống
- Tất cả dữ liệu liên quan đến học sinh (results, submissions) có thể bị ảnh hưởng
- Nên cân nhắc implement soft delete nếu cần backup dữ liệu



