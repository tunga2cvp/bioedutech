# 📖 Hướng Dẫn Phát Triển Ứng Dụng BioEduTech

## 🎯 Tổng quan

Đây là tài liệu hướng dẫn đầy đủ để xây dựng ứng dụng **BioEduTech** - hệ thống học tập trực tuyến môn Sinh học cho học sinh THPT.

### Phương pháp được sử dụng:
1. **Xây dựng Use Cases đầy đủ** → Xác định rõ requirements
2. **Phát triển với Cursor AI** → Code nhanh và hiệu quả
3. **Deploy trên Hostinger** → Đưa ứng dụng lên production

---

## 📁 Tài liệu trong dự án

### 📘 Tài liệu chính

| File | Mô tả | Khi nào sử dụng |
|------|-------|-----------------|
| **DEVELOPMENT_PROCESS_GUIDE.md** | Hướng dẫn chi tiết toàn bộ quy trình | Khi cần hiểu rõ cách làm |
| **QUICK_START_GUIDE.md** | Hướng dẫn nhanh bắt đầu | Khi muốn bắt đầu ngay |
| **USECASES.md** | Tài liệu use case đầy đủ | Khi cần xác định requirements |
| **README.md** | Tổng quan dự án | Khi muốn hiểu dự án là gì |

### 📋 Tài liệu kỹ thuật

- **PROJECT_STRUCTURE.md** - Cấu trúc dự án
- **DEVELOPMENT.md** - Hướng dẫn phát triển
- **API_INTEGRATION_GUIDE.md** - Tích hợp API
- **STYLE_GUIDELINES.md** - Quy tắc coding

### 🎯 Tài liệu tính năng

- **CHATBOT_FEATURE.md** - Tính năng Chatbot AI
- **TIMER_FEATURE_COMPLETE.md** - Tính năng bộ đếm thời gian
- **STUDENT_DASHBOARD_FEATURE.md** - Dashboard học sinh
- **TEACHER_REPORTS_FEATURE.md** - Báo cáo giáo viên

---

## 🚀 Quy trình phát triển

### Bước 1: Hiểu Use Cases (1-2 tuần)

**Mục đích**: Xác định rõ tất cả requirements trước khi code

**Cách làm**:
1. Đọc file `USECASES.md`
2. Review 20 use cases hiện có
3. Thêm use cases mới nếu cần
4. Validate với stakeholders

**Tài liệu tham khảo**: `USECASES.md`

**Use Cases chính**:
- ✅ UC-001 to UC-006: Use cases cho học sinh
- ✅ UC-007 to UC-012: Use cases cho giáo viên  
- ✅ UC-013 to UC-014: Use cases cho admin
- ✅ UC-015 to UC-020: Use cases kỹ thuật

### Bước 2: Phát triển với Cursor (4-6 tuần)

**Mục đích**: Code ứng dụng nhanh với sự hỗ trợ của AI

**Setup Cursor**:
1. Download Cursor: https://cursor.sh
2. Mở project: `cursor .`
3. Tạo file `.cursorrules` để config

**Các bước development**:

#### Phase 1: Setup (Tuần 1)
```bash
# Create base structure
Prompt: "Tạo cấu trúc thư mục Angular 17 với standalone components"

# Create services
Prompt: "Tạo ApiService với HTTP client, JWT auth, error handling"

# Create models
Prompt: "Tạo TypeScript interfaces cho Exercise, Question, User"
```

#### Phase 2: Core Features (Tuần 2-3)
```bash
# Landing page
Prompt: "Tạo LandingPageComponent với hero section, features, CTA"

# Authentication
Prompt: "Tạo LoginComponent với form validation, role selection"

# Dashboards
Prompt: "Tạo TeacherDashboardComponent với stats, quick actions"

# CRUD Operations
Prompt: "Tạo StudentManagementComponent với add, edit, delete, search"
```

