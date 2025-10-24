# 🎨 BioEduTech Style Guidelines

## 📋 Tổng Quan

Tài liệu này định nghĩa các quy tắc thiết kế và phong cách cho ứng dụng BioEduTech để đảm bảo tính nhất quán trong toàn bộ hệ thống.

## 🎯 Nguyên Tắc Thiết Kế

### 1. Consistency (Tính Nhất Quán)
- Tất cả các trang phải có cấu trúc và styling nhất quán
- Sử dụng cùng một pattern cho header, navigation, và footer
- Đồng nhất về typography, colors, spacing, và components

### 2. User Experience (Trải Nghiệm Người Dùng)
- Giao diện thân thiện, dễ sử dụng
- Navigation rõ ràng và trực quan
- Feedback tức thời cho các hành động của người dùng

### 3. Accessibility (Khả Năng Truy Cập)
- Hỗ trợ keyboard navigation
- Contrast ratio phù hợp cho người khiếm thị
- Alt text cho hình ảnh

## 🎨 Color Palette

### Primary Colors
```scss
$primary-green: #4CAF50;
$primary-green-dark: #45a049;
$primary-green-light: #81c784;
$primary-green-lighter: #c8e6c9;
```

### Secondary Colors
```scss
$secondary-green: #66bb6a;
$secondary-green-dark: #4caf50;
$secondary-green-light: #a5d6a7;
```

### Neutral Colors
```scss
$gray-dark: #333333;
$gray-medium: #666666;
$gray-light: #999999;
$gray-lighter: #cccccc;
$gray-lightest: #f5f5f5;
$gray-bg: #f8f9fa;
$white: #ffffff;
```

### Status Colors
```scss
$success: #4CAF50;
$success-light: #c8e6c9;
$warning: #ff9800;
$warning-light: #ffe0b2;
$danger: #f44336;
$danger-light: #ffcdd2;
$info: #2196f3;
$info-light: #bbdefb;
```

### White & Black
```scss
$white: #ffffff;
$black: #000000;
```

## 📝 Typography

### Font Family
- **Primary**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Monospace**: 'Courier New', Courier, monospace (cho code)

### Font Sizes
```scss
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
```

### Font Weights
```scss
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 📏 Spacing System

### Base Spacing Unit
```scss
$spacing-unit: 8px;
```

### Spacing Scale
```scss
$spacing-xs: $spacing-unit * 0.5;  // 4px
$spacing-sm: $spacing-unit;        // 8px
$spacing-md: $spacing-unit * 2;    // 16px
$spacing-lg: $spacing-unit * 3;    // 24px
$spacing-xl: $spacing-unit * 4;    // 32px
$spacing-2xl: $spacing-unit * 5;   // 40px
$spacing-3xl: $spacing-unit * 6;   // 48px
```

## 🧩 Component Guidelines

### 1. Layout Structure

#### Page Container
```scss
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
}
```

#### Section Spacing
```scss
.section {
  margin-bottom: $spacing-3xl;
  
  &:last-child {
    margin-bottom: 0;
  }
}
```

### 2. Header Components

#### Page Header
```scss
.page-header {
  text-align: center;
  margin-bottom: $spacing-3xl;
  
  h1 {
    color: $gray-dark;
    margin-bottom: $spacing-sm;
    font-size: $font-size-4xl;
    font-weight: $font-weight-bold;
  }
  
  p {
    color: $gray-light;
    font-size: $font-size-lg;
    margin: 0;
  }
}
```

#### Section Header
```scss
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  h2, h3 {
    color: $gray-dark;
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
  }
}
```

### 3. Card Components

#### Standard Card
```scss
.card {
  background: $white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-lightest;
    
    h3, h4 {
      margin: 0;
      color: $gray-dark;
    }
    
    p {
      margin: $spacing-xs 0 0 0;
      color: $gray-light;
    }
  }
  
  .card-content {
    padding: $spacing-lg;
  }
  
  .card-footer {
    padding: $spacing-md $spacing-lg;
    background: $gray-bg;
    border-top: 1px solid $gray-lightest;
  }
}
```

### 4. Button Components

#### Button Base
```scss
.btn {
  padding: $spacing-sm $spacing-lg;
  border: none;
  border-radius: 6px;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  line-height: 1.5;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.btn-sm {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-xs;
  }
  
  &.btn-lg {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
  }
}
```

#### Button Variants
```scss
.btn-primary {
  background: $primary-blue;
  color: $white;
  
  &:hover:not(:disabled) {
    background: $primary-blue-dark;
    transform: translateY(-1px);
  }
}

.btn-secondary {
  background: $gray-lighter;
  color: $white;
  
  &:hover:not(:disabled) {
    background: $gray-light;
    transform: translateY(-1px);
  }
}

.btn-success {
  background: $success;
  color: $white;
  
  &:hover:not(:disabled) {
    background: darken($success, 10%);
    transform: translateY(-1px);
  }
}

.btn-danger {
  background: $danger;
  color: $white;
  
  &:hover:not(:disabled) {
    background: darken($danger, 10%);
    transform: translateY(-1px);
  }
}

