# Cấu trúc dự án BioEduTech

## Tổng quan
BioEduTech là ứng dụng Angular đơn giản để quản lý bài tập trắc nghiệm, tập trung vào việc xem và quản lý nội dung bài tập một cách trực quan.

## Cấu trúc thư mục

```
bioedutech/
├── src/
│   ├── app/
│   │   ├── components/                 # Angular Components
│   │   │   ├── exercise-list/          # Danh sách bài tập
│   │   │   │   ├── exercise-list.component.ts
│   │   │   │   ├── exercise-list.component.html
│   │   │   │   └── exercise-list.component.scss
│   │   │   ├── exercise-card/          # Thẻ bài tập đơn lẻ
│   │   │   │   ├── exercise-card.component.ts
│   │   │   │   ├── exercise-card.component.html
│   │   │   │   └── exercise-card.component.scss
│   │   │   ├── view-exercise/          # Xem chi tiết bài tập
│   │   │   │   ├── view-exercise.component.ts
│   │   │   │   ├── view-exercise.component.html
│   │   │   │   └── view-exercise.component.scss
│   │   │   ├── create-exercise/        # Tạo bài tập mới
│   │   │   │   ├── create-exercise.component.ts
│   │   │   │   ├── create-exercise.component.html
│   │   │   │   └── create-exercise.component.scss
│   │   │   ├── login/                  # Đăng nhập
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.scss
│   │   │   ├── teacher-dashboard/      # Dashboard giáo viên
│   │   │   │   ├── teacher-dashboard.component.ts
│   │   │   │   ├── teacher-dashboard.component.html
│   │   │   │   └── teacher-dashboard.component.scss
│   │   │   ├── student-dashboard/      # Dashboard học sinh
│   │   │   │   ├── student-dashboard.component.ts
│   │   │   │   ├── student-dashboard.component.html
│   │   │   │   └── student-dashboard.component.scss
│   │   │   └── layout/                 # Layout chung
│   │   │       ├── layout.component.ts
│   │   │       ├── layout.component.html
│   │   │       └── layout.component.scss
│   │   ├── services/                   # Angular Services
│   │   │   ├── api.service.ts          # API calls và HTTP requests
│   │   │   ├── exercise.service.ts     # Logic xử lý bài tập
│   │   │   ├── auth.service.ts         # Xác thực và phân quyền
│   │   │   └── excel.service.ts        # Xử lý file Excel
│   │   ├── models/                     # TypeScript Interfaces
│   │   │   ├── exercise.model.ts       # Model bài tập và câu hỏi
│   │   │   └── user.model.ts          # Model người dùng
│   │   ├── app.component.ts            # Root component
│   │   ├── app.component.html          # Root template
│   │   ├── app.component.scss          # Root styles
│   │   ├── app.config.ts               # App configuration
│   │   └── app.routes.ts               # Routing configuration
│   ├── assets/                         # Static assets
│   │   └── bioedutech-logo.svg         # Logo ứng dụng
│   ├── styles.scss                     # Global styles
│   ├── index.html                      # Main HTML file
│   └── main.ts                         # Bootstrap file
├── dist/                               # Build output
├── node_modules/                       # Dependencies
├── angular.json                        # Angular CLI configuration
├── package.json                        # Dependencies và scripts
├── package-lock.json                   # Lock file
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.app.json                   # App TypeScript config
├── tsconfig.spec.json                  # Test TypeScript config
└── README.md                           # Project documentation
```

## Chi tiết các thành phần

### Components

#### ExerciseListComponent
- **Mục đích**: Hiển thị danh sách tất cả bài tập
- **Tính năng**: 
  - Load bài tập từ API
  - Tìm kiếm theo tên bài tập
  - Hiển thị thống kê
  - Navigation đến view-exercise
- **Dependencies**: ExerciseService, Router

#### ExerciseCardComponent
- **Mục đích**: Hiển thị thông tin một bài tập
- **Tính năng**:
  - Hiển thị thông tin cơ bản (tên, mô tả, số câu hỏi)
  - Nút "Xem bài thi" duy nhất
- **Dependencies**: Exercise model

#### ViewExerciseComponent
- **Mục đích**: Hiển thị chi tiết bài tập
- **Tính năng**:
  - Load chi tiết bài tập từ API
  - Hiển thị tất cả câu hỏi cùng lúc
  - Hiển thị đáp án đúng
  - Hiển thị hình ảnh qua API
