# Timer Widget - Visual Layout Guide

## 🎯 Layout Diagram

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Exam Header (Tên bài thi, số câu, điểm)              │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Progress Bar (Tiến trình làm bài)                    │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Questions Sidebar  │  Question Display                │
│  (1, 2, 3...)       │  - Content                       │
│                     │  - Image (if any)                │
│                     │  - Answer options                │
│                     │                                  │
│                     │                                  │
│                     │                                  │
│                     │                                  │
│                     │                          ╔════════════╗
│                     │                          ║ Timer      ║ ← Fixed Position
│                     │                          ║ ⏱ 01:45   ║   Bottom-Right
│                     │                          ╚════════════╝
├────────────────────────────────────────────────────────┤
│  [Previous] [Submit] [Home] [Next]  Footer Buttons    │
└────────────────────────────────────────────────────────┘
```

## 📱 Timer Widget Positioning

### Desktop (1920px)
```
                                      ┌─────────────┐
                                      │ ⏱ 01:45   │
                                      │ Timer      │
                                      └─────────────┘
                              30px ↑
                            30px ←
```

### Tablet (768px)
```
                          ┌─────────────┐
                          │ ⏱ 01:45   │
                          │ Timer      │
                          └─────────────┘
                        30px ↑
                      30px ←
```

### Mobile (480px)
```
                    ┌─────────────┐
                    │ ⏱ 01:45   │
                    │ Timer      │
                    └─────────────┘
                  30px ↑
                30px ←
```

## 🎨 Timer Widget Styling

### Normal State (🟢)
```
┌───────────────────┐
│ 🕐 02:35 Timer    │ ← Compact, minimal padding
│                   │ ← Gradient green background
└───────────────────┘
   No animation, steady
```

### Warning State (🟡)
```
┏━━━━━━━━━━━━━━━━━━┓
┃ 🕐 00:45 ⚠️      ┃ ← Vibrating (translateX + rotate)
┃                  ┃ ← Glow effect: yellow
┗━━━━━━━━━━━━━━━━━━┛
   Vibrate animation (0.5s)
```

### Critical State (🔴)
```
╔════════════════════╗
║ 🕐 00:12 🔴       ║ ← Shaking (intense vibration)
║                   ║ ← Scale pulse (1.02-1.03)
╚════════════════════╝
   Shake + Glow (intense)
```

## ⚙️ Animation Details

### Entry Animation (Bounce In)
```
Keyframes: 0%, 50%, 100%
- 0%: Scale 0.3, translate from bottom-right, opacity 0
- 50%: Bounce back (overshoot), scale 1.05
- 100%: Final position, scale 1
Duration: 0.6s (cubic-bezier)
Effect: Vibrant, playful bounce
```

### Warning State: Vibrate
```
Movement: ±2-3px horizontal + rotation
Duration: 0.5s infinite
Intensity: Gentle vibration (not harsh)
Combined with: Glow pulse
```

### Critical State: Shake
```
Movement: ±3px + ±2° rotation + scale 1.02-1.03
Duration: 0.4s infinite
Intensity: More aggressive shaking
Combined with: Intense glow pulse
```

## 📏 Size Comparison

| Aspect | Old | New |
|--------|-----|-----|
| Padding | 12px 20px | 8px 14px |
| Font | 18px | 14px |
| Icon | 20px | 16px |
| Label | 12px | 10px |
| Border Radius | 50px | 16px |
| Gap | 10px | 6px |
| Bottom/Right | 30px | 25px |

## 🎬 Animation Timeline

```
User opens exam
        │
        ├─ 0ms: Timer appears (bounceInBottomRight)
        │     ├─ Scale from 0.3 to 1
        │     ├─ Overshoot at 50% (1.05)
        │     ├─ Bounce effect
        │     └─ Takes 600ms
        │
        ├─ Exam starts (Normal state)
        │     └─ 🟢 Steady display
        │
        ├─ Warning threshold
        │     ├─ 🟡 Yellow glow
        │     ├─ Vibrate animation starts
        │     ├─ Box-shadow pulses
        │     └─ Continuous 0.5s vibration
        │
        ├─ Critical threshold
        │     ├─ 🔴 Red glow (intense)
        │     ├─ Shake animation (more aggressive)
        │     ├─ Scale pulse (1.02-1.03)
        │     ├─ Box-shadow intense glow
        │     └─ Faster feedback
        │
        └─ Time = 0
              └─ Auto-submit
