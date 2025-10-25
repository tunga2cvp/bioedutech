# 🚀 Timer Feature - Quick Start Guide

## 5 Phút Setup & Test

### ✅ Các tính năng có sẵn:

1. **Timer từ API** - Parse "2m", "1h", "30s"
2. **Countdown Real-time** - Hiển thị HH:MM:SS
3. **Visual Warnings** - 🟢 Normal → 🟡 Warning → 🔴 Critical
4. **Auto-Submit** - Tự động nộp bài khi hết giờ
5. **Fixed Timer Widget** - ⭐ Hiển thị cố định ở góc dưới bên phải màn hình
   - Luôn nhìn thấy, không bị che bở
   - Compact design
   - Slide-in animation
6. **Toast Notification** - ⏰ Thông báo tại 1 phút trước hết giờ
7. **Backward Compatible** - Vẫn support `time_limit` cũ

---

## 🔍 File Nào Thay Đổi?

| File | Thay Đổi | Dòng |
|------|---------|------|
| `src/app/services/timer.service.ts` | ✨ NEW | +273 |
| `src/app/services/api.service.ts` | ⚙️ Updated | +2 |
| `src/app/components/take-exam/take-exam.component.ts` | ⚙️ Updated | +120 |
| `src/app/components/take-exam/take-exam.component.html` | ⚙️ Updated | +8 |
| `src/app/components/take-exam/take-exam.component.scss` | ⚙️ Updated | +70 |

**Total**: ~400 dòng code mới + ~1000 dòng tài liệu

---

## 🧪 Quick Test (1 phút)

```bash
# 1. Tạo bài thi với timer
POST /exams
{
  "exam_name": "Test Timer",
  "timer": "2m",  # ← Cái mới này!
  "questions": [...]
}

# 2. Mở bài thi
# - Timer hiển thị "02:00"
# - Countdown từ từ

# 3. Khi còn 1 phút (hoặc khi vào critical state):
# - Toast notification xuất hiện từ trên
# - Thông báo: "⏰ Sắp hết giờ! Còn lại XX:XX. Hệ thống sẽ tự động nộp bài khi hết thời gian."
# - Toast tồn tại 10 giây với nút "✓" để đóng

# 4. Khi hết thời gian:
# - Bài thi tự động nộp (KHÔNG có alert)
# - Chuyển sang trang kết quả
```

---

## 📡 API Response Format

```json
{
  "success": true,
  "exam": {
    "exam_name": "Bài thi",
    "id": 6,
    "timer": "2m",        // ← Mới
    "time_limit": 2,      // ← Cũ (vẫn hỗ trợ)
    "questions": [...]
  }
}
```

---

## ⏱️ Timer States & Notifications

```
Bài thi 2 phút:
00:00 ┌─────────────────────────────┐
  ↓   │    Timer đang chạy bình     │
02:00 │    thường (🟢 Normal)       │
      └─────────────────────────────┘
        
      ┌─────────────────────────────┐
  ↓   │  ⚠️ Sắp nộp bài             │
01:00 │  (🟡 Warning)               │ ← 50% thời gian trôi
      │  (Động tính: 1 phút)        │
      └─────────────────────────────┘
        
      ┌─────────────────────────────┐
  ↓   │  🔴 Sắp hết giờ             │
00:12 │  (🔴 Critical)              │ ← 10% thời gian còn lại
      │  ⏰ Toast xuất hiện          │    TOAST NOTIFICATION!
      │  "Sắp hết giờ! Còn lại..." │    Hiện lên từ trên
      │  (Tồn tại 10 giây)          │
      └─────────────────────────────┘
        
      ┌─────────────────────────────┐
  ↓   │  Auto-Submit (No Alert)     │
00:00 │  (Nộp bài + Chuyển kết quả) │ ← Hết giờ - Tự động nộp
      └─────────────────────────────┘
```

### Công Thức Tính Dynamic Threshold:

| Duration | Warning Threshold | Critical Threshold |
|----------|------------------|-------------------|
| < 5 phút | 50% thời gian | max(1 phút, 10%) |
| 5-10 phút | 25% thời gian | max(1 phút, 10%) |
| > 10 phút | 5 phút (cố định) | max(1 phút, 10%) |

Ví dụ:
- 2 phút → Warning ở 1 phút, Critical ở 12 giây
- 8 phút → Warning ở 2 phút, Critical ở 48 giây  
- 1 giờ → Warning ở 5 phút, Critical ở 1 phút
```

---

## 💻 Developer Usage

### Use Timer Service

```typescript
import { TimerService, TimerConfig } from '../../services/timer.service';

export class MyComponent {
  constructor(private timerService: TimerService) {}

  startTimer() {
    const config: TimerConfig = {
      duration: 120, // 2 phút
      onTick: (seconds) => console.log(`Còn ${seconds}s`),
      onWarning: () => console.log('Cảnh báo! ≤ 5 phút'),
      onCritical: () => console.log('Nguy hiểm! ≤ 1 phút'),
      onTimeUp: () => console.log('Hết giờ!')
    };

    this.timerService.startTimer(config);
  }

  ngOnDestroy() {
    this.timerService.stopTimer(); // ⚠️ QUAN TRỌNG!
  }
}
```

### Parse Timer String

```typescript
this.timerService.parseTimerString('2m');   // 120
this.timerService.parseTimerString('1h');   // 3600
this.timerService.parseTimerString('30s');  // 30
this.timerService.parseTimerString('1.5h'); // 5400
```

### Format Seconds

```typescript
this.timerService.formatSeconds(125);   // "02:05"
this.timerService.formatSeconds(3661);  // "01:01:01"
this.timerService.formatSeconds(59);    // "00:59"
```

---

## 📝 Console Logs

Mở DevTools Console để xem:

```
🕐 Timer started: 120 seconds
⚠️ Timer warning: 5 minutes or less remaining
🔴 Timer critical: 1 minute or less remaining
⏰ Time is up!
🛑 Timer stopped
```

---

## ✅ Checklist Pre-Deployment

- [x] Code linting passed
- [x] No TypeScript errors
- [x] Backward compatible
- [x] Documentation complete
- [x] Test guide created
- [ ] QA approved
- [ ] Deployed to production

---

## 🐛 Troubleshooting

### Timer không hiển thị?
```
1. Check API response có "timer" field?
2. Check console logs có error?
3. Verify format "2m", "1h", "30s"?
```

### Timer không auto-submit?
```
1. Check onTimeUp callback được gọi?
2. Check alert có hiển thị?
3. Check network request submit?
```

### Timer chạy quá nhanh/chậm?
```
1. Browser tab được focus?
2. Browser console open?
3. Máy CPU cao?
→ Này là browser limitation, không phải bug
```

---

## 📚 Full Documentation

- **TIMER_FEATURE_GUIDE.md** - Tài liệu chi tiết
- **TIMER_FEATURE_TEST_GUIDE.md** - Hướng dẫn test
- **TIMER_IMPLEMENTATION_SUMMARY.md** - Tóm tắt implementation

---

## 🎯 Key Takeaways

✨ **New**: 
- Timer field từ API
- TimerService cho countdown
- Visual warning system
- Auto-submit on time up

🔄 **Unchanged**:
- Existing exam functionality
- API endpoint format
- Component interfaces (mostly)
- Database schema

🚀 **Ready**:
- Production deployment
- QA testing
- User rollout

---

## 🎉 Done!

Timer feature hoàn tất. Sẵn sàng deploy! 🚀

Questions? Check documentation files. Happy coding! 💻
