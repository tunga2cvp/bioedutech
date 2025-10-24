# 📁 Cấu trúc dự án BioEduTech

## 🎯 Tổng quan
Dự án BioEduTech được tổ chức theo cấu trúc Angular chuẩn với các thư mục và file được phân loại rõ ràng để dễ dàng phát triển và bảo trì.

## 📂 Cấu trúc thư mục

```
bioedutech/
├── 📁 src/                           # Source code chính
│   ├── 📁 app/                       # Angular application
│   │   ├── 📁 components/            # UI Components
│   │   │   ├── 📁 landing-page/      # Trang chủ landing page
│   │   │   │   ├── landing-page.component.html
│   │   │   │   ├── landing-page.component.scss
│   │   │   │   └── landing-page.component.ts
│   │   │   ├── 📁 login/             # Component đăng nhập
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   └── login.component.ts
│   │   │   ├── 📁 student-dashboard/ # Dashboard học sinh
│   │   │   │   ├── student-dashboard.component.html
│   │   │   │   ├── student-dashboard.component.scss
│   │   │   │   └── student-dashboard.component.ts
│   │   │   ├── 📁 teacher-dashboard/ # Dashboard giáo viên
│   │   │   │   ├── teacher-dashboard.component.html
│   │   │   │   ├── teacher-dashboard.component.scss
│   │   │   │   └── teacher-dashboard.component.ts
│   │   │   └── 📁 student-management/ # Quản lý học sinh
│   │   │       ├── student-management.component.html
│   │   │       ├── student-management.component.scss
│   │   │       └── student-management.component.ts
│   │   ├── 📁 services/              # Business logic services
│   │   │   ├── auth.service.ts       # Xác thực người dùng
│   │   │   ├── excel.service.ts      # Xử lý file Excel/CSV
│   │   │   └── auth.service.spec.ts  # Tests cho auth service
│   │   ├── 📁 models/                # TypeScript interfaces
│   │   │   └── user.model.ts         # User, Student, Teacher interfaces
│   │   ├── 📁 guards/                # Route guards (sẽ tạo)
│   │   ├── 📁 interceptors/          # HTTP interceptors (sẽ tạo)
│   │   ├── 📁 pipes/                 # Custom pipes (sẽ tạo)
│   │   ├── 📁 directives/            # Custom directives (sẽ tạo)
│   │   ├── 📁 shared/                # Shared components (sẽ tạo)
│   │   ├── app.component.*           # Root component
│   │   ├── app.routes.ts             # Routing configuration
│   │   ├── app.config.ts             # App configuration
│   │   └── app.module.ts             # App module (nếu cần)
│   ├── 📁 assets/                    # Static assets
│   │   ├── 📁 images/                # Hình ảnh
│   │   ├── 📁 icons/                 # Icons
│   │   └── 📁 fonts/                 # Fonts
│   ├── 📁 environments/              # Environment configs (sẽ tạo)
│   ├── 📁 styles/                    # Global styles (sẽ tạo)
│   ├── favicon.ico                   # Website icon
│   ├── index.html                    # Main HTML file
│   ├── main.ts                       # Application entry point
│   └── styles.scss                   # Global styles
├── 📁 dist/                          # Build output
├── 📁 node_modules/                  # Dependencies
├── 📄 angular.json                   # Angular configuration
├── 📄 package.json                   # Project dependencies & scripts
├── 📄 package-lock.json              # Locked dependencies
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 tsconfig.app.json              # TypeScript app config
├── 📄 tsconfig.spec.json             # TypeScript test config
├── 📄 README.md                      # Project documentation
├── 📄 DEVELOPMENT.md                 # Development guide
├── 📄 USECASES.md                    # Use cases documentation
├── 📄 CONTRIBUTING.md                # Contribution guide
├── 📄 CHANGELOG.md                   # Version history
└── 📄 PROJECT_STRUCTURE.md           # This file
```

## 🏗️ Kiến trúc ứng dụng

### 1. **Components Layer** (Presentation)
- **Landing Page**: Trang chủ với thông tin tổng quan
- **Login**: Xác thực người dùng
- **Student Dashboard**: Giao diện cho học sinh
- **Teacher Dashboard**: Giao diện cho giáo viên

### 2. **Services Layer** (Business Logic)
- **AuthService**: Quản lý xác thực và phân quyền
- **DataService**: Quản lý dữ liệu ứng dụng
- **ApiService**: Gọi API và xử lý HTTP requests

### 3. **Models Layer** (Data Structure)
- **User**: Thông tin người dùng
- **Course**: Thông tin khóa học
- **Quiz**: Thông tin bài thi
- **Assignment**: Thông tin bài tập

### 4. **Guards Layer** (Security)
- **AuthGuard**: Bảo vệ routes yêu cầu đăng nhập
- **RoleGuard**: Phân quyền theo vai trò

### 5. **Interceptors Layer** (Cross-cutting Concerns)
- **AuthInterceptor**: Thêm token vào requests
- **ErrorInterceptor**: Xử lý lỗi global

