# Tính Năng Timer (Bộ Đếm Giờ) - Hướng Dẫn Đầy Đủ

## 📋 Tổng Quan

Tính năng timer cho phép các học sinh làm bài thi với giới hạn thời gian. Khi hết giờ, bài thi sẽ **tự động nộp**.

### Tính Năng Chính:
- ✅ **Parse Timer Strings**: Hỗ trợ format "2m", "1h", "30s", v.v.
- ✅ **Real-time Countdown**: Hiển thị thời gian còn lại theo thời gian thực
- ✅ **Fixed Timer Widget**: ⭐ Hiển thị cố định ở góc dưới bên phải, luôn nhìn thấy
- ✅ **Visual Warnings**: 
  - 🟢 **Normal** (Xanh lá): Timer đang chạy bình thường
  - 🟡 **Warning** (Vàng): Sắp nộp bài (động dựa trên duration)
  - 🔴 **Critical** (Đỏ): Sắp hết giờ (1 phút hoặc 10% thời gian)
- ✅ **Toast Notification**: Thông báo tại trước khi hết giờ (khi vào critical state)
- ✅ **Auto-Submit**: Tự động nộp bài khi hết giờ **KHÔNG CẦN ALERT**
- ✅ **Backward Compatible**: Vẫn hỗ trợ trường `time_limit` cũ (tính bằng phút)

---

## 🔧 Cấu Trúc Kỹ Thuật

### 1. **Timer Service** (`src/app/services/timer.service.ts`)

Service này quản lý tất cả logic timer.

#### Main Methods:

```typescript
// Parse timer string ("2m" -> 120 giây)
parseTimerString(timerString: string): number

// Khởi động timer với callback
startTimer(config: TimerConfig): void

// Dừng timer
stopTimer(): void

// Tạm dừng timer
pauseTimer(): void

// Tiếp tục từ nơi dừng
resumeTimer(): void

// Format giây thành HH:MM:SS
formatSeconds(seconds: number): string

// Lấy thông tin timer hiện tại
getTimerInfo(): any
```

#### Timer Config:

```typescript
interface TimerConfig {
  duration: number;              // Thời gian (giây)
  onTick?: (secondsRemaining: number) => void;      // Mỗi 1 giây
  onWarning?: (secondsRemaining: number) => void;   // Khi còn ≤ 5 phút
  onCritical?: (secondsRemaining: number) => void;  // Khi còn ≤ 1 phút
  onTimeUp?: () => void;                            // Khi hết giờ
}
```

### 2. **API Service** (`src/app/services/api.service.ts`)

Cập nhật các interface để hỗ trợ trường `timer`:

```typescript
export interface TestDetailApiResponse {
  success: boolean;
  exam: {
    exam_name: string;
    id: string | number;
    questions: TestDetailQuestion[];
    timer?: string;  // ← Trường mới: "2m", "1h", v.v.
    // ... các trường khác
  };
}

export interface TestDetailResponse {
  // ...
  timer?: string;   // ← Trường mới
}
```

### 3. **Take-Exam Component** (`src/app/components/take-exam/take-exam.component.ts`)

Sử dụng Timer Service để:

```typescript
// Khởi tạo timer từ API
initializeTimer(): void {
  let durationInSeconds = 0;

  // Ưu tiên lấy timer từ API
  if (this.exam?.timer) {
    durationInSeconds = this.timerService.parseTimerString(this.exam.timer);
  } else if (this.exam?.time_limit) {
    // Fallback: sử dụng time_limit cũ (tính bằng phút)
    durationInSeconds = this.exam.time_limit * 60;
  }

  if (durationInSeconds > 0) {
    this.timeRemaining = durationInSeconds;
    this.startTimer();
  }
}

// Khởi động timer với callbacks
startTimer(): void {
  const timerConfig: TimerConfig = {
    duration: this.timeRemaining,
    onTick: (seconds) => this.timeRemaining = seconds,
    onWarning: () => this.timerStatus = 'warning',  // ≤ 5 phút
    onCritical: () => this.timerStatus = 'critical', // ≤ 1 phút
    onTimeUp: () => this.timeUp()                    // Hết giờ
  };

  this.timerService.startTimer(timerConfig);
}

// Tự động nộp bài khi hết giờ
timeUp(): void {
  alert('Hết thời gian làm bài! Bài thi sẽ được tự động nộp.');
  setTimeout(() => {
    this.submitExamAuto();
  }, 100);
}
```

---

## 📡 API Response Format

API trả về timer trong response:

```json
{
  "success": true,
  "exam": {
    "exam_name": "Bài thi Sinh học",
    "id": 6,
    "timer": "2m",  // ← Timer ở đây
    "questions": [
      // ...
    ],
    "created_at": "2024-01-20T10:00:00Z"
  }
}
```

