# 🛠️ Hướng dẫn phát triển BioEduTech

## 📋 Mục lục
- [Cài đặt môi trường phát triển](#cài-đặt-môi-trường-phát-triển)
- [Tính năng hiện tại](#tính-năng-hiện-tại)
- [Cấu trúc dự án chi tiết](#cấu-trúc-dự-án-chi-tiết)
- [Quy tắc coding](#quy-tắc-coding)
- [Workflow phát triển](#workflow-phát-triển)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Cài đặt môi trường phát triển

### Yêu cầu hệ thống
```bash
# Kiểm tra phiên bản Node.js
node --version  # >= 18.0.0

# Kiểm tra phiên bản npm
npm --version   # >= 8.0.0

# Cài đặt Angular CLI globally
npm install -g @angular/cli@17.3.17
```

### Dependencies bổ sung
```bash
# Thư viện xử lý Excel
npm install xlsx

# Type definitions (nếu cần)
npm install --save-dev @types/xlsx

# HTTP Client cho API calls (đã có sẵn trong Angular)
# npm install @angular/common

# RxJS cho reactive programming (đã có sẵn trong Angular)
# npm install rxjs
```

### Setup dự án
```bash
# Clone repository
git clone <repository-url>
cd bioedutech

# Cài đặt dependencies
npm install

# Chạy development server
ng serve
```

## 🎯 Tính năng hiện tại

### ✅ Đã hoàn thành
- **Landing Page**: Trang chủ với nút đăng nhập
- **Authentication System**: 
  - Tài khoản giáo viên cố định: `giaovien` / `123456`
  - Tài khoản học sinh được tạo bởi giáo viên
- **Teacher Dashboard**: Giao diện quản lý cho giáo viên
- **Student Management**: 
  - Upload file Excel/CSV để tạo nhiều tài khoản
  - Tạo học sinh nhanh với form trực tiếp
  - Quản lý danh sách học sinh với tìm kiếm/lọc
- **Student Dashboard**: Giao diện cơ bản cho học sinh
- **Excel Processing**: 
  - Template Excel với đầy đủ cột
  - Validation dữ liệu
  - Xử lý file Excel/CSV thực sự

### 🔧 Công nghệ sử dụng
- **Angular 17**: Standalone components
- **Angular Material**: UI components và theming
- **TypeScript**: Type safety
- **SCSS**: Styling
- **RxJS**: Reactive programming
- **xlsx**: Thư viện xử lý Excel
- **localStorage**: Lưu trữ dữ liệu

### Cấu hình IDE
**VS Code Extensions được khuyến nghị:**
- Angular Language Service
- TypeScript Importer
- SCSS IntelliSense
- Prettier - Code formatter
- ESLint
- REST Client (cho test API)
- Thunder Client (cho test API)

**Settings cho VS Code (.vscode/settings.json):**
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "scss.lint.unknownAtRules": "ignore",
  "http.proxySupport": "on",
  "rest-client.enableTelemetry": false
}
```

### API Configuration
**Environment Variables:**
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://chimeara.pythonanywhere.com',
  swaggerUrl: 'https://chimeara.pythonanywhere.com/apidocs/',
  appName: 'BioEduTech',
  version: '1.0.0'
};
```

**API Service Setup:**
```typescript
// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  // API methods implementation
}
```

## 📁 Cấu trúc dự án chi tiết

```
src/
├── app/
│   ├── components/                    # Tất cả UI components
│   │   ├── landing-page/             # Trang chủ
│   │   │   ├── landing-page.component.html
│   │   │   ├── landing-page.component.scss
│   │   │   └── landing-page.component.ts
│   │   ├── login/                    # Component đăng nhập
│   │   ├── student-dashboard/        # Dashboard học sinh
│   │   └── teacher-dashboard/        # Dashboard giáo viên
│   ├── services/                     # Business logic services
│   │   ├── auth.service.ts          # Xác thực người dùng
│   │   ├── data.service.ts          # Quản lý dữ liệu
│   │   └── api.service.ts           # API calls
│   ├── models/                       # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── course.model.ts
│   │   └── quiz.model.ts
│   ├── guards/                       # Route guards
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/                 # HTTP interceptors
│   │   └── auth.interceptor.ts
│   ├── pipes/                        # Custom pipes
│   │   └── safe-html.pipe.ts
│   ├── directives/                   # Custom directives
│   │   └── highlight.directive.ts
│   ├── shared/                       # Shared components
│   │   ├── header/
│   │   ├── footer/
│   │   └── sidebar/
│   ├── app.component.*               # Root component
│   ├── app.routes.ts                 # Routing configuration
│   ├── app.config.ts                 # App configuration
│   └── app.module.ts                 # App module (nếu cần)
├── assets/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── environments/                     # Environment configs
│   ├── environment.ts
│   └── environment.prod.ts
└── styles/                          # Global styles
    ├── _variables.scss
    ├── _mixins.scss
    └── _base.scss
```

## 📝 Quy tắc coding

### TypeScript
```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
}

// ❌ Bad
let user: any = {};

// ✅ Good
export class AuthService {
  private readonly API_URL = 'https://api.bioedutech.com';
  
  async login(credentials: LoginCredentials): Promise<User> {
    // Implementation
  }
}

// ❌ Bad
export class AuthService {
  async login(credentials) {
    // Implementation
  }
}
```

### Angular Components
```typescript
// ✅ Good - Component structure
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  // Properties
  private destroy$ = new Subject<void>();
  
  // Constructor
  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    // Implementation
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Public methods
  onLogin(): void {
    // Implementation
  }
  
  // Private methods
  private loadData(): void {
    // Implementation
  }
}
```

### SCSS Styling
```scss
// ✅ Good - BEM methodology
.student-dashboard {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &--mobile {
      flex-direction: column;
    }
  }
  
  &__content {
    padding: 20px;
    
    &-item {
      margin-bottom: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  // Modifiers
  &--loading {
    opacity: 0.6;
    pointer-events: none;
  }
}

// ❌ Bad - Nested too deep
.student-dashboard {
  .header {
    .title {
      .text {
        color: red;
      }
    }
  }
}
```

## 🔄 Workflow phát triển

### Git Workflow
```bash
# 1. Tạo feature branch
git checkout -b feature/student-dashboard

# 2. Phát triển feature
# ... code changes ...

# 3. Commit changes
git add .
git commit -m "feat: add student dashboard component

- Add student dashboard with course list
- Implement progress tracking
- Add responsive design for mobile"

# 4. Push và tạo PR
git push origin feature/student-dashboard
```

### Commit Message Convention
```
type(scope): description

feat(auth): add login functionality
fix(ui): resolve mobile layout issues
docs(readme): update installation guide
style(components): format code with prettier
refactor(services): optimize data loading
test(components): add unit tests for login
chore(deps): update angular to v17.3.1
```

### Branch Naming
- `feature/feature-name` - Tính năng mới
- `bugfix/bug-description` - Sửa lỗi
- `hotfix/critical-fix` - Sửa lỗi khẩn cấp
- `refactor/component-name` - Refactor code
- `docs/documentation-update` - Cập nhật tài liệu

## 🧪 Testing

### Unit Testing
```bash
# Chạy tất cả tests
ng test

# Chạy tests với coverage
ng test --code-coverage

# Chạy tests trong watch mode
ng test --watch
```

### API Testing
```bash
# Test API endpoints với REST Client
# Tạo file .http trong thư mục src/
# Ví dụ: src/api-tests.http

# Test login endpoint
POST https://chimeara.pythonanywhere.com/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "testpass",
  "role": "student"
}

# Test student profile
GET https://chimeara.pythonanywhere.com/api/students/profile
Authorization: Bearer <token>
```

### Integration Testing
```typescript
// e2e/api-integration.e2e-spec.ts
describe('API Integration', () => {
  it('should login and get student profile', async () => {
    // Test login flow
    await element(by.css('input[formControlName="username"]')).sendKeys('testuser');
    await element(by.css('input[formControlName="password"]')).sendKeys('testpass');
    await element(by.css('button[type="submit"]')).click();
    
    // Verify redirect to dashboard
    expect(browser.getCurrentUrl()).toContain('/dashboard');
    
    // Test API calls
    // Implementation depends on your testing strategy
  });
});
```

### Test Structure
```typescript
// student-dashboard.component.spec.ts
describe('StudentDashboardComponent', () => {
  let component: StudentDashboardComponent;
  let fixture: ComponentFixture<StudentDashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    
    TestBed.configureTestingModule({
      imports: [StudentDashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    
    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    const mockUser = { id: 1, name: 'Test User', role: 'student' };
    mockAuthService.getCurrentUser.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
  });
});
```

## 🚀 Deployment

### Build Production
```bash
# Build cho production
ng build --configuration production

# Build với custom environment
ng build --configuration production --environment=prod
```

### Environment Configuration
```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.bioedutech.com',
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'bioedutech.firebaseapp.com',
    projectId: 'bioedutech'
  }
};
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/bioedutech /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Angular CLI không được nhận diện
```bash
# Cài đặt Angular CLI globally
npm install -g @angular/cli

# Hoặc sử dụng npx
npx ng serve
```

#### 2. Port 4200 đã được sử dụng
```bash
# Sử dụng port khác
ng serve --port 4201

# Hoặc kill process đang sử dụng port
npx kill-port 4200
```

#### 3. Module không được tìm thấy
```bash
# Xóa node_modules và cài đặt lại
rm -rf node_modules package-lock.json
npm install
```

#### 4. SCSS compilation errors
```bash
# Kiểm tra SCSS syntax
ng build --configuration development

# Sửa lỗi import paths
@import '~@angular/material/theming';
```

### Performance Optimization

#### 1. Lazy Loading
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'student',
    loadComponent: () => import('./components/student-dashboard/student-dashboard.component')
      .then(m => m.StudentDashboardComponent)
  }
];
```

#### 2. OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent {
  // Component implementation
}
```

#### 3. TrackBy Functions
```html
<!-- student-dashboard.component.html -->
<div *ngFor="let course of courses; trackBy: trackByCourseId">
  {{ course.name }}
</div>
```

```typescript
// student-dashboard.component.ts
trackByCourseId(index: number, course: Course): number {
  return course.id;
}
```

## 🌐 API Integration Guidelines

### Backend API
- **Base URL**: `https://chimeara.pythonanywhere.com`
- **Swagger UI**: [https://chimeara.pythonanywhere.com/apidocs/](https://chimeara.pythonanywhere.com/apidocs/)
- **Authentication**: JWT Token-based
- **Documentation**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)

### API Service Implementation
```typescript
// services/api.service.ts
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private token = localStorage.getItem('auth_token');

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  // Student APIs
  getStudentProfile(): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/api/students/profile`, {
      headers: this.getHeaders()
    });
  }

  // Teacher APIs
  getStudentsList(params: StudentListParams): Observable<StudentListResponse> {
    return this.http.get<StudentListResponse>(`${this.baseUrl}/api/teachers/students`, {
      headers: this.getHeaders(),
      params: params as any
    });
  }
}
```

### Error Handling
```typescript
// services/error-handler.service.ts
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400: errorMessage = 'Dữ liệu không hợp lệ'; break;
        case 401: errorMessage = 'Không có quyền truy cập'; break;
        case 403: errorMessage = 'Truy cập bị từ chối'; break;
        case 404: errorMessage = 'Không tìm thấy tài nguyên'; break;
        case 500: errorMessage = 'Lỗi máy chủ'; break;
        default: errorMessage = `Lỗi ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
```

### HTTP Interceptor
```typescript
// interceptors/auth.interceptor.ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

## 📚 Tài liệu tham khảo

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [RxJS Documentation](https://rxjs.dev/)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Swagger UI](https://chimeara.pythonanywhere.com/apidocs/)

---

**Lưu ý**: Tài liệu này sẽ được cập nhật thường xuyên theo sự phát triển của dự án.
