# Hướng Dẫn Test Tính Năng Timer

## 🧪 Test Cases

### Test Case 1: Normal Timer Display
**Purpose**: Kiểm tra timer hiển thị bình thường
**Steps**:
1. Tạo bài thi với `timer: "5m"`
2. Mở bài thi
3. Xác nhận timer hiển thị "05:00"
4. Xác nhận timer countdown từ từ (mỗi giây -1)

**Expected Result**: ✅ Timer hiển thị đúng format và countdown đúng

---

### Test Case 2: Warning State (≤ 5 phút)
**Purpose**: Kiểm tra visual warning khi còn ≤ 5 phút
**Steps**:
1. Tạo bài thi với `timer: "5m30s"` (330 giây)
2. Mở bài thi trong DevTools Console
3. Chờ 31 giây
4. Kiểm tra:
   - Timer chuyển sang màu vàng
   - Hiển thị text "⚠️ Còn lại 5 phút"
   - Console log: `⚠️ Timer warning: 5 minutes or less remaining`

**Expected Result**: ✅ Visual warning hoạt động đúng

---

### Test Case 3: Critical State (≤ 1 phút)
**Purpose**: Kiểm tra visual critical warning khi còn ≤ 1 phút
**Steps**:
1. Tạo bài thi với `timer: "1m30s"` (90 giây)
2. Mở bài thi trong DevTools Console
3. Chờ 31 giây
4. Kiểm tra:
   - Timer chuyển sang màu đỏ
   - Hiển thị text "🔴 Sắp hết giờ"
   - Animation pulse nhanh hơn
   - Console log: `🔴 Timer critical: 1 minute or less remaining`

**Expected Result**: ✅ Critical state hoạt động đúng

---

### Test Case 4: Auto-Submit on Time Up
**Purpose**: Kiểm tra tự động nộp bài khi hết giờ
**Steps**:
1. Tạo bài thi với `timer: "1m"` (60 giây)
2. Mở bài thi
3. Chọn một vài câu trả lời (không bắt buộc)
4. Chờ hết 60 giây
5. Kiểm tra:
   - Alert hiển thị: "Hết thời gian làm bài! Bài thi sẽ được tự động nộp."
   - Console log: `⏰ Time is up! Auto-submitting exam...`
   - Bài thi tự động nộp
   - Chuyển sang trang kết quả

**Expected Result**: ✅ Auto-submit hoạt động, chuyển sang trang kết quả

---

### Test Case 5: Manual Submit Before Time Up
**Purpose**: Kiểm tra nộp bài thủ công trước khi hết giờ
**Steps**:
1. Tạo bài thi với `timer: "5m"`
2. Mở bài thi
3. Chọn câu trả lời
4. Click "Nộp bài thi"
5. Confirm dialog
6. Kiểm tra:
   - Timer dừng lại
   - Bài thi nộp thành công
   - Chuyển sang trang kết quả

**Expected Result**: ✅ Manual submit hoạt động bình thường

---

### Test Case 6: Backward Compatibility (time_limit)
**Purpose**: Kiểm tra tương thích ngược với trường `time_limit` cũ
**Steps**:
1. Tạo bài thi **không có** `timer` nhưng có `time_limit: 5` (phút)
2. Mở bài thi
3. Kiểm tra:
   - Timer vẫn hoạt động
   - Timer countdown 5 phút
   - Console log: `⏱️ Timer from time_limit: 5 minutes (300 seconds)`

**Expected Result**: ✅ Backward compatibility hoạt động

---

### Test Case 7: Timer Format Parsing
**Purpose**: Kiểm tra parsing các định dạng timer khác nhau
**Steps**:
1. Mở DevTools Console
2. Inject code để test parsing:
```javascript
// In DevTools Console
// Note: Bạn cần inject TimerService instance
// Hoặc test thông qua API response
```

**Test Cases**:
- `timer: "2m"` → 120 giây ✅
- `timer: "1h"` → 3600 giây ✅
- `timer: "30s"` → 30 giây ✅
- `timer: "1.5h"` → 5400 giây ✅
- `timer: "90m"` → 5400 giây ✅
- `timer: "invalid"` → 0 (fallback) ✅

