# 🤝 Hướng dẫn đóng góp cho BioEduTech

## 📋 Mục lục
- [Cách đóng góp](#cách-đóng-góp)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

## 🚀 Cách đóng góp

### 1. Fork và Clone Repository
```bash
# Fork repository trên GitHub
# Sau đó clone về máy local
git clone https://github.com/your-username/bioedutech.git
cd bioedutech

# Thêm remote upstream
git remote add upstream https://github.com/original-repo/bioedutech.git
```

### 2. Setup Development Environment
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Chạy tests
npm test
```

### 3. Tạo Feature Branch
```bash
# Tạo branch mới từ main
git checkout -b feature/your-feature-name

# Hoặc cho bugfix
git checkout -b bugfix/issue-description
```

## 🔄 Quy trình phát triển

### 1. Development Workflow
```bash
# 1. Pull latest changes
git checkout main
git pull upstream main

# 2. Tạo feature branch
git checkout -b feature/new-feature

# 3. Phát triển feature
# ... code changes ...

# 4. Commit changes
git add .
git commit -m "feat: add new feature description"

# 5. Push branch
git push origin feature/new-feature

# 6. Tạo Pull Request trên GitHub
```

### 2. Branch Naming Convention
- `feature/feature-name` - Tính năng mới
- `bugfix/issue-description` - Sửa lỗi
- `hotfix/critical-fix` - Sửa lỗi khẩn cấp
- `refactor/component-name` - Refactor code
- `docs/documentation-update` - Cập nhật tài liệu
- `test/add-unit-tests` - Thêm tests

### 3. Commit Message Convention
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

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Tài liệu
- `style`: Formatting, không thay đổi logic
- `refactor`: Refactor code
- `test`: Thêm tests
- `chore`: Cập nhật build tools, dependencies

## 📝 Coding Standards

### 1. TypeScript Guidelines
```typescript
// ✅ Good - Interface naming
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Good - Class naming
export class AuthService {
  private readonly API_URL = 'https://api.bioedutech.com';
  
  async login(credentials: LoginCredentials): Promise<User> {
    // Implementation
  }
}

// ✅ Good - Method naming
async getUserById(id: number): Promise<User> {
  // Implementation
}

// ❌ Bad
async get_user_by_id(id: number): Promise<User> {
  // Implementation
}
```

### 2. Angular Component Guidelines
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
  @Input() studentId: number;
  @Output() studentSelected = new EventEmitter<Student>();
  
  // Private properties
  private destroy$ = new Subject<void>();
  
  // Constructor
  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadStudentData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Public methods
  onStudentSelect(student: Student): void {
    this.studentSelected.emit(student);
  }
  
  // Private methods
  private loadStudentData(): void {
    // Implementation
  }
}
```

### 3. SCSS Guidelines
```scss
// ✅ Good - BEM methodology
.student-dashboard {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    
    &--mobile {
      flex-direction: column;
      padding: 15px;
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

// ✅ Good - Variables
$primary-color: #4CAF50;
$secondary-color: #81C784;
$text-color: #333333;
$border-radius: 8px;

// ✅ Good - Mixins
@mixin button-style($bg-color, $text-color) {
  background-color: $bg-color;
  color: $text-color;
  border: none;
  border-radius: $border-radius;
  padding: 10px 20px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
}
```

### 4. File Naming Convention
```
components/
├── student-dashboard/
│   ├── student-dashboard.component.ts
│   ├── student-dashboard.component.html
│   ├── student-dashboard.component.scss
│   └── student-dashboard.component.spec.ts
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   ├── login.component.scss
│   └── login.component.spec.ts

services/
├── auth.service.ts
├── data.service.ts
└── api.service.ts

models/
├── user.model.ts
├── course.model.ts
└── quiz.model.ts
```

## 🧪 Testing Guidelines

### 1. Unit Testing
```typescript
// student-dashboard.component.spec.ts
describe('StudentDashboardComponent', () => {
  let component: StudentDashboardComponent;
  let fixture: ComponentFixture<StudentDashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getStudentData']);

    await TestBed.configureTestingModule({
      imports: [StudentDashboardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DataService, useValue: dataServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDashboardComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockDataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student data on init', () => {
    const mockStudent = { id: 1, name: 'Test Student', grade: 10 };
    mockDataService.getStudentData.and.returnValue(of(mockStudent));

    component.ngOnInit();

    expect(mockDataService.getStudentData).toHaveBeenCalled();
    expect(component.student).toEqual(mockStudent);
  });

  it('should emit student selected event', () => {
    spyOn(component.studentSelected, 'emit');
    const mockStudent = { id: 1, name: 'Test Student' };

    component.onStudentSelect(mockStudent);

    expect(component.studentSelected.emit).toHaveBeenCalledWith(mockStudent);
  });
});
```

### 2. Service Testing
```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login user successfully', () => {
    const mockCredentials = { email: 'test@example.com', password: 'password' };
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

    service.login(mockCredentials).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
```

### 3. Testing Commands
```bash
# Chạy tất cả tests
npm test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm run test:watch

# Chạy tests cho specific file
npm test -- --include="**/student-dashboard.component.spec.ts"
```

## 🔍 Code Review Process

### 1. Pull Request Checklist
- [ ] Code follows coding standards
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented code
- [ ] Proper error handling
- [ ] Performance considerations
- [ ] Security considerations

### 2. Review Guidelines
**Reviewer should check:**
- Code quality and readability
- Performance implications
- Security vulnerabilities
- Test coverage
- Documentation completeness
- Breaking changes

**Author should:**
- Respond to feedback promptly
- Update code based on suggestions
- Add tests if requested
- Update documentation if needed

### 3. Review Comments
```typescript
// ✅ Good review comment
// Consider using OnPush change detection for better performance
// https://angular.io/guide/change-detection#onpush

// ❌ Bad review comment
// This is wrong
```

## 🚀 Release Process

### 1. Version Numbering
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### 2. Release Steps
```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Update CHANGELOG.md
# 3. Create release branch
git checkout -b release/v1.0.0

# 4. Build and test
npm run build
npm run test

# 5. Merge to main
git checkout main
git merge release/v1.0.0

# 6. Tag release
git tag v1.0.0
git push origin v1.0.0

# 7. Deploy to production
npm run deploy
```

### 3. Changelog Format
```markdown
## [1.0.0] - 2025-01-XX

### Added
- Student dashboard with course management
- Teacher dashboard with class management
- Quiz system with automatic grading
- Responsive design for mobile devices

### Changed
- Updated Angular to version 17.3.0
- Improved login performance by 30%

### Fixed
- Fixed mobile layout issues on iOS
- Resolved memory leak in quiz component

### Security
- Added input validation for all forms
- Implemented CSRF protection
```

## 📚 Resources

### Documentation
- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [RxJS Documentation](https://rxjs.dev/)

### Tools
- [Angular CLI](https://angular.io/cli)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Jasmine](https://jasmine.github.io/)

### Best Practices
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [SCSS Best Practices](https://sass-lang.com/guide)

---

**Cảm ơn bạn đã đóng góp cho BioEduTech! 🎉**

Nếu có bất kỳ câu hỏi nào, vui lòng tạo issue trên GitHub hoặc liên hệ team phát triển.