### Định Dạng Timer Hỗ Trợ:

| Format | Giải Thích | Ví Dụ |
|--------|-----------|-------|
| `2m`   | 2 phút    | 120 giây |
| `1h`   | 1 giờ     | 3600 giây |
| `30s`  | 30 giây   | 30 giây |
| `1.5h` | 1.5 giờ   | 5400 giây |
| `90m`  | 90 phút   | 5400 giây |

---

## 🎨 UI/UX

### Timer Widget Design

**Position**: Bottom-right corner of screen (fixed)
**Animation**: Slide-in from bottom-right on load
**Size**: Compact (10px padding, 16px font)
**Background**: Gradient green with blur effect
**Border**: Semi-transparent white border
**Z-Index**: 1000 (always above content)

### Timer Display States:

1. **Normal State** 🟢
   - Background: Xanh lá nhạt
   - Animation: Không có animation
   - Hiển thị: Chỉ thời gian

2. **Warning State** 🟡 (Động dựa trên duration)
   - Với bài thi < 5 phút: Trigger ở **50% thời gian trôi qua**
   - Với bài thi 5-10 phút: Trigger ở **25% thời gian trôi qua**
   - Với bài thi > 10 phút: Trigger ở **5 phút còn lại**
   - Background: Vàng nhạt với glow
   - Animation: `pulse` 1s
   - Hiển thị: Thời gian + "⚠️ Sắp nộp bài"

