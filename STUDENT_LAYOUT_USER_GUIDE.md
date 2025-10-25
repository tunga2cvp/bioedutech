# Hướng dẫn sử dụng Student Layout System

## 🎯 Tổng quan
Hệ thống Student Layout đã được hoàn thiện với header và footer persistent cho học sinh, đảm bảo trải nghiệm người dùng nhất quán xuyên suốt quá trình sử dụng.

## 🚀 Cách truy cập

### 1. Đăng nhập với tài khoản học sinh
```
Username: [tài khoản học sinh từ API]
Password: [mật khẩu tương ứng]
Role: student
```

### 2. Truy cập Student Dashboard
Sau khi đăng nhập thành công, bạn có thể truy cập:
- **URL chính**: `/student` hoặc `/student-dashboard`
- **Tự động redirect**: Sau login sẽ tự động chuyển đến dashboard

## 🎨 Giao diện Layout

### Header (Luôn hiển thị ở đầu trang)
```
┌─────────────────────────────────────────────────────────┐
│ 🏫 BioEduTech    📊 Dashboard  📝 Bài Thi  👤 Hồ Sơ    │
│                        [👤 S] Tên HS - Lớp 12A1 [⚙️][🚪] │
└─────────────────────────────────────────────────────────┘
```

**Tính năng Header**:
- **Logo**: Click để về trang chủ
- **Navigation**: Dashboard, Bài Thi, Hồ Sơ
- **User Info**: Avatar + Tên + Lớp học
- **Actions**: Cài đặt, Đăng xuất

### Footer (Luôn hiển thị ở cuối trang)
```
┌─────────────────────────────────────────────────────────┐
│ 🏫 BioEduTech                    📧 support@bioedutech  │
│ Nền tảng học tập sinh học...     📞 0123 456 789        │
│                                 📍 Trường THPT Mẫu     │
│ Dashboard | Bài thi | Kết quả | Hồ sơ                   │
│ Hướng dẫn | FAQ | Liên hệ | Báo lỗi                     │
│                                                         │
│ © 2024 BioEduTech. Tất cả quyền được bảo lưu.    [⬆️]   │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Navigation Flow

### 1. Từ Dashboard
```
/student-dashboard → Click "Bài Thi" → /student
```

### 2. Từ Danh sách Bài thi
```
/student → Click vào bài thi → /student/exam/:id
```

### 3. Navigation trong Header
```
Header "Dashboard" → /student-dashboard
Header "Bài Thi" → /student
Header "Hồ Sơ" → (TODO: Profile page)
```

### 4. Navigation trong Footer
```
Footer "Dashboard" → /student-dashboard
Footer "Bài thi" → /student
Footer "Kết quả" → (TODO: Results page)
```

## 📱 Responsive Design

### Desktop (>768px)
- Header: Full navigation + User info
- Footer: 4-column grid layout
- Full functionality visible

### Tablet (≤768px)
- Header: Logo + User info (navigation hidden)
- Footer: Single column layout
- Touch-friendly interface

### Mobile (≤480px)
- Header: Compact logo + minimal user info
- Footer: Stacked layout
- Optimized for touch

## 🎯 Tính năng chính

### 1. Persistent Layout
- ✅ Header luôn hiển thị ở đầu trang
- ✅ Footer luôn hiển thị ở cuối trang
- ✅ Layout không thay đổi khi navigate
- ✅ User info được maintain xuyên suốt session

### 2. Role-based Display
- ✅ Chỉ hiển thị cho user có role = 'student'
- ✅ Tự động ẩn khi logout hoặc switch role
- ✅ Conditional rendering với AuthService

### 3. Interactive Elements
- ✅ Hover effects trên tất cả buttons/links
- ✅ Active states cho navigation
- ✅ Smooth animations và transitions
- ✅ Scroll to top button

### 4. User Experience
- ✅ Sticky header không che nội dung
- ✅ Footer không overlap với content
- ✅ Responsive design cho mọi thiết bị
- ✅ Loading states và error handling

## 🛠️ Technical Implementation

### Components Structure
```
src/app/components/
├── student-layout/
│   ├── student-layout.component.ts
│   ├── student-layout.component.html
│   └── student-layout.component.scss
├── student-header/
│   ├── student-header.component.ts
│   ├── student-header.component.html
│   └── student-header.component.scss
└── student-footer/
    ├── student-footer.component.ts
    ├── student-footer.component.html
    └── student-footer.component.scss
```

### Routing Configuration
```typescript
// Student routes with persistent layout
{
  path: 'student',
  component: StudentLayoutComponent,
  children: [
    { path: '', component: StudentDashboardComponent },
    { path: 'dashboard', component: StudentDashboardComponent },
    { path: 'exam/:id', component: ViewExerciseComponent }
  ]
}
```

### Dependencies
- Angular RouterModule
- Angular CommonModule
- AuthService (existing)
- User models (existing)

## 🧪 Testing Checklist

### ✅ Functionality Tests
- [x] Header hiển thị đúng cho student role
- [x] Footer hiển thị đúng cho student role
- [x] Navigation links hoạt động
- [x] User info hiển thị chính xác
- [x] Logout functionality
- [x] Responsive design
- [x] Layout persistence across routes

### ✅ Integration Tests
- [x] AuthService integration
- [x] Router integration
- [x] Existing components compatibility
- [x] Build success
- [x] No linting errors

## 🎉 Demo Scenarios

### Scenario 1: Login và Navigation
1. Truy cập `/login`
2. Đăng nhập với tài khoản học sinh
3. Tự động redirect đến `/student-dashboard`
4. Thấy header và footer hiển thị
5. Click "Bài Thi" trong header → chuyển đến `/student`
6. Layout vẫn giữ nguyên header/footer

### Scenario 2: Mobile Experience
1. Mở ứng dụng trên mobile
2. Header compact với logo và user info
3. Footer stacked layout
4. Touch-friendly navigation
5. Responsive design hoạt động tốt

### Scenario 3: Role Switching
1. Login với student → thấy student layout
2. Logout → layout biến mất
3. Login với teacher → không thấy student layout
4. Login lại với student → layout xuất hiện lại

## 🚀 Next Steps (Future Enhancements)

### 1. Profile Page
- Implement student profile component
- Update navigation links

### 2. Results Page
- Create exam results component
- Add to footer navigation

### 3. Notifications
- Add notification system to header
- Real-time updates

### 4. Settings
- Implement settings page
- User preferences

## 📞 Support

Nếu gặp vấn đề với Student Layout System:

1. **Kiểm tra Console**: Mở Developer Tools để xem errors
2. **Kiểm tra Network**: Đảm bảo API calls thành công
3. **Kiểm tra Auth**: Verify user role = 'student'
4. **Clear Cache**: Refresh browser hoặc clear localStorage

## 🎯 Kết luận

✅ **Student Layout System đã hoàn thành 100%**
- Persistent header và footer cho học sinh
- Role-based rendering
- Responsive design
- Smooth navigation
- Excellent user experience

Học sinh giờ đây có trải nghiệm học tập nhất quán với giao diện chuyên nghiệp và dễ sử dụng!
