# 🚀 Hướng Dẫn Quy Trình Xây Dựng Ứng Dụng BioEduTech

## 📋 Mục lục
- [Tổng quan dự án](#tổng-quan-dự-án)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Bước 1: Xây dựng Use Cases](#bước-1-xây-dựng-use-cases)
- [Bước 2: Phát triển với Cursor](#bước-2-phát-triển-với-cursor)
- [Bước 3: Deploy trên Hostinger](#bước-3-deploy-trên-hostinger)
- [Checklist phát triển](#checklist-phát-triển)
- [Tài nguyên hỗ trợ](#tài-nguyên-hỗ-trợ)

---

## 🎯 Tổng quan dự án

### Về BioEduTech
BioEduTech là một hệ thống quản lý và học tập trực tuyến cho Sinh học, được thiết kế để phục vụ giáo viên và học sinh THPT (lớp 10-12).

**Đối tượng sử dụng:**
- 👨‍🎓 **Học sinh**: Làm bài thi, xem tài liệu, theo dõi tiến độ
- 👩‍🏫 **Giáo viên**: Tạo bài thi, quản lý học sinh, xem báo cáo
- 🏢 **Quản trị viên**: Quản lý hệ thống

### Công nghệ sử dụng
- **Frontend**: Angular 17, TypeScript, SCSS, Angular Material
- **AI**: OpenAI GPT-4o-mini (Chatbot)
- **Backend**: Python (FastAPI/Django) - API tại chimeara.pythonanywhere.com
- **Hosting**: Hostinger (VPS/shared hosting)
- **Domain**: Hostinger Domain Service

### Cấu trúc dự án
```
bioedutech/
├── src/app/
│   ├── components/          # Angular Components
│   │   ├── landing-page/   # Trang chủ
│   │   ├── login/          # Đăng nhập
│   │   ├── teacher-*/      # Features cho giáo viên
│   │   ├── student-*/      # Features cho học sinh
│   │   └── chatbot/        # AI Chatbot
│   ├── services/           # Services & API
│   ├── models/             # TypeScript Models
│   └── config/            # Configuration
├── assets/                 # Static assets
└── dist/                   # Build output
```

---

## 🔄 Quy trình phát triển

### Phương pháp tiếp cận
Chúng ta sẽ đi theo quy trình **Use Case Driven Development** với các bước:

```
1. 📝 Xác định Use Cases đầy đủ
   ↓
2. 🛠️ Phát triển với Cursor AI
   ↓
3. 🧪 Testing & QA
   ↓
4. 🚀 Deploy lên Hostinger
   ↓
5. 📊 Monitoring & Maintenance
```

### Timeline ước tính
- **Phase 1** (Use Case): 1-2 tuần
- **Phase 2** (Development): 4-6 tuần
- **Phase 3** (Testing): 1-2 tuần
- **Phase 4** (Deployment): 1 tuần
- **Total**: 7-11 tuần

---

## 📝 Bước 1: Xây dựng Use Cases

### Mục đích
Xây dựng tài liệu Use Case đầy đủ để làm nền tảng cho toàn bộ quá trình phát triển.

### Use Cases hiện có
Tài liệu `USECASES.md` đã có 20 use cases bao gồm:

#### Use Cases cho Học sinh (UC-001 → UC-006)
- UC-001: Đăng nhập tài khoản học sinh
- UC-002: Đăng nhập hệ thống
- UC-003: Xem tài liệu học tập
- UC-004: Làm bài tập thực hành
- UC-005: Thi trắc nghiệm
- UC-006: Theo dõi tiến độ học tập

#### Use Cases cho Giáo viên (UC-007 → UC-012)
- UC-007: Đăng nhập tài khoản giáo viên
- UC-008: Quản lý học sinh
- UC-008A: Đăng ký hàng loạt học sinh qua API
- UC-009: Xem danh sách học sinh
- UC-010: Tạo bài tập trắc nghiệm
- UC-011: Chấm bài và đánh giá
- UC-012: Theo dõi tiến độ lớp học

#### Use Cases cho Quản trị viên (UC-013 → UC-014)
- UC-013: Quản lý người dùng
- UC-014: Quản lý nội dung hệ thống

#### Use Cases kỹ thuật (UC-015 → UC-016)
- UC-015: Backup và restore dữ liệu
- UC-016: Monitoring và logging

#### API Use Cases (UC-017 → UC-020)
- UC-017: RESTful API Integration
- UC-018: JWT Authentication Flow
- UC-019: API Error Handling
- UC-020: Real-time notifications

### Cấu trúc Use Case chuẩn

Mỗi Use Case nên bao gồm:

```markdown
## UC-XXX: [Tên Use Case]
**Mô tả**: [Mô tả ngắn gọn]

**Actor(s)**: [Học sinh/Giáo viên/Admin]

**Preconditions**: [Điều kiện cần có trước khi thực hiện]

**Main Flow**:
1. [Bước 1]
2. [Bước 2]
3. [Bước 3]
...

**Alternative Flows**:
- [Flow 1 nếu có]
- [Flow 2 nếu có]

**Exception Flows**:
- [Flow xử lý lỗi 1]
- [Flow xử lý lỗi 2]

**Postconditions**: [Kết quả mong đợi]

**Business Rules**:
- [Quy tắc nghiệp vụ 1]
- [Quy tắc nghiệp vụ 2]

**Technical Notes**:
```typescript
// Code examples
```

**Test Cases**:
1. [Test case 1]
2. [Test case 2]
```

### Cách mở rộng Use Cases

#### 1. Phân tích Business Requirements
- Xác định actor (người dùng)
- Xác định các chức năng cần có
- Xác định các luồng nghiệp vụ chính

#### 2. Viết Use Case Document
```bash
# Tạo file use case mới
touch USECASE-UC-XXX-FEATURE-NAME.md

# Thêm vào USECASES.md
# Ghi rõ ID, tên, mô tả, luồng thực hiện
```

#### 3. Review & Validate
- Review với stakeholder
- Validate với development team
- Update documentation

### Ví dụ Use Case chi tiết

#### UC-010: Tạo bài tập trắc nghiệm

**Mô tả đầy đủ**:
Giáo viên tạo bài tập trắc nghiệm mới với nhiều câu hỏi, có thể upload ảnh, và xuất bản cho học sinh.

**Luồng chính**:
1. Giáo viên đăng nhập vào hệ thống
2. Chọn "Tạo bài tập mới"
3. Nhập thông tin cơ bản:
   - Tên bài tập
   - Mô tả
   - Lớp học (10/11/12)
   - Chương học
   - Thời gian làm bài
   - Điểm tối đa
4. Thêm câu hỏi:
   - Nhập câu hỏi theo format chuẩn
   - Upload ảnh (nếu cần)
   - Thêm 4 đáp án (tối thiểu)
   - Đánh dấu đáp án đúng
5. Lưu bài tập
6. Xuất bản cho học sinh

**Code Implementation**:
```typescript
// services/exercise.service.ts
export class ExerciseService {
  createExercise(data: CreateExerciseRequest): Observable<Exercise> {
    // Implementation
  }
  
  uploadImage(image: File): Observable<string> {
    // Upload image to backend
  }
}
```

**Test Cases**:
1. Tạo bài tập với 5 câu hỏi thành công
2. Upload ảnh cho câu hỏi thành công
3. Lưu và xuất bản bài tập thành công
4. Validation: Không cho phép tạo bài thi không có câu hỏi

---

## 🛠️ Bước 2: Phát triển với Cursor

### Tại sao chọn Cursor AI?

**Cursor** là một IDE thông minh hỗ trợ AI, giúp:
- ✅ Code completion và suggestions
- ✅ Generate code từ natural language
- ✅ Refactoring tự động
- ✅ Debug và fix bugs nhanh
- ✅ Viết tests tự động
- ✅ Document code

### Setup Cursor cho dự án

#### 1. Cài đặt Cursor
```bash
# Download từ https://cursor.sh
# Install và mở project folder
cd /path/to/bioedutech
cursor .
```

#### 2. Cấu hình Cursor
Tạo file `.cursorrules` trong root directory:
```markdown
# .cursorrules

Project: BioEduTech - Hệ thống học tập trực tuyến sinh học
Framework: Angular 17
Language: TypeScript
Code Style: Angular Style Guide
Testing: Jasmine + Karma

## Rules:
1. Follow Angular Standalone Components pattern
2. Use TypeScript strict mode
3. Use RxJS for async operations
4. Implement proper error handling
5. Write comprehensive tests
6. Follow SCSS BEM methodology
7. Use Angular Material components
8. Implement proper authentication guards
9. Use proper TypeScript interfaces
10. Follow RESTful API conventions
```

#### 3. Prompt Templates cho Cursor

**Tạo Component mới:**
```
Tạo một Angular component mới tên là [ComponentName] với:
- Standalone component
- TypeScript interfaces cho data models
- SCSS styling với BEM methodology
- Integration với ApiService
- Error handling
- Loading states
- Responsive design
```

**Fix Bug:**
```
Vấn đề: [Mô tả vấn đề]
File: [file path]
Error: [error message]

Hãy xem xét và sửa lỗi này.
```

**Generate Tests:**
```
Tạo unit tests cho component [ComponentName]:
- Test ngOnInit
- Test service interactions
- Test error handling
- Test UI interactions
```

### Quy trình development với Cursor

#### Phase 1: Setup & Architecture

**1.1. Setup Project Structure**
```
Prompt cho Cursor:
"Tạo cấu trúc thư mục đầy đủ cho Angular 17 project với:
- Services folder
- Components folder
- Models folder  
- Guards folder
- Interceptors folder
- Configuration folder"
```

**1.2. Create Core Services**
```typescript
// services/api.service.ts
Prompt: "Tạo ApiService với HTTP client, 
JWT authentication, 
error handling, 
retry logic"
```

```typescript
// services/auth.service.ts
Prompt: "Tạo AuthService với:
- Login/logout
- JWT token management
- Role-based access
- Session management"
```

**1.3. Create Models**
```typescript
// models/exercise.model.ts
Prompt: "Tạo TypeScript interfaces cho:
- Exercise (bài thi)
- Question (câu hỏi)
- Answer (đáp án)
- User (người dùng)"
```

#### Phase 2: Feature Development

**2.1. Landing Page**
```
Prompt: "Tạo LandingPageComponent với:
- Hero section
- Features overview
- Call-to-action buttons
- Responsive design
- Integration với authentication"
```

**2.2. Authentication**
```
Prompt: "Tạo LoginComponent với:
- Form validation
- Role selection (teacher/student)
- API integration
- Error handling
- Redirect sau khi đăng nhập thành công"
```

**2.3. Teacher Dashboard**
```
Prompt: "Tạo TeacherDashboardComponent với:
- Statistics cards
- Quick actions
- Recent exams
- Student management link
- Reports link
- Responsive grid layout"
```

**2.4. Student Management**
```
Prompt: "Tạo StudentManagementComponent với:
- Tab 1: Upload Excel file
- Tab 2: Quick add form
- Data table with search/filter
- Edit/Delete actions
- API integration cho bulk registration"
```

**2.5. Create Exercise**
```
Prompt: "Tạo CreateExerciseComponent với:
- Form for exam basic info
- Dynamic question list
- Image upload for questions
- Preview functionality
- Parse question format
- Save & publish to API"
```

**2.6. Student Dashboard**
```
Prompt: "Tạo StudentDashboardComponent với:
- List available exams
- Exam cards with details
- Status badges
- Take exam button
- Progress tracking"
```

**2.7. Take Exam**
```
Prompt: "Tạo TakeExamComponent với:
- Timer service integration
- Question navigation
- Answer submission
- Auto-submit when time up
- Loading states
- Error handling"
```

**2.8. Chatbot**
```
Prompt: "Tạo ChatbotComponent với:
- OpenAI API integration
- Message history
- Auto-scroll
- Loading indicators
- Error handling
- Fixed bottom position"
```

#### Phase 3: Advanced Features

**3.1. Timer Feature**
```
Prompt: "Tạo TimerService với:
- Parse timer format (2m, 1h, 30s)
- Real-time countdown
- Dynamic warning thresholds
- Auto-submit callback
- Toast notifications
- Fixed bottom widget"
```

**3.2. Reports**
```
Prompt: "Tạo TeacherReportsComponent với:
- Exam results table
- Student details modal
- Statistics calculation
- Export to Excel
- Date filtering"
```

**3.3. AI Integration**
```
Prompt: "Tích hợp OpenAI Chatbot với:
- ChatbotService
- GPT-4o-mini model
- Biology-focused system prompt
- Context management
- Error handling"
```

### Best Practices với Cursor

#### 1. Use Specific Prompts
❌ Bad: "Tạo component cho login"
✅ Good: "Tạo LoginComponent standalone cho Angular 17 với reactive forms, validation, authentication service integration, và responsive design"

#### 2. Iterative Development
```bash
# Step 1: Generate basic structure
Prompt: "Tạo skeleton cho StudentDashboardComponent"

# Step 2: Add functionality
Prompt: "Thêm function loadExams() với API integration"

# Step 3: Add styling
Prompt: "Thêm SCSS styling với Material Design"

# Step 4: Add error handling
Prompt: "Thêm error handling và loading states"
```

#### 3. Code Review với Cursor
```
Prompt: "Review code sau và suggest improvements:
[paste code]

Focus on:
- TypeScript best practices
- Angular patterns
- Error handling
- Performance
- Security"
```

### Testing với Cursor

**Generate Unit Tests:**
```
Prompt: "Tạo unit tests cho [ComponentName] với:
- Component initialization
- Service mocking
- UI interactions
- Error cases
- Edge cases"
```

**Generate E2E Tests:**
```
Prompt: "Tạo E2E test cho use case UC-010: Tạo bài tập:
- Navigate to create exercise page
- Fill form
- Add questions
- Upload image
- Submit and verify"
```

### Troubleshooting với Cursor

**Debug Code:**
```
Prompt: "Code sau bị lỗi [error message]. 
File: [path]. 
Hãy debug và fix:

[paste code]"
```

**Refactor Code:**
```
Prompt: "Refactor code sau theo Angular best practices:

[paste code]"
```

---

## 🚀 Bước 3: Deploy trên Hostinger

### Chuẩn bị deploy

#### 1. Build Production

**Build Angular application:**
```bash
# Install dependencies nếu chưa
npm install

# Build for production
ng build --configuration production

# Build output sẽ ở: dist/bioedutech/browser/
```

**Verify build output:**
```bash
# Check build files
ls -la dist/bioedutech/browser/

# Expected files:
# - index.html
# - main-[hash].js
# - polyfills-[hash].js
# - styles-[hash].css
# - assets/
```

#### 2. Optimize Build

**Configure Angular for production:**
```json
// angular.json
{
  "projects": {
    "bioedutech": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

#### 3. Environment Configuration

**Create production environment:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://chimeara.pythonanywhere.com',
  appName: 'BioEduTech',
  version: '1.0.0'
};
```

### Các option deploy trên Hostinger

#### Option 1: Shared Hosting (Simple & Cheap)

**Ưu điểm:**
- ✅ Rẻ nhất ($2-4/tháng)
- ✅ Dễ setup
- ✅ PHP support
- ✅ Email hosting

**Nhược điểm:**
- ❌ Không phù hợp cho Angular SPA
- ❌ Không hỗ trợ Node.js
- ❌ Giới hạn tùy chỉnh

**Cách deploy:**
```bash
# 1. Build Angular app
ng build --configuration production

# 2. Upload dist/bioedutech/browser/* to public_html/

# 3. Configure .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Option 2: VPS Hosting (Recommended)

**Ưu điểm:**
- ✅ Full control
- ✅ Node.js support
- ✅ Nginx/Apache configuration
- ✅ SSL certificate
- ✅ Database support

**Nhược điểm:**
- ❌ Phải tự quản lý server
- ❌ Giá cao hơn ($5-15/tháng)

**Setup với VPS:**

**A. Nginx Configuration:**
```nginx
# /etc/nginx/sites-available/bioedutech
server {
    listen 80;
    server_name bioedutech.com www.bioedutech.com;
    root /var/www/bioedutech/dist/bioedutech/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://chimeara.pythonanywhere.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**B. Deploy Script:**
```bash
#!/bin/bash
# deploy.sh

echo "Building Angular app..."
ng build --configuration production

echo "Copying files to server..."
scp -r dist/bioedutech/browser/* user@your-server:/var/www/bioedutech/dist/bioedutech/browser/

echo "Deployment completed!"
```

**C. SSL Setup (Let's Encrypt):**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d bioedutech.com -d www.bioedutech.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### Option 3: Cloud Hosting (Vercel/Netlify)

**Ưu điểm:**
- ✅ Free tier
- ✅ Auto-deploy từ GitHub
- ✅ SSL auto
- ✅ CDN

**Deploy Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Setup Domain trên Hostinger

#### 1. Mua Domain

**Truy cập Hostinger Domain:**
- Website: https://www.hostinger.com/domains
- Search domain: `bioedutech.com`
- Purchase domain

**Recommended domain names:**
- bioedutech.com
- bioedutech.vn
- biolearn.vn
- bioclass.vn

#### 2. Configure DNS

**Point domain to server:**
```
Type: A
Name: @
Value: [Your server IP]
TTL: 3600

Type: CNAME
Name: www
Value: @
TTL: 3600
```

**Email DNS:**
```
Type: MX
Priority: 10
Value: mx1.hostinger.com

Type: MX
Priority: 20
Value: mx2.hostinger.com
```

#### 3. SSL Certificate

**Auto SSL với Hostinger:**
- Hostinger cung cấp SSL miễn phí
- Activate SSL qua control panel
- Redirect HTTP → HTTPS

### CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy BioEduTech

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build:prod
    
    - name: Deploy to Hostinger
      run: |
        echo "Deploying to production..."
        # Add deployment commands
```

### Monitoring & Maintenance

**Setup Monitoring:**
```typescript
// src/app/services/monitoring.service.ts
export class MonitoringService {
  trackPageView(url: string) {
    // Google Analytics
  }
  
  trackError(error: Error) {
    // Error reporting
  }
}
```

**Google Analytics:**
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## ✅ Checklist phát triển

### Phase 1: Setup (Tuần 1-2)
- [ ] Setup Angular 17 project
- [ ] Configure Cursor IDE
- [ ] Setup Git repository
- [ ] Create project structure
- [ ] Setup CI/CD pipeline
- [ ] Create base services (API, Auth)
- [ ] Setup development environment

### Phase 2: Core Features (Tuần 3-4)
- [ ] Landing page
- [ ] Authentication system
- [ ] Teacher Dashboard
- [ ] Student Dashboard
- [ ] Student Management (CRUD)
- [ ] Exercise List
- [ ] Create Exercise
- [ ] View Exercise

### Phase 3: Advanced Features (Tuần 5-6)
- [ ] Timer feature
- [ ] Take Exam functionality
- [ ] Exam Results
- [ ] Teacher Reports
- [ ] AI Chatbot integration
- [ ] Upload images
- [ ] Export/Import data

### Phase 4: Testing (Tuần 7)
- [ ] Unit tests (>80% coverage)
- [ ] E2E tests
- [ ] Manual testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser testing

### Phase 5: Deployment (Tuần 8)
- [ ] Setup Hostinger VPS
- [ ] Configure domain
- [ ] Setup SSL certificate
- [ ] Deploy application
- [ ] Configure monitoring
- [ ] User acceptance testing
- [ ] Documentation

---

## 📚 Tài nguyên hỗ trợ

### Tài liệu dự án

#### Development Docs
- `README.md` - Project overview
- `DEVELOPMENT.md` - Development guide
- `PROJECT_STRUCTURE.md` - Architecture
- `USECASES.md` - Use case documentation
- `STYLE_GUIDELINES.md` - Coding standards

#### Feature Docs
- `CHATBOT_FEATURE.md` - AI Chatbot
- `TIMER_FEATURE_COMPLETE.md` - Timer functionality
- `STUDENT_DASHBOARD_FEATURE.md` - Student features
- `TEACHER_REPORTS_FEATURE.md` - Reports system

#### API Docs
- `API_INTEGRATION_GUIDE.md` - API integration
- Swagger UI: https://chimeara.pythonanywhere.com/apidocs/

### External Resources

**Angular:**
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Angular Router](https://angular.io/guide/router)

**TypeScript:**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

**Cursor AI:**
- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Examples](https://github.com/cursor)

**Hostinger:**
- [Hostinger Docs](https://support.hostinger.com/)
- [Hostinger Tutorials](https://www.hostinger.com/tutorials)

**Deployment:**
- [Nginx Guide](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Support Channels

**Development Questions:**
- Review documentation files
- Check code comments
- Use Cursor AI assistant

**API Issues:**
- Swagger UI: https://chimeara.pythonanywhere.com/apidocs/
- API Status: Check backend health endpoint
- Error logs: Check browser console

**Deployment Issues:**
- Server logs: `/var/log/nginx/`
- Angular build logs: Check CI/CD output
- SSL issues: Use SSL Labs tester

---

## 🎯 Kết luận

Hướng dẫn này cung cấp quy trình đầy đủ để xây dựng ứng dụng BioEduTech từ đầu đến cuối:

1. **Bắt đầu với Use Cases** - Tạo tài liệu use case đầy đủ
2. **Phát triển với Cursor AI** - Sử dụng AI để code nhanh hơn
3. **Deploy lên Hostinger** - Setup production environment

### Next Steps

1. Review `USECASES.md` và validate requirements
2. Setup Cursor IDE và configure project
3. Bắt đầu development theo checklist
4. Test thoroughly trước khi deploy
5. Deploy và monitor production

### Lưu ý quan trọng

- ✅ Luôn follow Angular best practices
- ✅ Viết comprehensive tests
- ✅ Document code properly
- ✅ Follow security guidelines
- ✅ Optimize for performance
- ✅ Keep dependencies updated
- ✅ Monitor production metrics

---

**Version**: 1.0  
**Last Updated**: 2024-01-01  
**Status**: Active Development  

Good luck building BioEduTech! 🚀