## 🎨 Design System

### Color Palette
```scss
// Primary Colors
$primary-green: #4CAF50;      // Xanh lá cây chính
$accent-green: #81C784;       // Xanh lá cây phụ
$light-green: #C8E6C9;        // Xanh lá cây nhạt

// Neutral Colors
$white: #FFFFFF;              // Trắng
$light-gray: #F5F5F5;         // Xám nhạt
$medium-gray: #9E9E9E;        // Xám vừa
$dark-gray: #333333;          // Xám đậm
$black: #000000;              // Đen

// Status Colors
$success: #4CAF50;            // Thành công
$warning: #FF9800;            // Cảnh báo
$error: #F44336;              // Lỗi
$info: #2196F3;               // Thông tin
```

### Typography
```scss
// Font Family
$font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

// Font Sizes
$font-size-xs: 12px;          // Extra small
$font-size-sm: 14px;          // Small
$font-size-md: 16px;          // Medium
$font-size-lg: 18px;          // Large
$font-size-xl: 24px;          // Extra large
$font-size-xxl: 32px;         // 2x Extra large

// Font Weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Spacing System
```scss
// Spacing Scale (8px base)
$spacing-xs: 4px;             // 0.5x
$spacing-sm: 8px;             // 1x
$spacing-md: 16px;            // 2x
$spacing-lg: 24px;            // 3x
$spacing-xl: 32px;            // 4x
$spacing-xxl: 48px;           // 6x
$spacing-xxxl: 64px;          // 8x
```

### Border Radius
```scss
$border-radius-sm: 4px;       // Small
$border-radius-md: 8px;       // Medium
$border-radius-lg: 12px;      // Large
$border-radius-xl: 16px;      // Extra large
$border-radius-full: 50%;     // Circle
```

## 🔧 Configuration Files

### 1. **angular.json**
- Cấu hình Angular CLI
- Build và serve configurations
- Asset paths và optimization settings

### 2. **package.json**
- Dependencies và devDependencies
- Scripts cho development, build, test
- Project metadata

### 3. **tsconfig.json**
- TypeScript compiler options
- Module resolution
- Target và lib settings

### 4. **styles.scss**
- Global styles
- Angular Material theming
- CSS variables và mixins

## 📱 Responsive Breakpoints

```scss
// Mobile First Approach
$breakpoint-xs: 480px;        // Extra small devices
$breakpoint-sm: 768px;        // Small devices (tablets)
$breakpoint-md: 992px;        // Medium devices (desktops)
$breakpoint-lg: 1200px;       // Large devices
$breakpoint-xl: 1400px;       // Extra large devices

// Usage
@media (min-width: $breakpoint-sm) {
  // Tablet styles
}

@media (min-width: $breakpoint-md) {
  // Desktop styles
}
```

## 🧪 Testing Structure

```
src/
├── app/
│   ├── components/
│   │   └── component-name/
│   │       ├── component-name.component.ts
│   │       ├── component-name.component.html
│   │       ├── component-name.component.scss
│   │       └── component-name.component.spec.ts
│   └── services/
│       ├── service-name.service.ts
│       └── service-name.service.spec.ts
└── test/
    ├── setup.ts
    └── helpers/
        ├── test-helpers.ts
        └── mock-data.ts
```

## 🚀 Build Output

```
dist/
└── bioedutech/
    ├── 📁 browser/                   # Browser build
    │   ├── index.html                # Main HTML
    │   ├── main-*.js                 # Main bundle
    │   ├── polyfills-*.js            # Polyfills
    │   ├── styles-*.css              # Styles
    │   └── assets/                   # Static assets
    ├── 📁 server/                    # Server-side rendering
    └── 📄 stats.json                 # Build statistics
```

## 📋 Naming Conventions

### Files
- **Components**: `kebab-case.component.ts`
- **Services**: `kebab-case.service.ts`
- **Models**: `kebab-case.model.ts`
- **Guards**: `kebab-case.guard.ts`
- **Pipes**: `kebab-case.pipe.ts`
- **Directives**: `kebab-case.directive.ts`

### Classes
- **Components**: `PascalCaseComponent`
- **Services**: `PascalCaseService`
- **Models**: `PascalCaseModel`
- **Guards**: `PascalCaseGuard`

### Variables & Methods
- **camelCase**: `userName`, `getUserById()`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private**: `_privateProperty`

### CSS Classes
- **BEM Methodology**: `.block__element--modifier`
- **Example**: `.student-dashboard__header--mobile`

## 🔄 Development Workflow

1. **Feature Development**
   - Tạo feature branch
   - Phát triển component/service
   - Viết tests
   - Code review
   - Merge to main

2. **Testing**
   - Unit tests cho mỗi component
   - Integration tests cho services
   - E2E tests cho user flows

3. **Build & Deploy**
   - Build production
   - Test trên staging
   - Deploy to production
   - Monitor và feedback

---

**Lưu ý**: Cấu trúc này sẽ được cập nhật và mở rộng theo sự phát triển của dự án.