```

## CSS Size Metrics

```scss
.timer-container {
  padding: 8px 14px;        // ← Compact
  border-radius: 16px;      // ← Rounded but not too much
  font-size: 14px;          // ← Readable but small
  bottom: 25px;             // ← Slightly adjusted
  right: 25px;
}

.timer {
  gap: 6px;                 // ← Tighter spacing
  font-size: 14px;
  
  .timer-icon {
    font-size: 16px;        // ← Compact icon
  }
  
  .timer-label {
    font-size: 10px;        // ← Small label
    margin-left: 4px;       // ← Tight spacing
  }
}
```

## 🎯 Visual Impact

**Compact Benefits**:
- ✅ Doesn't distract from questions
- ✅ Clean, minimal design
- ✅ Easy to scan quickly
- ✅ Fits on all screen sizes

**Vibrant Animation Benefits**:
- ✅ Draws attention when needed (warning/critical)
- ✅ Feels responsive and alive
- ✅ Playful bounce entry (friendly UX)
- ✅ Gentle vibrate (warning) vs intense shake (critical)
- ✅ Glow effect adds depth and urgency

## ⚙️ CSS Properties

```scss
.timer-container {
  position: fixed;        /* ← Fixed to viewport */
  bottom: 30px;          /* ← 30px from bottom */
  right: 30px;           /* ← 30px from right */
  z-index: 1000;         /* ← Above all content */
  
  /* Compact sizing */
  padding: 12px 20px;
  border-radius: 50px;
  
  /* Visual effects */
  background: gradient;
  box-shadow: 0 8px 25px rgba(...);
  backdrop-filter: blur(10px);
  
  /* Entry animation */
  animation: slideInBottomRight 0.5s ease-out;
}