.btn-outline {
  background: transparent;
  color: $primary-blue;
  border: 2px solid $primary-blue;
  
  &:hover:not(:disabled) {
    background: $primary-blue;
    color: $white;
  }
}
```

### 5. Form Components

#### Form Group
```scss
.form-group {
  margin-bottom: $spacing-lg;
  
  label {
    display: block;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-semibold;
    color: $gray-dark;
  }
  
  input, textarea, select {
    width: 100%;
    padding: $spacing-sm;
    border: 2px solid $gray-lightest;
    border-radius: 6px;
    font-size: $font-size-sm;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: $primary-blue;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    
    &.invalid {
      border-color: $danger;
    }
  }
  
  .error-message {
    color: $danger;
    font-size: $font-size-xs;
    margin-top: $spacing-xs;
  }
}
```

### 6. Stats Components

#### Stats Grid
```scss
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-lg;
  
  .stat-card {
    background: $white;
    padding: $spacing-lg;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }
    
    .stat-content {
      h3 {
        font-size: $font-size-2xl;
        color: $gray-dark;
        margin: 0 0 $spacing-xs 0;
        font-weight: $font-weight-bold;
      }
      
      p {
        color: $gray-light;
        margin: 0;
        font-size: $font-size-sm;
      }
    }
  }
}
```

### 7. Table Components

#### Standard Table
```scss
.table-container {
  overflow-x: auto;
  
  .table {
    width: 100%;
    border-collapse: collapse;
    background: $white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    
    th {
      background: $gray-bg;
      color: $gray-dark;
      font-weight: $font-weight-semibold;
      padding: $spacing-md;
      text-align: left;
      border-bottom: 1px solid $gray-lightest;
    }
    
    td {
      padding: $spacing-md;
      border-bottom: 1px solid $gray-lightest;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    tr:hover {
      background: $gray-bg;
    }
  }
}
```

### 8. Badge Components

#### Status Badges
```scss
.badge {
  display: inline-block;
  padding: $spacing-xs $spacing-sm;
  border-radius: 20px;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  
  &.badge-success {
    background: $success-light;
    color: darken($success, 20%);
  }
  
  &.badge-warning {
    background: $warning-light;
    color: darken($warning, 20%);
  }
  
  &.badge-danger {
    background: $danger-light;
    color: darken($danger, 20%);
  }
  
  &.badge-info {
    background: $info-light;
    color: darken($info, 20%);
  }
}
```

## 📱 Responsive Design

### Breakpoints
```scss
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

### Grid System
```scss
.grid {
  display: grid;
  gap: $spacing-lg;
  
  &.grid-1 { grid-template-columns: 1fr; }
  &.grid-2 { grid-template-columns: repeat(2, 1fr); }
  &.grid-3 { grid-template-columns: repeat(3, 1fr); }
  &.grid-4 { grid-template-columns: repeat(4, 1fr); }
  
  @media (max-width: $breakpoint-md) {
    &.grid-2, &.grid-3, &.grid-4 {
      grid-template-columns: 1fr;
    }
  }
}
```

## 🎭 Animation & Transitions

### Standard Transitions
```scss
$transition-fast: 0.15s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

### Hover Effects
```scss
.hover-lift {
  transition: transform $transition-normal;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.hover-scale {
  transition: transform $transition-normal;
  
  &:hover {
    transform: scale(1.05);
  }
}
```

## 🔧 Utility Classes

### Spacing Utilities
```scss
.m-0 { margin: 0; }
.m-1 { margin: $spacing-xs; }
.m-2 { margin: $spacing-sm; }
.m-3 { margin: $spacing-md; }
.m-4 { margin: $spacing-lg; }
.m-5 { margin: $spacing-xl; }

.p-0 { padding: 0; }
.p-1 { padding: $spacing-xs; }
.p-2 { padding: $spacing-sm; }
.p-3 { padding: $spacing-md; }
.p-4 { padding: $spacing-lg; }
.p-5 { padding: $spacing-xl; }
```

### Text Utilities
```scss
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-bold { font-weight: $font-weight-bold; }
.text-muted { color: $gray-light; }
```

### Display Utilities
```scss
.d-none { display: none; }
.d-block { display: block; }
.d-inline { display: inline; }
.d-inline-block { display: inline-block; }
.d-flex { display: flex; }
.d-grid { display: grid; }
```

## 📋 Implementation Checklist

### ✅ Required for All Pages
- [ ] Use consistent page container structure
- [ ] Apply proper spacing system
- [ ] Use standard color palette
- [ ] Implement responsive design
- [ ] Add proper hover effects
- [ ] Use consistent typography
- [ ] Apply standard button styles
- [ ] Use consistent card components
- [ ] Implement proper form styling
- [ ] Add loading and empty states

### ✅ Layout Components
- [ ] Header with navigation
- [ ] Footer with links
- [ ] Consistent page headers
- [ ] Proper section spacing
- [ ] Responsive grid system

### ✅ Interactive Elements
- [ ] Consistent button styles
- [ ] Proper form validation
- [ ] Loading states
- [ ] Error handling
- [ ] Success feedback

## 🚀 Best Practices

1. **Consistency First**: Luôn ưu tiên tính nhất quán trong thiết kế
2. **Mobile First**: Thiết kế cho mobile trước, sau đó mở rộng cho desktop
3. **Performance**: Tối ưu hóa CSS và tránh inline styles
4. **Accessibility**: Đảm bảo accessibility trong mọi component
5. **Documentation**: Ghi chép mọi thay đổi về design system

## 📞 Support

Nếu có thắc mắc về style guidelines, vui lòng liên hệ team design hoặc tham khảo các component mẫu trong codebase.
    