#### Phase 3: Advanced Features (Tuần 4-5)
```bash
# Timer feature
Prompt: "Tạo TimerService với countdown, auto-submit, toast notifications"

# AI Chatbot
Prompt: "Tạo ChatbotComponent với OpenAI integration"

# Reports
Prompt: "Tạo TeacherReportsComponent với statistics, export Excel"
```

#### Phase 4: Polish (Tuần 6)
```bash
# Testing
Prompt: "Tạo unit tests cho all components"

# Error handling
Prompt: "Thêm comprehensive error handling và retry logic"

# Performance
Prompt: "Optimize bundle size và implement lazy loading"
```

**Chi tiết**: Xem `DEVELOPMENT_PROCESS_GUIDE.md` section "Bước 2"

### Bước 3: Deploy trên Hostinger (1 tuần)

**Mục đích**: Đưa ứng dụng lên production

#### Bước 3.1: Mua Domain (Day 1)
1. Truy cập: https://www.hostinger.com/domains
2. Search domain: `bioedutech.com` hoặc tên khác
3. Purchase domain

#### Bước 3.2: Setup VPS (Day 2-3)
```bash
# SSH vào server
ssh user@your-server-ip

# Install Nginx
sudo apt update && sudo apt install nginx

# Install Node.js (nếu cần)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Bước 3.3: Build & Upload (Day 4)
```bash
# Build Angular app
ng build --configuration production

