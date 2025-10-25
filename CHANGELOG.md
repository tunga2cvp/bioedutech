# Changelog

Tất cả các thay đổi quan trọng của dự án BioEduTech sẽ được ghi lại trong file này.

## [2.0.0] - 2024-12-19

### 🎯 Major Changes - Simplified Exercise Management
- **BREAKING**: Đơn giản hóa hoàn toàn giao diện quản lý bài tập
- **BREAKING**: Loại bỏ cơ chế bản nháp và xuất bản
- **BREAKING**: Chỉ giữ lại chức năng xem bài tập

### ✨ Added
- **Exercise Card Component**: Component riêng biệt cho thẻ bài tập
- **Simplified View Exercise**: Hiển thị toàn bộ nội dung bài tập cùng lúc
- **Image API Integration**: Sử dụng API GET `/images/{filename}` để hiển thị ảnh
- **Clean UI Design**: Layout đẹp và responsive cho view exercise

### 🔄 Changed
- **Exercise List**: Chỉ có nút "Xem bài thi" duy nhất
- **View Exercise**: Hiển thị tất cả câu hỏi và đáp án đúng
- **API Integration**: Cập nhật để sử dụng cấu trúc API mới
- **Component Structure**: Tách exercise card thành component riêng

### 🗑️ Removed
- **Draft Mechanism**: Loại bỏ hoàn toàn cơ chế bản nháp
- **Edit/Delete Buttons**: Loại bỏ các nút chỉnh sửa và xóa
- **Preview Modal**: Loại bỏ modal xem nhanh
- **Complex Filters**: Chỉ giữ lại tìm kiếm theo tên
- **Exercise Stats**: Loại bỏ thống kê phức tạp

### 🐛 Fixed
- **API ID Mapping**: Sửa lỗi mapping `test_id` vs `id` từ API
- **Question Conversion**: Sửa lỗi convert questions từ API response
- **Image Display**: Sửa lỗi hiển thị hình ảnh qua API
- **Type Safety**: Sửa tất cả TypeScript errors
- **SCSS Syntax**: Sửa lỗi unmatched braces trong SCSS

### 🔧 Technical Improvements
- **Code Cleanup**: Loại bỏ code không cần thiết
- **Type Safety**: Cải thiện type safety với proper interfaces
- **Error Handling**: Thêm error handling cho API calls
- **Performance**: Tối ưu hóa rendering và data flow

## [1.5.0] - 2024-12-18

### ✨ Added
- **API Response Structure**: Cập nhật để match với cấu trúc API thực tế
- **TestDetailApiResponse**: Interface mới cho API response structure
- **Question Safety Checks**: Thêm safety checks cho questions array
- **Enhanced Logging**: Thêm detailed logging cho debugging

### 🔄 Changed
- **API Interfaces**: Cập nhật TestListItem và TestDetailResponse
- **Data Conversion**: Cải thiện convertTestToExercise method
- **Error Handling**: Cải thiện error handling trong API calls

### 🐛 Fixed
- **Questions Undefined**: Sửa lỗi testDetail.questions undefined
- **Type Assertions**: Sửa type assertions cho question type
- **API Field Mapping**: Sửa mapping question_count từ API

## [1.4.0] - 2024-12-17

### ✨ Added
- **Server ID Integration**: Sử dụng server test_id làm exercise ID
- **API Field Updates**: Cập nhật để sử dụng question_count từ API
- **Enhanced Error Handling**: Thêm error handling cho missing fields

### 🔄 Changed
- **ID Generation**: Sử dụng server ID thay vì generate local ID
- **Field Mapping**: Cập nhật mapping các fields từ API
- **Error Messages**: Cải thiện error messages và logging

### 🐛 Fixed
- **ID Mismatch**: Sửa lỗi API trả về `id` nhưng code tìm `test_id`
- **Field Names**: Sửa tên fields để match với API response
- **Type Errors**: Sửa các TypeScript compilation errors

## [1.3.0] - 2024-12-16

### ✨ Added
- **Direct API Integration**: Kết nối trực tiếp với backend API
- **Image Upload**: Tính năng upload hình ảnh cho câu hỏi
- **Base64 Image Support**: Hỗ trợ hiển thị hình ảnh base64

### 🔄 Changed
- **API Service**: Cập nhật ApiService với các endpoints mới
- **Exercise Service**: Cập nhật để sử dụng API thay vì localStorage
- **Data Models**: Cập nhật models để match với API structure

