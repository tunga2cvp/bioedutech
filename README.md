# BioEduTech - Hệ thống quản lý bài tập trắc nghiệm

## Tổng quan

BioEduTech là một ứng dụng web Angular được thiết kế để quản lý và thực hiện các bài tập trắc nghiệm cho giáo viên và học sinh. Ứng dụng cung cấp giao diện đơn giản và trực quan để tạo, quản lý và xem các bài tập trắc nghiệm.

## Tính năng chính

### 🎯 Quản lý bài tập (Giáo viên)
- **Xem danh sách bài tập**: Hiển thị tất cả bài tập đã tạo với thông tin cơ bản
- **Tạo bài tập mới**: Tạo bài tập trắc nghiệm với nhiều câu hỏi
- **Xem chi tiết bài tập**: Xem toàn bộ nội dung bài tập bao gồm câu hỏi và đáp án đúng
- **Tìm kiếm bài tập**: Tìm kiếm bài tập theo tên

### 📊 Thống kê
- Tổng số bài tập
- Số bài tập đã xuất bản
- Tổng số câu hỏi
- Số câu hỏi trung bình mỗi bài tập

### 🖼️ Quản lý hình ảnh
- Upload hình ảnh cho câu hỏi
- Hiển thị hình ảnh thông qua API GET `/images/{filename}`

## Cấu trúc dự án

```
src/
├── app/
│   ├── components/
│   │   ├── exercise-list/          # Danh sách bài tập
│   │   ├── exercise-card/          # Thẻ bài tập đơn lẻ
│   │   ├── view-exercise/          # Xem chi tiết bài tập
│   │   ├── create-exercise/        # Tạo bài tập mới
│   │   ├── login/                  # Đăng nhập
│   │   ├── teacher-dashboard/      # Dashboard giáo viên
│   │   ├── student-dashboard/      # Dashboard học sinh
│   │   └── layout/                 # Layout chung
│   ├── services/
│   │   ├── api.service.ts          # API calls
│   │   ├── exercise.service.ts     # Logic bài tập
│   │   ├── auth.service.ts         # Xác thực
│   │   └── excel.service.ts       # Xử lý Excel
│   ├── models/
│   │   ├── exercise.model.ts       # Model bài tập
│   │   └── user.model.ts          # Model người dùng
│   └── app.routes.ts              # Định tuyến
```

## API Endpoints

### Bài tập
- `GET /exams` - Lấy danh sách bài tập
- `GET /exams/{id}` - Lấy chi tiết bài tập
- `POST /exams` - Tạo bài tập mới

### Hình ảnh
- `POST /images` - Upload hình ảnh
- `GET /images/{filename}` - Lấy hình ảnh

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- Angular CLI 17+
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd bioedutech

# Cài đặt dependencies
npm install

# Chạy ứng dụng
ng serve
```

### Truy cập ứng dụng
- **Development**: http://localhost:4200
- **Exercise List**: http://localhost:4200/exercise-list
- **Create Exercise**: http://localhost:4200/create-exercise

## Cấu hình

### API Base URL
Cập nhật `baseUrl` trong `src/app/services/api.service.ts`:
```typescript
private baseUrl = 'http://your-api-server.com/api';
```

### Environment Variables
Tạo file `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://your-api-server.com/api'
};
```

## Sử dụng

### Giáo viên

#### Xem danh sách bài tập
1. Truy cập `/exercise-list`
2. Xem thống kê tổng quan
3. Tìm kiếm bài tập theo tên
4. Click "📖 Xem bài thi" để xem chi tiết

#### Tạo bài tập mới
1. Click "Tạo Bài Tập Mới"
2. Nhập thông tin bài tập
3. Thêm câu hỏi và đáp án
4. Upload hình ảnh (tùy chọn)
5. Lưu bài tập

#### Xem chi tiết bài tập
1. Click "📖 Xem bài thi" trên thẻ bài tập
2. Xem toàn bộ nội dung bài tập
3. Xem câu hỏi và đáp án đúng
4. Xem hình ảnh minh họa (nếu có)

## Công nghệ sử dụng

- **Frontend**: Angular 17, TypeScript, SCSS
- **UI Components**: Standalone Components
- **State Management**: RxJS Observables
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms

## Tính năng đã hoàn thành

✅ **Quản lý bài tập**
- Xem danh sách bài tập từ API
- Tạo bài tập mới
- Xem chi tiết bài tập

✅ **Giao diện người dùng**
- Layout responsive
- Exercise cards đơn giản
- View exercise với layout đẹp

✅ **API Integration**
- Kết nối với backend API
- Xử lý hình ảnh qua API
- Error handling

✅ **Tối ưu hóa**
- Loại bỏ các tính năng không cần thiết
- Code clean và maintainable
- Performance optimization

## Roadmap

### Tính năng sắp tới
- [ ] Chỉnh sửa bài tập
- [ ] Xóa bài tập
- [ ] Sao chép bài tập
- [ ] Phân quyền người dùng
- [ ] Dashboard học sinh
- [ ] Làm bài tập trực tuyến

### Cải tiến
- [ ] Caching API responses
- [ ] Offline support
- [ ] Progressive Web App (PWA)
- [ ] Unit tests
- [ ] E2E tests

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Liên hệ

- **Project Link**: [https://github.com/your-username/bioedutech](https://github.com/your-username/bioedutech)
- **Email**: your-email@example.com

---

**Lưu ý**: Đây là phiên bản đơn giản hóa của ứng dụng, tập trung vào việc xem và quản lý bài tập một cách trực quan và dễ sử dụng.