3. **Critical State** 🔴 (Động dựa trên duration)
   - Trigger ở: **max(1 phút, 10% thời gian còn lại)**
   - Background: Đỏ nhạt với glow mạnh
   - Animation: `pulse-critical` 0.5s (nhanh hơn)
   - Hiển thị: Thời gian + "🔴 Sắp hết giờ"
   - **⏰ Toast Notification Xuất Hiện**:
     - Vị trí: Trên cùng màn hình (top-center)
     - Màu: Gradient đỏ (#dc3545)
     - Thời lâu: 10 giây (có thể đóng bằng nút "✓")
     - Nội dung: "⏰ Sắp hết giờ! Còn lại XX:XX. Hệ thống sẽ tự động nộp bài khi hết thời gian."
     - Animation: Slide down từ trên xuống

4. **Time Up - Auto Submit** 🚀
   - Khi timer đạt 0:
     - **KHÔNG** hiển thị alert
     - **KHÔNG** chờ user xác nhận
     - Tự động nộp bài ngay
     - Chuyển sang trang kết quả
     - Console log: `⏰ Time is up! Auto-submitting exam...`

### CSS Animations:

```scss
// Pulse bình thường (5 phút)
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

// Pulse nguy hiểm (1 phút)
@keyframes pulse-critical {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

// Blink text
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0.6; }
}

// Toast notification slide-in animation
@keyframes slideInDown {
  from { 
    transform: translateY(-100px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

// Toast critical styling
.timer-toast-critical {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: 2px solid rgba(220, 53, 69, 0.8);
  box-shadow: 0 0 30px rgba(220, 53, 69, 0.5);
  animation: slideInDown 0.4s ease-out;
}
```

---

## 🧪 Cách Sử Dụng

### Cho Developers:

#### 1. Kiểm tra Timer Service

```typescript
import { TimerService } from '../../services/timer.service';

constructor(private timerService: TimerService) {}

// Parse timer string
const seconds = this.timerService.parseTimerString('2m'); // 120
const seconds = this.timerService.parseTimerString('1h'); // 3600
const seconds = this.timerService.parseTimerString('30s'); // 30

// Format seconds
const formatted = this.timerService.formatSeconds(125); // "02:05"
const formatted = this.timerService.formatSeconds(3661); // "01:01:01"
```

#### 2. Sử dụng Timer Service trong Component

```typescript
import { TimerService, TimerConfig } from '../../services/timer.service';

export class MyComponent implements OnInit, OnDestroy {
  constructor(private timerService: TimerService) {}

  ngOnInit() {
    const config: TimerConfig = {
      duration: 120, // 2 phút
      onTick: (seconds) => {
        console.log(`Còn ${seconds} giây`);
      },
      onWarning: (seconds) => {
        console.log(`Cảnh báo! Còn ${seconds} giây`);
      },
      onCritical: (seconds) => {
        console.log(`Nguy hiểm! Còn ${seconds} giây`);
      },
      onTimeUp: () => {
        console.log('Hết giờ!');
        // Auto-submit logic
      }
    };

    this.timerService.startTimer(config);
  }

  ngOnDestroy() {
    this.timerService.stopTimer();
  }
}
```

### Cho End Users:

1. Học sinh vào bài thi
2. Timer bắt đầu countdown tự động
3. Khi còn 5 phút:
   - Timer chuyển sang màu vàng
   - Hiển thị "⚠️ Còn lại 5 phút"
   - Animation pulse bắt đầu

4. Khi còn 1 phút:
   - Timer chuyển sang màu đỏ
   - Hiển thị "🔴 Sắp hết giờ"
   - Animation pulse nhanh hơn

5. Khi hết giờ:
   - Alert hiển thị
   - Bài thi tự động nộp
   - Chuyển sang trang kết quả

---

## 📝 Testing

### Manual Testing Steps:

1. **Test Normal State**:
   - Tạo bài thi với `timer: "5m"`
   - Xác nhận timer hiển thị "05:00"
   - Xác nhận timer countdown từ từ

2. **Test Warning State**:
   - Tạo bài thi với `timer: "5m30s"` (330 giây)
   - Chờ 31 giây
   - Xác nhận timer chuyển sang vàng
   - Xác nhận hiển thị "⚠️ Còn lại 5 phút"

3. **Test Critical State**:
   - Tạo bài thi với `timer: "1m30s"` (90 giây)
   - Chờ 31 giây
   - Xác nhận timer chuyển sang đỏ
   - Xác nhận hiển thị "🔴 Sắp hết giờ"

4. **Test Auto-Submit**:
   - Tạo bài thi với `timer: "1m"`
   - Chọn vài câu trả lời
   - Chờ hết 1 phút
   - Xác nhận:
     - Alert hiển thị
     - Bài thi tự động nộp
     - Chuyển sang trang kết quả

5. **Test Backward Compatibility**:
   - Tạo bài thi với `time_limit: 5` (không có `timer`)
   - Xác nhận timer vẫn hoạt động
   - Xác nhận countdown 5 phút

6. **Test Format Parsing**:
   - `timer: "2m"` → 120 giây ✅
   - `timer: "1h"` → 3600 giây ✅
   - `timer: "30s"` → 30 giây ✅
   - `timer: "1.5h"` → 5400 giây ✅
   - `timer: "2h30m"` → ❌ (không hỗ trợ, trả về 0)

---

## 🐛 Debugging

### Logs Console:

Timer Service in console logs các sự kiện:

```
🕐 Timer started: 120 seconds
⚠️ Timer warning: 5 minutes or less remaining
🔴 Timer critical: 1 minute or less remaining
⏰ Time is up!
🛑 Timer stopped
```

### Component Logs:

```
📥 Exam data received: {...}
📋 Timer from API: 2m
⏱️ Timer from API: 2m (120 seconds)
✅ Exam submitted successfully: {...}
```

---

## ⚙️ Configuration

### Thay đổi Thresholds:

Để thay đổi ngưỡng warning/critical, chỉnh sửa `timer.service.ts`:

```typescript
private warningThreshold: number = 300; // 5 phút (giây)
private criticalThreshold: number = 60; // 1 phút (giây)
```

Ví dụ:
- Warning ở 10 phút: `private warningThreshold: number = 600;`
- Critical ở 30 giây: `private criticalThreshold: number = 30;`

---

## 🚀 Rollout Plan

1. ✅ Code được review
2. ✅ Linting passed
3. ✅ Manual testing completed
4. 📋 QA testing in progress
5. 📋 Deploy to production
6. 📋 Monitor timer events
7. 📋 Gather user feedback

---

## 📚 File Changes Summary

### Files Created:
- `src/app/services/timer.service.ts` - New Timer Service

### Files Modified:
- `src/app/services/api.service.ts` - Added `timer` field
- `src/app/components/take-exam/take-exam.component.ts` - Use TimerService
- `src/app/components/take-exam/take-exam.component.html` - Update timer display
- `src/app/components/take-exam/take-exam.component.scss` - Enhanced timer styles

### New Documentation:
- `TIMER_FEATURE_GUIDE.md` - This file

---

## ✅ Checklist

- [x] Timer Service created
- [x] API interfaces updated
- [x] Take-exam component refactored
- [x] HTML template updated
- [x] SCSS styles enhanced
- [x] Auto-submit logic implemented
- [x] Warning/Critical states added
- [x] Format parsing implemented
- [x] Backward compatibility maintained
- [x] Documentation written
- [ ] QA testing completed
- [ ] Production deployment

---

## 📞 Support

Nếu có vấn đề:
1. Check console logs cho debug messages
2. Verify API response có field `timer`
3. Test parsing với `timerService.parseTimerString()`
4. Kiểm tra browser DevTools Network tab