### 🐛 Fixed
- **API Integration**: Sửa các lỗi kết nối API
- **Data Conversion**: Sửa lỗi convert data từ API sang local models
- **Image Handling**: Sửa lỗi hiển thị hình ảnh

## [1.2.0] - 2024-12-15

### ✨ Added
- **Form Simplification**: Đơn giản hóa form tạo bài tập
- **Exercise Management**: Cải thiện quản lý bài tập
- **UI Improvements**: Cải thiện giao diện người dùng

### 🔄 Changed
- **Form Structure**: Đơn giản hóa cấu trúc form
- **Validation**: Cải thiện validation logic
- **Styling**: Cập nhật CSS và responsive design

### 🐛 Fixed
- **Form Validation**: Sửa lỗi validation forms
- **UI Bugs**: Sửa các lỗi giao diện
- **Navigation**: Sửa lỗi navigation giữa các trang

## [1.1.0] - 2024-12-14

### ✨ Added
- **Demo Component Removal**: Loại bỏ demo components không cần thiết
- **Code Cleanup**: Dọn dẹp code và loại bỏ dependencies không cần thiết
- **Performance Optimization**: Tối ưu hóa performance

### 🔄 Changed
- **Component Structure**: Cải thiện cấu trúc components
- **Service Architecture**: Cải thiện kiến trúc services
- **Build Process**: Cải thiện quá trình build

### 🐛 Fixed
- **Build Errors**: Sửa các lỗi build
- **Dependency Issues**: Sửa các vấn đề dependencies
- **Performance Issues**: Sửa các vấn đề performance

## [1.0.0] - 2024-12-13

### 🎉 Initial Release
- **Core Features**: Tính năng cơ bản quản lý bài tập
- **Exercise CRUD**: Tạo, đọc, cập nhật, xóa bài tập
- **Question Management**: Quản lý câu hỏi và đáp án
- **User Interface**: Giao diện người dùng cơ bản
- **Authentication**: Hệ thống đăng nhập cơ bản

### ✨ Features
- **Exercise List**: Danh sách bài tập với filter và search
- **Exercise Creation**: Tạo bài tập mới với form validation
- **Exercise View**: Xem chi tiết bài tập
- **Exercise Edit**: Chỉnh sửa bài tập
- **Exercise Delete**: Xóa bài tập
- **Draft System**: Hệ thống bản nháp và xuất bản
- **Statistics**: Thống kê bài tập và câu hỏi

### 🔧 Technical Stack
- **Angular 17**: Frontend framework
- **TypeScript**: Programming language
- **SCSS**: Styling
- **RxJS**: Reactive programming
- **Angular Material**: UI components (planned)

---

## Migration Guide

### From v1.x to v2.0

#### Breaking Changes
1. **Exercise Card**: Chỉ có nút "Xem bài thi", loại bỏ các nút khác
2. **View Exercise**: Hiển thị toàn bộ nội dung thay vì trang làm bài
3. **API Structure**: Cập nhật để sử dụng cấu trúc API mới
4. **Component Structure**: Tách exercise card thành component riêng

#### Migration Steps
1. **Update Dependencies**: Cập nhật các dependencies
2. **Update API Calls**: Cập nhật các API calls để match với structure mới
3. **Update Components**: Cập nhật components để sử dụng structure mới
4. **Test Functionality**: Test tất cả functionality sau khi migrate

### From v0.x to v1.0

#### Breaking Changes
1. **API Integration**: Chuyển từ localStorage sang API
2. **Component Structure**: Cải thiện component structure
3. **Service Architecture**: Cải thiện service architecture

#### Migration Steps
1. **Backup Data**: Backup dữ liệu localStorage
2. **Update API**: Cập nhật API endpoints
3. **Update Services**: Cập nhật services để sử dụng API
4. **Data Migration**: Migrate dữ liệu từ localStorage sang API

---

## Support

### Version Support
- **v2.0+**: Full support với bug fixes và features
- **v1.x**: Security updates only
- **v0.x**: No longer supported

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Node.js Support
- **Node.js**: 18+
- **npm**: 8+
- **Angular CLI**: 17+

---

**Lưu ý**: Changelog này được cập nhật thường xuyên để phản ánh các thay đổi quan trọng trong dự án.