/* Animation from bottom-right */
@keyframes slideInBottomRight {
  from {
    transform: translateX(150px) translateY(150px);
    opacity: 0;
  }
  to {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
}
```

## 🔄 State Transitions

```
Timer Starts (Normal)
        │
        ├─ Time passes normally (50-100% remaining)
        │       ↓
        ├─ 🟢 GREEN - Timer with schedule icon
        │
        ├─ Warning threshold reached (25-50% remaining)
        │       ↓
        ├─ 🟡 YELLOW - Pulsing animation starts
        │       ↓
        ├─ ⚠️ "Sắp nộp bài" label appears
        │
        ├─ Critical threshold reached (≤10% or 1 min)
        │       ↓
        ├─ 🔴 RED - Faster pulsing animation
        │       ↓
        ├─ 🔴 "Sắp hết giờ" label appears
        │       ↓
        ├─ ⏰ Toast notification pops up
        │       ↓
        ├─ Time = 0
        │       ↓
        └─ ✅ Auto-submit (No alert)
```

## 📐 Spacing Guidelines

### Timer Widget Margins
```
Screen Edge
    ↓
   30px  ← Bottom margin
   ┌────────────┐
   │   Timer    │
   │  Widget    │
   └────────────┘
   ← 30px → (Right margin)
```

### Responsive Adjustments
- Desktop: 30px margin
- Tablet (768px): 30px margin (may overflow on small tablets)
- Mobile (480px): Could reduce to 16px if needed

## 🎯 Non-Intrusive Design

The timer widget is designed to:
- ✅ Not block answer options
- ✅ Not interfere with question content
- ✅ Stay visible during scrolling
- ✅ Use semi-transparent design (backdrop-filter)
- ✅ Provide smooth animations (no jarring movements)
- ✅ Clear visual hierarchy (size appropriate)

## 🚀 Accessibility

- Timer is always accessible (fixed position)
- High contrast in all states
- Large enough text (16px)
- Clear icons (🕐, ⏰, 🔴)
- Text alternatives for visually impaired

## 📝 Implementation Details

**File**: `src/app/components/take-exam/take-exam.component.scss`

**Container Class**: `.timer-container`
**Timer Class**: `.timer`

**Related States**:
- `.timer-normal` - Normal state
- `.timer-warning` - Warning state
- `.timer-critical` - Critical state
- `.timer-label` - Status text

---

## 📍 Questions Sidebar Layout

### Purpose
The sidebar on the left shows all question numbers for quick navigation. It adapts to any number of questions without breaking the layout.

### Design Improvements
1. **3-Column Grid**: Questions arranged in 3 columns (was 2)
2. **Responsive Height**: Max-height scales with viewport
3. **Smart Scrolling**: Only scrolls when questions exceed available space
4. **Aligned Layout**: Proper flex alignment prevents misalignment
5. **Custom Scrollbar**: Styled to match theme

### Layout Structure
```
┌─────────────────────────────────────────────┐
│ Sidebar (160px wide)                        │
├─────────────────────────────────────────────┤
│  [◀ Previous]                               │
│  [Next ▶]                                   │
│  ┌──────────────────────┐                   │
│  │  1   2   3           │                   │
│  │  4   5   6           │                   │
│  │  7   8   9           │  ← 3-column grid  │
│  │ 10  11  12           │  ← Scrollable     │
│  │ 13  14  15           │  ← if many Qs    │
│  │ 16  17  18           │                   │
│  └──────────────────────┘                   │
└─────────────────────────────────────────────┘
```

### Question Number Styling

**Normal State**:
```
┌──────┐
│ 5    │ ← 38px circle
└──────┘
Gray, small font (11px)
```

**Hovered**:
```
┏━━━━━━┓
┃ 5    ┃ ← Scale 1.12x
┗━━━━━━┛
Border highlights, slight glow
```

**Active** (Currently viewing):
```
╔══════╗
║ 5    ║ ← Green gradient background
║      ║ ← Solid color highlight
╚══════╝
No scale effect, bold font (800)
Color: Gradient green + white text
```

**Answered**:
```
┌──────┐
│ 5    │ ← Light green background
└──────┘
Indicates question was answered
```

### Size Constraints

```
Sidebar Width: 160px
Question Button: 38x38px
Grid Columns: 3
Gap: 6px
Padding: 8px

Layout Math:
- 3 × 38px + 2 × 6px gaps = 126px
- 8px padding on each side = 144px
- Total: 160px ✅ Fits perfectly
```

### Scrolling Behavior

```css
.questions-grid {
  max-height: calc(100vh - 500px);  /* Dynamic height */
  min-height: 200px;               /* Minimum space */
  overflow-y: auto;                /* Scroll if needed */
  overflow-x: hidden;              /* No horizontal scroll */
  flex: 1;                          /* Takes available space */
  align-content: start;             /* Align to top */
}
```

### Examples

**Few Questions (4-6)**:
```
┌────────┐
│ 1 2 3  │
│ 4 5 6  │
└────────┘
No scrollbar (fits within container)
```

**Many Questions (30+)**:
```
┌────────┐
│ 1 2 3  │ ↑
│ 4 5 6  │ │ Scrollable
│ 7 8 9  │ │
│...     │ │
│28 29 30│ ↓
│        │ ← Custom scrollbar
└────────┘
```

### Custom Scrollbar

```css
scrollbar-width: 6px;              /* Thin */
scrollbar-track: Light green       /* Subtle background */
scrollbar-thumb: Green hover       /* Interactive */
```

Visual:
```
  ┌─────────────┐
  │             │ █ ← Scrollbar thumb
  │             │ █
  │             │ █
  │             │ ▓ ← Scrollbar track
  │             │ ▓
  └─────────────┘
```

### Responsive Adjustments

On smaller screens, sidebar may adjust:
- Mobile (< 480px): May stack above or below questions
- Tablet (< 768px): May reduce to 2 columns
- Desktop (> 768px): Standard 3-column layout
