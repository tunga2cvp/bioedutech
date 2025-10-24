# 🌿 BioEduTech - Nền tảng học tập Sinh học THPT

<div align="center">
  <img src="https://img.shields.io/badge/Angular-17.3.0-red?style=for-the-badge&logo=angular" alt="Angular Version">
  <img src="https://img.shields.io/badge/TypeScript-5.4.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript Version">
  <img src="https://img.shields.io/badge/SCSS-Styling-pink?style=for-the-badge&logo=sass" alt="SCSS Styling">
  <img src="https://img.shields.io/badge/Material%20Design-UI-green?style=for-the-badge&logo=material-design" alt="Material Design">
</div>

## 📋 Mô tả dự án

**BioEduTech** là một nền tảng học tập trực tuyến chuyên biệt cho môn Sinh học cấp THPT. Dự án được thiết kế để hỗ trợ học sinh trong việc ôn luyện, tiếp cận tài liệu học tập và thực hành trắc nghiệm một cách hiệu quả.

### 🎯 Mục tiêu chính
- Cung cấp tài liệu học tập chất lượng cao cho học sinh THPT
- Tạo môi trường học tập tương tác và thân thiện
- Hỗ trợ giáo viên trong việc quản lý lớp học và theo dõi tiến độ học sinh
- Xây dựng hệ thống trắc nghiệm tự động và đánh giá kết quả

## 🚀 Tính năng chính

### 👨‍🎓 Dành cho Học sinh
- **Trang chủ thân thiện**: Giao diện landing page hiện đại với thông tin tổng quan
- **Tài liệu học tập**: Bài giảng, tóm tắt, đề kiểm tra được phân loại theo chương
- **Bài tập thực hành**: Hệ thống bài tập được phân theo lớp (10-12) và chương học
- **Trắc nghiệm tự động**: Câu hỏi trắc nghiệm với chấm điểm tự động
- **Dashboard cá nhân**: Theo dõi tiến độ học tập và kết quả

### 👩‍🏫 Dành cho Giáo viên
- **Quản lý học sinh**: Tạo tài khoản học sinh bằng upload file Excel/CSV hoặc tạo trực tiếp
- **Tài khoản cố định**: Username `giaovien`, Password `123456`
- **Upload Excel/CSV**: Tạo nhiều tài khoản học sinh cùng lúc với template có sẵn
- **API Integration**: Đăng ký hàng loạt học sinh thông qua Backend API `/register_excel` (upload file Excel trực tiếp)
- **Tạo học sinh nhanh**: Form tạo tài khoản học sinh trực tiếp với đầy đủ thông tin
- **Dashboard giáo viên**: Giao diện quản lý tổng quan với tab navigation
- **Đồng bộ dữ liệu**: Dữ liệu học sinh được lưu trữ và đồng bộ giữa frontend và backend

### 🔐 Hệ thống xác thực
- **Tài khoản giáo viên cố định**: Username `giaovien`, Password `123456` (không gọi API)
- **Tài khoản học sinh**: Gọi API backend để xác thực với username và password
- **Phân quyền rõ ràng**: Giáo viên quản lý, học sinh sử dụng
- **Lưu trữ local**: Dữ liệu được lưu trong localStorage
- **API Integration**: Học sinh đăng nhập qua Backend API

## 🛠️ Công nghệ sử dụng

### Frontend
- **Angular 17.3.0**: Framework chính cho ứng dụng web
- **TypeScript 5.4.2**: Ngôn ngữ lập trình type-safe
- **Angular Material 17.3.10**: UI components và theming
- **SCSS**: Preprocessor CSS cho styling nâng cao
- **RxJS 7.8.0**: Reactive programming cho state management

### Backend API
- **RESTful API**: Backend API được cung cấp qua Swagger
- **No Authentication Required**: API hiện tại không yêu cầu token authentication
- **Base URL**: `https://chimeara.pythonanywhere.com`
- **Swagger Documentation**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)

### Development Tools
- **Angular CLI 17.3.17**: Command line interface
- **Karma + Jasmine**: Testing framework
- **Webpack**: Module bundler (tích hợp sẵn trong Angular)

## 📁 Cấu trúc dự án