- **Dependencies**: ExerciseService, ApiService

#### CreateExerciseComponent
- **Mục đích**: Tạo bài tập mới
- **Tính năng**:
  - Form tạo bài tập
  - Thêm câu hỏi và đáp án
  - Upload hình ảnh
  - Submit qua API
- **Dependencies**: ApiService, Router

### Services

#### ApiService
- **Mục đích**: Xử lý tất cả API calls
- **Methods**:
  - `getTests()` - Lấy danh sách bài tập
  - `getTestDetail(id)` - Lấy chi tiết bài tập
  - `createTest(data)` - Tạo bài tập mới
  - `uploadImage(file)` - Upload hình ảnh
  - `getImageUrl(filename)` - Tạo URL hình ảnh
- **Dependencies**: HttpClient

#### ExerciseService
- **Mục đích**: Logic xử lý bài tập
- **Methods**:
  - `loadExercisesFromServer()` - Load bài tập từ server
  - `getTestDetailFromServer(id)` - Load chi tiết bài tập
  - `convertTestToExercise()` - Convert API data sang Exercise model
- **Dependencies**: ApiService

### Models

#### Exercise Model
```typescript
interface Exercise {
  id: string;
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number;
  maxScore: number;
  questions: Question[];
  createdAt: Date;
  totalQuestions?: number;
  // ... other fields
}
```

#### Question Model
```typescript
interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  options: Option[];
  type: 'single' | 'multiple';
  explanation?: string;
  order: number;
}
```

## Routing

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/exercise-list', pathMatch: 'full' },
  { path: 'exercise-list', component: ExerciseListComponent },
  { path: 'view-exercise/:id', component: ViewExerciseComponent },
  { path: 'create-exercise', component: CreateExerciseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent }
];
```

## API Integration

### Endpoints
- `GET /exams` - Lấy danh sách bài tập
- `GET /exams/{id}` - Lấy chi tiết bài tập
- `POST /exams` - Tạo bài tập mới
- `POST /images` - Upload hình ảnh
- `GET /images/{filename}` - Lấy hình ảnh

### Data Flow
1. **Exercise List**: ApiService → ExerciseService → ExerciseListComponent
2. **Exercise Detail**: ApiService → ExerciseService → ViewExerciseComponent
3. **Image Display**: ApiService.getImageUrl() → ViewExerciseComponent

## Styling

### SCSS Structure
- **Global styles**: `src/styles.scss`
- **Component styles**: Mỗi component có file `.scss` riêng
- **Responsive design**: Mobile-first approach
- **CSS Variables**: Sử dụng CSS custom properties

### Design System
- **Colors**: Primary (#3498db), Success (#27ae60), Warning (#f39c12)
- **Typography**: System fonts với fallbacks
- **Spacing**: Consistent spacing scale
- **Components**: Card-based design

## Build và Deployment

### Development
```bash
ng serve
```

### Production Build
```bash
ng build --configuration production
```

### Build Output
- `dist/bioedutech/browser/` - Static files
- `dist/bioedutech/server/` - SSR files (nếu có)

## Testing

### Unit Tests
- Component tests với Angular Testing Utilities
- Service tests với HttpClientTestingModule
- Model tests với Jest

### E2E Tests
- Cypress cho end-to-end testing
- Test scenarios cho user flows

## Performance

### Optimization
- **Lazy Loading**: Routes được lazy load
- **OnPush Strategy**: Sử dụng ChangeDetectionStrategy.OnPush
- **TrackBy Functions**: Optimize *ngFor loops
- **Image Optimization**: Lazy loading cho hình ảnh

### Bundle Analysis
- `ng build --stats-json` để analyze bundle size
- Webpack Bundle Analyzer để visualize

## Security

### Best Practices
- **XSS Protection**: Angular's built-in sanitization
- **CSRF Protection**: HttpClient với CSRF tokens
- **Input Validation**: Form validation và sanitization
- **API Security**: Secure headers và authentication

## Monitoring và Logging

### Error Handling
- Global error handler
- HTTP interceptor cho error handling
- Console logging cho development

### Performance Monitoring
- Angular DevTools
- Lighthouse audits
- Bundle size monitoring

---

**Lưu ý**: Cấu trúc này được thiết kế để đơn giản và dễ maintain, tập trung vào việc quản lý bài tập một cách hiệu quả.