**Expected Result**: ✅ Tất cả format được parse đúng

---

### Test Case 8: Back to Dashboard Before Time Up
**Purpose**: Kiểm tra rời khỏi bài thi trước khi hết giờ
**Steps**:
1. Tạo bài thi với `timer: "5m"`
2. Mở bài thi
3. Click "Quay về trang chủ"
4. Confirm dialog
5. Kiểm tra:
   - Timer dừng lại
   - Quay về trang chủ
   - Console log: `🛑 Timer stopped`

**Expected Result**: ✅ Timer dừng, quay về trang chủ thành công

---

### Test Case 9: Timer Display Format
**Purpose**: Kiểm tra format hiển thị timer
**Steps**:
1. Tạo bài thi với các timer khác nhau
2. Kiểm tra format hiển thị:

| Seconds | Expected Display |
|---------|-----------------|
| 125 | "02:05" |
| 3661 | "01:01:01" |
| 59 | "00:59" |
| 3599 | "59:59" |
| 3600 | "01:00:00" |

**Expected Result**: ✅ Tất cả format hiển thị đúng

---

### Test Case 10: UI Responsiveness
**Purpose**: Kiểm tra UI timer trên các kích thước màn hình
**Steps**:
1. Mở bài thi
2. Test trên các breakpoint:
   - Desktop (1920px)
   - Tablet (768px)
   - Mobile (480px)
3. Kiểm tra:
   - Timer hiển thị đúng
   - Không overflow
   - Dễ đọc trên tất cả kích thước

**Expected Result**: ✅ Timer responsive trên tất cả kích thước

---

## 🔍 Console Logs Verification

Khi test, kiểm tra console logs:

### Startup Logs
```
📥 Exam data received: {...}
📋 Timer from API: 2m
⏱️ Timer from API: 2m (120 seconds)
🕐 Timer started: 120 seconds
```

### Warning State Logs
```
⚠️ Timer warning: 5 minutes or less remaining
```

### Critical State Logs
```
🔴 Timer critical: 1 minute or less remaining
```

### Time Up Logs
```
⏰ Time is up!
🛑 Timer stopped
```

### Submit Logs
```
Submitting exam: {...}
✅ Exam submitted successfully: {...}
```

---

## 🐛 Bug Tracking

### Known Issues
- None at this time

### Potential Issues to Watch
1. Timer không start nếu `timer` field bị missing
   - **Fix**: Fallback to `time_limit`
   
2. Browser tab background pause issues
   - **Status**: setInterval không pause khi tab background
   - **Workaround**: None needed for MVP
   
3. Memory leaks if timer not stopped
   - **Fix**: Always call `timerService.stopTimer()` in `ngOnDestroy`

---

## 📋 Regression Tests

Hãy chắc chắn các tính năng khác không bị ảnh hưởng:

- [ ] Login vẫn hoạt động
- [ ] Dashboard vẫn hiển thị bài thi
- [ ] Exam list vẫn hoạt động
- [ ] Create exam không bị ảnh hưởng
- [ ] Answer submission vẫn hoạt động
- [ ] Exam result vẫn hiển thị đúng

---

## ✅ Test Checklist

- [ ] Test Case 1: Normal Timer Display
- [ ] Test Case 2: Warning State
- [ ] Test Case 3: Critical State
- [ ] Test Case 4: Auto-Submit
- [ ] Test Case 5: Manual Submit
- [ ] Test Case 6: Backward Compatibility
- [ ] Test Case 7: Format Parsing
- [ ] Test Case 8: Back to Dashboard
- [ ] Test Case 9: Display Format
- [ ] Test Case 10: UI Responsiveness
- [ ] Console Logs Verification
- [ ] Regression Tests

---

## 🚀 Sign-Off

QA Team: _______________ Date: _______________

Approved for production: Yes / No

Comments:
_________________________________________________
_________________________________________________

---

## 📞 Support

Nếu gặp issue:
1. Check console logs
2. Verify API response có `timer` field
3. Check Network tab trong DevTools
4. Verify timer format: `2m`, `1h`, `30s`, v.v.
5. Report bug với console logs và reproduction steps