```
bioedutech/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── landing-page/          # Trang chủ landing page
│   │   │   ├── login/                 # Component đăng nhập
│   │   │   ├── student-dashboard/     # Dashboard học sinh
│   │   │   ├── teacher-dashboard/     # Dashboard giáo viên
│   │   │   └── student-management/    # Quản lý học sinh (Upload Excel + Quick Add)
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Service xác thực
│   │   │   └── excel.service.ts       # Service xử lý file Excel/CSV
│   │   ├── models/
│   │   │   └── user.model.ts          # Interface cho User, Student, Teacher
│   │   ├── app.component.*            # Root component
│   │   ├── app.routes.ts              # Routing configuration
│   │   └── app.config.ts              # App configuration
│   ├── assets/                        # Static assets
│   ├── styles.scss                    # Global styles
│   └── index.html                     # Main HTML file
├── dist/                              # Build output
├── node_modules/                      # Dependencies
├── angular.json                       # Angular configuration
├── package.json                       # Project dependencies
└── README.md                          # Project documentation
```

## 📖 Hướng dẫn sử dụng

### 👩‍🏫 Cho Giáo viên

#### Đăng nhập
- **Username**: `giaovien`
- **Password**: `123456`

#### Quản lý học sinh
1. **Upload file Excel/CSV** (Tab mặc định):
   - Click "Tải template Excel" để tải file mẫu
   - Điền thông tin học sinh vào file Excel
   - Upload file để tạo nhiều tài khoản cùng lúc
   - File phải có các cột: `name`, `username`, `email`, `password`, `grade`, `class`, `school`, `studentId`

2. **Tạo học sinh nhanh**:
   - Chuyển sang tab "Thêm học sinh nhanh"
   - Điền đầy đủ thông tin học sinh
   - Click "Thêm học sinh" để tạo tài khoản

#### Template Excel
```
| name | username | email | password | grade | class | school | studentId |
|------|----------|-------|----------|-------|-------|--------|-----------|
| Nguyễn Văn An | an.nguyen | an.nguyen@student.edu.vn | 123456 | 12 | 12A1 | Trường THPT Mẫu | S001 |
```

### 👨‍🎓 Cho Học sinh
- Đăng nhập bằng username và password được giáo viên cung cấp
- Truy cập Student Dashboard để xem thông tin cá nhân

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 hoặc **yarn**: >= 1.22.0
- **Angular CLI**: >= 17.0.0

### Cài đặt dependencies
```bash
# Clone repository
git clone <repository-url>
cd bioedutech

# Cài đặt dependencies
npm install
# hoặc
yarn install
```

### Chạy ứng dụng
```bash
# Development server
npm start
# hoặc
ng serve

# Mở trình duyệt tại http://localhost:4200
```

### Build cho production
```bash
# Build production
npm run build
# hoặc
ng build --configuration production

# Build files sẽ được tạo trong thư mục dist/
```

### Chạy tests
```bash
# Unit tests
npm test
# hoặc
ng test

# E2E tests (khi có)
ng e2e
```

## 🎨 Giao diện và Design System

### Màu sắc chủ đạo
- **Primary**: #4CAF50 (Xanh lá cây)
- **Accent**: #81C784 (Xanh lá cây nhạt)
- **Background**: #FFFFFF (Trắng)
- **Text**: #333333 (Xám đậm)
- **Secondary Text**: #666666 (Xám)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Font-weight 600-700
- **Body**: Font-weight 400, line-height 1.6

### Responsive Design
- **Desktop**: >= 1200px
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔧 Cấu hình và Customization

### Thay đổi theme màu sắc
Chỉnh sửa file `src/styles.scss`:
```scss
$bioedutech-primary: mat.define-palette(mat.$green-palette, 600, 400, 800);
$bioedutech-accent: mat.define-palette(mat.$light-green-palette, A200, A100, A400);
```

### Thêm component mới
```bash
# Tạo component mới
ng generate component components/component-name

# Tạo service mới
ng generate service services/service-name
```

### Cấu hình routing
Chỉnh sửa file `src/app/app.routes.ts` để thêm routes mới.

## 📊 Use Cases cụ thể

### 1. Học sinh sử dụng hệ thống
```typescript
// Use case: Học sinh đăng nhập và truy cập tài liệu
1. Truy cập trang chủ
2. Click "Đăng nhập" 
3. Nhập thông tin tài khoản học sinh
4. Được chuyển đến Student Dashboard
5. Chọn môn học và chương cần học
6. Xem tài liệu, làm bài tập, thi trắc nghiệm
7. Xem kết quả và tiến độ học tập
```

