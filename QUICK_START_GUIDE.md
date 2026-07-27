# 🚀 BioEduTech - Quick Start Guide

## Tổng quan 30 giây

**BioEduTech** = Hệ thống học tập Sinh học THPT (Angular + AI Chatbot + Backend API)

**Stack**: Angular 17 → Hostinger VPS → Domain bioedutech.com

---

## 📋 Bắt đầu trong 5 phút

### 1️⃣ Clone & Setup (2 phút)
```bash
# Clone repository
git clone <repo-url>
cd bioedutech

# Install dependencies
npm install

# Start development server
ng serve
# → Open http://localhost:4200
```

### 2️⃣ Test Login (1 phút)
```
Teacher: giaovien / 123456
Student: [any student account]
```

### 3️⃣ Key URLs (1 phút)
```
http://localhost:4200                → Landing page
http://localhost:4200/login          → Login
http://localhost:4200/teacher        → Teacher dashboard
http://localhost:4200/student        → Student dashboard
```

---

## 🎯 Development Workflow

### Cách làm việc với Cursor AI

#### 1. Tạo Component mới
```
Prompt: "Tạo StudentProfileComponent standalone với:
- User info display
- Edit profile form
- Avatar upload
- Integration với AuthService
```

#### 2. Fix Bug
```
Prompt: "Fix lỗi sau [paste error message]:
File: [file path]
Context: [describe issue]
```

#### 3. Add Feature
```
Prompt: "Thêm feature export kết quả thi ra Excel:
- Use xlsx library
- Add button trong Teacher Reports
- Generate file download
```

### Development Cheat Sheet

```bash
# Development
ng serve              # Start dev server
ng build             # Build
ng test              # Run tests
ng lint              # Check code quality

# Git
git checkout -b feature/new-feature
git commit -m "feat: add feature"
git push origin feature/new-feature

# Build Production
ng build --configuration production
# Output: dist/bioedutech/browser/
```

---

## 🚀 Deploy Checklist

### Pre-Deploy
- [ ] Build successful (`ng build --configuration production`)
- [ ] No console errors
- [ ] All tests pass
- [ ] Environment variables set

### Deploy Steps
1. Build: `ng build --configuration production`
2. Upload: `scp -r dist/bioedutech/browser/* user@server:/var/www/html/`
3. Configure Nginx: Point to `/var/www/html`
4. SSL: Setup Let's Encrypt
5. Domain: Point DNS to server IP

### Post-Deploy
- [ ] HTTPS working
- [ ] API calls working
- [ ] All pages accessible
- [ ] Mobile responsive

---

## 🔧 Troubleshooting

### Port 4200 busy
```bash
ng serve --port 4201
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
ng build --configuration production --verbose
```

### API errors
- Check: `https://chimeara.pythonanywhere.com/apidocs/`
- Test: `curl https://chimeara.pythonanywhere.com/health`

---

## 📚 Important Files

### Code
```
src/app/
├── components/       # UI components
├── services/        # Business logic
├── models/          # TypeScript interfaces
└── config/          # Configuration
```

### Docs
```
├── DEVELOPMENT_PROCESS_GUIDE.md   # Full guide
├── USECASES.md                    # Requirements
├── README.md                      # Overview
└── QUICK_START_GUIDE.md          # This file
```

---

## 🎓 Learning Path

### Week 1: Setup & Basics
- [ ] Setup development environment
- [ ] Run locally
- [ ] Understand project structure
- [ ] Read `USECASES.md`

### Week 2: Core Features
- [ ] Implement Login
- [ ] Teacher Dashboard
- [ ] Student Dashboard
- [ ] CRUD operations

### Week 3: Advanced Features
- [ ] Timer functionality
- [ ] AI Chatbot
- [ ] Reports
- [ ] Image upload

### Week 4: Testing & Deploy
- [ ] Write tests
- [ ] Fix bugs
- [ ] Deploy to Hostinger
- [ ] Production monitoring

---

## 💡 Tips

### Use Cursor AI Effectively
✅ Be specific in prompts
✅ Iterate and refine
✅ Review generated code
✅ Test before deploying

### Best Practices
✅ Follow Angular style guide
✅ Write tests for new features
✅ Document complex logic
✅ Use TypeScript strictly
✅ Handle errors properly

### Common Patterns
```typescript
// Service injection
constructor(private apiService: ApiService) {}

// Observable handling
this.apiService.getData().subscribe({
  next: data => this.data = data,
  error: err => console.error(err)
});

// Form validation
this.form = this.fb.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.email]]
});
```

---

## 🆘 Get Help

1. **Check docs**: `DEVELOPMENT_PROCESS_GUIDE.md`
2. **Check code**: Search in codebase
3. **Ask Cursor AI**: Use AI assistant
4. **Check API**: https://chimeara.pythonanywhere.com/apidocs/

---

**Version**: 1.0  
**Quick reference for BioEduTech development**