# Upload to server
scp -r dist/bioedutech/browser/* user@server:/var/www/html/
```

#### Bước 3.4: Configure Nginx (Day 5)
```nginx
# /etc/nginx/sites-available/bioedutech
server {
    listen 80;
    server_name bioedutech.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass https://chimeara.pythonanywhere.com;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/bioedutech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Bước 3.5: Setup SSL (Day 6)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d bioedutech.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### Bước 3.6: Configure DNS (Day 7)
```
Type: A
Name: @
Value: [Your VPS IP]
TTL: 3600

Type: CNAME
Name: www
Value: @
```

**Chi tiết**: Xem `DEVELOPMENT_PROCESS_GUIDE.md` section "Bước 3"

---

## 📋 Checklist phát triển

### ✅ Phase 1: Setup (Tuần 1-2)
- [ ] Setup Angular 17 project
- [ ] Configure Cursor IDE
- [ ] Setup Git repository
- [ ] Create project structure
- [ ] Setup CI/CD pipeline
- [ ] Create base services
- [ ] Setup development environment

### ✅ Phase 2: Core Features (Tuần 3-4)
- [ ] Landing page
- [ ] Authentication
- [ ] Teacher Dashboard
- [ ] Student Dashboard
- [ ] Student Management
- [ ] Exercise List
- [ ] Create Exercise
- [ ] View Exercise

### ✅ Phase 3: Advanced Features (Tuần 5-6)
- [ ] Timer feature
- [ ] Take Exam
- [ ] Exam Results
- [ ] Teacher Reports
- [ ] AI Chatbot
- [ ] Upload images
- [ ] Export/Import

### ✅ Phase 4: Testing (Tuần 7)
- [ ] Unit tests
- [ ] E2E tests
- [ ] Manual testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser testing

### ✅ Phase 5: Deployment (Tuần 8)
- [ ] Setup Hostinger VPS
- [ ] Configure domain
- [ ] Setup SSL
- [ ] Deploy app
- [ ] Configure monitoring
- [ ] UAT
- [ ] Documentation

---

## 🛠️ Cách sử dụng Cursor AI

### Setup ban đầu
```bash
# 1. Install Cursor
# Download từ: https://cursor.sh

# 2. Open project
cd /path/to/bioedutech
cursor .

# 3. Configure
# Tạo file .cursorrules (xem mẫu trong DEVELOPMENT_PROCESS_GUIDE.md)
```

### Prompts hiệu quả

#### 1. Tạo Component mới
```
Prompt: "Tạo [ComponentName]Component standalone với:
- [Feature 1]
- [Feature 2]
- Integration với [ServiceName]
- Responsive design"
```

#### 2. Fix Bug
```
Prompt: "Fix lỗi: [error message]
File: [file path]
Context: [describe issue]"
```

#### 3. Generate Tests
```
Prompt: "Tạo unit tests cho [ComponentName]:
- Test ngOnInit
- Test service calls
- Test error handling
- Test UI interactions"
```

#### 4. Refactor Code
```
Prompt: "Refactor code sau theo Angular best practices:
[paste code]
Focus on: [specific aspects]"
```

### Best Practices
- ✅ Be specific in prompts
- ✅ Iterate và refine
- ✅ Review generated code
- ✅ Test before deploying

---

## 🌐 Deploy trên Hostinger

### Option 1: Shared Hosting (Rẻ nhất - $2-4/tháng)

**Ưu điểm**: Dễ setup, rẻ
**Nhược điểm**: Không phù hợp cho Angular SPA

**Cách làm**:
```bash
# Build
ng build --configuration production

# Upload
scp dist/bioedutech/browser/* user@server:/public_html/

# Configure .htaccess (xem trong GUIDE)
```

### Option 2: VPS Hosting (Khuyến nghị - $5-15/tháng)

**Ưu điểm**: Full control, Nginx config, SSL
**Nhược điểm**: Cần tự quản lý server

**Cách làm**:
1. Mua VPS trên Hostinger
2. Setup Nginx
3. Deploy app
4. Configure SSL với Let's Encrypt

**Chi tiết đầy đủ**: Xem `DEVELOPMENT_PROCESS_GUIDE.md`

### Option 3: Cloud Hosting (Miễn phí/Vercel/Netlify)

**Ưu điểm**: Free tier, auto-deploy
**Nhược điểm**: Giới hạn về customization

**Cách làm**:
```bash
npm i -g vercel
vercel
vercel --prod
```

---

## 📚 Nguồn tài liệu

### Internal Docs
- **DEVELOPMENT_PROCESS_GUIDE.md** - Hướng dẫn chi tiết
- **QUICK_START_GUIDE.md** - Bắt đầu nhanh
- **USECASES.md** - Use cases đầy đủ
- **README.md** - Tổng quan

### External Links
- Angular Docs: https://angular.io/docs
- Cursor AI: https://cursor.sh
- Hostinger: https://www.hostinger.com
- API Docs: https://chimeara.pythonanywhere.com/apidocs/

---

## 💡 Tips quan trọng

### Development
✅ Follow Angular style guide
✅ Write tests cho mọi feature mới
✅ Document complex logic
✅ Use TypeScript strictly
✅ Handle errors properly

### Cursor AI
✅ Be specific trong prompts
✅ Iterate và refine code
✅ Always review generated code
✅ Test trước khi commit

### Deployment
✅ Test thoroughly trên staging
✅ Backup data trước khi deploy
✅ Monitor production metrics
✅ Keep dependencies updated
✅ Document environment variables

---

## 🆘 Hỗ trợ

### Khi gặp vấn đề

1. **Code issues**: Check docs → Search codebase → Ask Cursor AI
2. **API issues**: Check https://chimeara.pythonanywhere.com/apidocs/
3. **Deploy issues**: Check server logs → Review Nginx config
4. **Questions**: Review `DEVELOPMENT_PROCESS_GUIDE.md`

### Debug Commands
```bash
# Check server status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test Nginx config
sudo nginx -t

# Check Angular build
ng build --configuration production --verbose
```

---

## 🎯 Kết luận

Hướng dẫn này cung cấp roadmap đầy đủ để xây dựng BioEduTech:

1. **Start với Use Cases** → Xác định requirements
2. **Develop với Cursor** → Code nhanh với AI
3. **Deploy lên Hostinger** → Đưa app lên production

### Next Steps
1. Đọc `DEVELOPMENT_PROCESS_GUIDE.md` để hiểu chi tiết
2. Setup Cursor và bắt đầu development
3. Follow checklist
4. Deploy và monitor

---

**Version**: 1.0  
**Cập nhật**: 2024-01-01  
**Status**: Active  

Chúc bạn thành công với dự án BioEduTech! 🚀

