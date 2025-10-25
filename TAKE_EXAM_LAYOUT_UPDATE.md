# Cập Nhật Bố Cục Trang Làm Bài Thi (v4 - Final)

## Những Thay Đổi Chính

### 1. **Header Được Nén Gọn (Compact)**
- Header chỉ 16px padding, gọn gàng
- Nội dung: Tên bài thi, số câu, thời gian, điểm, timer

### 2. **Bố Cục 2 Cột (Sidebar + Content)**

```
┌──────────────────────────────────────────────┐
│         COMPACT HEADER                       │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│         PROGRESS BAR                         │
└──────────────────────────────────────────────┘

┌───────────────────┬──────────────────────────┐
│    SIDEBAR        │    QUESTION CONTENT      │
│   (150px)         │    (Flex: 1)             │
│                   │                          │
│  [‹]  [›]         │  Câu 1: ...             │
│                   │  [Hình ảnh]              │
│  [1] [3] [5]      │  ✓ Đáp án A             │
│  [2] [4] [6]      │  Đáp án B                │
│                   │  Đáp án C                │
│  ⬇️Scroll⬇️        │  Đáp án D                │
└───────────────────┴──────────────────────────┘

┌──────────────────────────────────────────────┐
│ [Nộp bài] [Trang chủ] [← Trước] [Sau →]    │
│           (Tất cả đồng nhất style)           │
└──────────────────────────────────────────────┘
```

## Chi Tiết Bố Cục Action Buttons (v4)

### Thứ Tự Nút (từ trái sang phải)
1. **Nộp bài thi** - Xanh gradient (Primary) - Icon: send
2. **Quay về trang chủ** - Xám (Secondary) - Icon: home
3. **Câu trước** - Xanh nhạt (Tertiary) - Icon: arrow_back
4. **Câu sau** - Xanh nhạt (Tertiary) - Icon: arrow_forward

### Style Đồng Nhất
Tất cả buttons có:
- **Padding**: 12px 24px (desktop) / 10px 16px (mobile)
- **Border-radius**: 10px
- **Font-size**: 14px (desktop) / 13px (mobile)
- **Font-weight**: 600
- **Transition**: all 0.3s ease
- **Gap icon-text**: 8px
- **Display**: flex, center align

### Button Variants

#### Submit Exam Button (`.submit-exam-btn`)
- Background: Linear gradient xanh (#4CAF50 → #66BB6A)
- Color: Trắng
- Hover: Gradient đậm hơn, translateY(-2px), shadow
- Disabled: Xám mờ

#### Back Dashboard Button (`.back-dashboard-btn`)
- Background: Xám nhạt (rgba 0.15)
- Color: Xám đậm (#555555)
- Border: 2px solid xám
- Hover: Xám đậm hơn, translateY(-2px)

#### Nav Buttons Inline (`.nav-btn-inline`)
- Background: Xanh nhạt (rgba 0.15)
- Color: Xanh đậm (#2e7d32)
- Border: 2px solid xanh nhạt
- Hover: Xanh đậm hơn, translateY(-2px)
- Disabled: Xám nhạt

## Phản Ứng (Responsive)

### Desktop (>768px)
- Action buttons nằm ngang, center
- Gap: 12px
- Padding: 25px (container), 12px 24px (buttons)
- Tất cả hiển thị đầy đủ

### Tablet (768px - 480px)
- Action buttons vẫn ngang, flex-wrap
- Gap: 10px (button)
- Padding: 20px (container)
- Tự động wrap nếu cần

### Mobile (<480px)
- Action buttons: flex-wrap
- Padding: 15px (container), 10px 16px (buttons)
- Font-size: 13px
- Icon-size: 14px (nhỏ hơn 1px)
- Gap button: 10px

## Lợi Ích Của Cập Nhật v4

✅ **Style Đồng Nhất**: Tất cả buttons có padding, border-radius, font-size giống nhau  
✅ **Dễ Nhận Diện**: Màu sắc phân biệt (xanh/xám/xanh nhạt)  
✅ **Thứ Tự Logic**: Nộp bài (priority 1) → Quay lại (priority 2) → Navigation (priority 3)  
✅ **Responsive Tốt**: Tự động wrap trên mobile  
✅ **Visual Harmony**: Hover effect, transition, shadow consistent  

## File Được Cập Nhật
- `take-exam.component.html` - Reorder buttons (submit → back → prev → next)
- `take-exam.component.scss` - Unified button styles + responsive

## Thay Đổi So Với v3
| Yếu tố | v3 | v4 |
|--------|----|----|
| Button order | back → nav → submit | submit → back → nav ✨ |
| Submit btn padding | 12px 30px | 12px 24px ✨ |
| Nav btn padding | 10px 16px | 12px 24px ✨ |
| Back btn padding | 12px 24px | 12px 24px (same) ✨ |
| Button border-radius | mixed (10-12px) | 10px (all) ✨ |
| Submit font-size | 15px | 14px ✨ |
| Nav btn font-size | 13px | 14px (same) ✨ |
| Gap (buttons) | 15px | 12px ✨ |
| nav-buttons-group wrapper | Visible | Hidden ✨ |

## CSS Structure
```scss
/* Base styles */
.action-buttons button { ... }

/* Variant styles */
.submit-exam-btn { ... }
.back-dashboard-btn { ... }
.nav-btn-inline { ... }

/* States */
:hover:not(:disabled)
:disabled

/* Icon styles */
*-icon, mat-icon { font-size: 16px }
```