### 2. Giáo viên quản lý lớp học
```typescript
// Use case: Giáo viên tạo bài tập mới
1. Đăng nhập với tài khoản giáo viên
2. Truy cập Teacher Dashboard
3. Chọn "Tạo bài tập mới"
4. Nhập thông tin bài tập (tiêu đề, nội dung, đáp án)
5. Phân loại theo lớp và chương
6. Lưu và xuất bản bài tập
7. Theo dõi kết quả làm bài của học sinh
```

### 3. Hệ thống trắc nghiệm tự động
```typescript
// Use case: Học sinh làm bài trắc nghiệm
1. Chọn "Trắc nghiệm" từ menu
2. Chọn chủ đề và độ khó
3. Hệ thống hiển thị câu hỏi ngẫu nhiên
4. Học sinh trả lời và submit
5. Hệ thống tự động chấm điểm
6. Hiển thị kết quả và giải thích đáp án
7. Lưu kết quả vào lịch sử học tập
```

## 🌐 API Integration

### Backend API
Dự án sử dụng backend API được cung cấp qua Swagger documentation:

- **API Base URL**: `https://chimeara.pythonanywhere.com`
- **Swagger UI**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)
- **Authentication**: No authentication required
- **Documentation**: Chi tiết trong [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

### API Features
- **Login Endpoint**: `/login` - Xác thực người dùng
- **Tests Endpoint**: `/tests` - Nộp bài thi và nhận kết quả chấm điểm
- **Register Excel Endpoint**: `/register_excel` - Upload file Excel (.xlsx/.xlsm) với 3 cột: name, username, password
- **Swagger UI**: Giao diện tương tác để test API
- **No Authentication**: API hiện tại không yêu cầu token

### Integration Status
- ✅ API Service setup hoàn tất
- ✅ Login endpoint tích hợp cho học sinh
- ✅ Teacher login (fix cứng, không gọi API)
- ✅ Student login (gọi API backend)
- ✅ Tests endpoint tích hợp (nộp bài thi)
- ✅ Register Excel endpoint tích hợp (đăng ký hàng loạt học sinh)
- ✅ Error handling và validation
- ✅ TypeScript interfaces cho API models
- ✅ Test submission và scoring system
- ✅ Bulk student registration với API backend
- ✅ Excel/CSV parsing và validation
- ⚠️ Các endpoints chi tiết sẽ được thêm vào theo Swagger documentation

## 🔄 Roadmap và phát triển tương lai

### Phase 1 (Hiện tại) ✅
- [x] Thiết kế và phát triển landing page
- [x] Cấu trúc dự án Angular cơ bản
- [x] Setup routing và navigation
- [x] Responsive design
- [x] Tích hợp Backend API
- [x] JWT Authentication system

### Phase 2 (Sắp tới) 🚧
- [ ] Hoàn thiện hệ thống đăng nhập/đăng ký
- [ ] Phát triển Student Dashboard với API
- [ ] Phát triển Teacher Dashboard với API
- [ ] Real-time notifications
- [ ] File upload optimization

### Phase 3 (Tương lai) 📋
- [ ] Hệ thống upload và quản lý tài liệu
- [ ] Module trắc nghiệm với AI
- [ ] Chat system cho hỏi đáp
- [ ] Mobile app (React Native/Flutter)
- [ ] Analytics và báo cáo chi tiết
- [ ] Offline mode support

## 🤝 Đóng góp cho dự án

### Cách đóng góp
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Coding Standards
- Sử dụng TypeScript strict mode
- Tuân thủ Angular Style Guide
- Viết unit tests cho components mới
- Sử dụng SCSS cho styling
- Comment code bằng tiếng Việt

## 📞 Liên hệ và hỗ trợ

- **Email**: support@bioedutech.com
- **GitHub Issues**: [Tạo issue mới](https://github.com/your-repo/bioedutech/issues)
- **API Documentation**: [Swagger UI](https://chimeara.pythonanywhere.com/apidocs/)
- **Integration Guide**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
- **Documentation**: [Wiki](https://github.com/your-repo/bioedutech/wiki)

## 📄 License

Dự án này được phát hành dưới [MIT License](LICENSE).

---

<div align="center">
  <p>Được phát triển với ❤️ bởi team BioEduTech</p>
  <p>© 2025 BioEduTech - Nền tảng học tập Sinh học THPT</p>
</div>