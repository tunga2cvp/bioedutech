# 🔍 API Upload Image Debug Guide

## 📋 Tổng Quan

Đã **cập nhật và thêm debug method** để kiểm tra API upload ảnh theo đúng documentation từ [https://chimeara.pythonanywhere.com/apidocs/#/Teacher/post_images](https://chimeara.pythonanywhere.com/apidocs/#/Teacher/post_images).

## ✅ **Thay Đổi Chính**

### 1. **Loại Bỏ Content-Type Header**
- ❌ **Trước**: Set `Content-Type: multipart/form-data`
- ✅ **Sau**: Để Angular tự động set với boundary

### 2. **Thêm Debug Method**
- ✅ **Method**: `debugUploadImage()` với `observe: 'response'`
- ✅ **Logging**: Chi tiết request và response
- ✅ **Error handling**: Xem full error details

## 🔧 **Code Changes**

### Updated Files

#### 1. `api.service.ts`
```typescript
// Upload ảnh chính
uploadImage(file: File): Observable<ImageUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Không set Content-Type header để Angular tự động set với boundary
  return this.http.post<ImageUploadResponse>(`${this.baseUrl}/images`, formData).pipe(
    tap((response: ImageUploadResponse) => {
      console.log('✅ Image uploaded successfully:', response);
    }),
    catchError(error => {
      console.error('❌ Error uploading image:', error);
      return throwError(() => error);
    })
  );
}

// Debug method để test API
debugUploadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  console.log('🔍 Debug upload image:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    formDataKeys: Array.from(formData.keys()),
    url: `${this.baseUrl}/images`
  });

  return this.http.post(`${this.baseUrl}/images`, formData, {
    observe: 'response' // Để xem full response
  }).pipe(
    tap(response => {
      console.log('🔍 Debug response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: response.body
      });
    }),
    catchError(error => {
      console.error('🔍 Debug error:', {
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: error.message
      });
      return throwError(() => error);
    })
  );
}
```

## 🎯 **API Specification**

### Request Format
```http
POST /images
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

FormData:
- file: [Image File]
```

### Response Format
```json
// Success (201)
{
  "path": "string",
  "success": true
}

// Error (400)
{
  "error": "bad request / invalid image"
}

// Error (500)
{
  "error": "save failed"
}
```

## 🧪 **Debug Steps**

### 1. **Sử dụng Debug Method**
```typescript
// Trong component hoặc service
this.apiService.debugUploadImage(file).subscribe({
  next: (response) => {
    console.log('Debug success:', response);
  },
  error: (error) => {
    console.log('Debug error:', error);
  }
});
```

### 2. **Kiểm Tra Console Logs**
```
🔍 Debug upload image: {
  fileName: "test.jpg",
  fileSize: 12345,
  fileType: "image/jpeg",
  formDataKeys: ["file"],
  url: "https://chimeara.pythonanywhere.com/images"
}

🔍 Debug error: {
  status: 400,
  statusText: "Bad Request",
  error: { error: "bad request / invalid image" },
  message: "Http failure response for https://chimeara.pythonanywhere.com/images: 400 Bad Request"
}
```

### 3. **Kiểm Tra Network Tab**
- **Request URL**: `https://chimeara.pythonanywhere.com/images`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data; boundary=...`
- **Form Data**: `file: [Image File]`

## 🔍 **Troubleshooting**

### Common Issues

#### 1. **400 Bad Request**
- ✅ **Check file type**: Chỉ JPG, PNG, GIF
- ✅ **Check file size**: Không quá 5MB
- ✅ **Check file integrity**: File không bị hỏng
- ✅ **Check parameter name**: Phải là `file`

#### 2. **Content-Type Issues**
- ✅ **Don't set manually**: Để Angular tự động set
- ✅ **Boundary required**: Multipart cần boundary
- ✅ **FormData only**: Chỉ dùng FormData

#### 3. **CORS Issues**
- ✅ **Check origin**: Đảm bảo domain được allow
- ✅ **Check headers**: Có thể cần headers khác

## 📊 **Expected Results**

### Success Case
```json
{
  "path": "https://chimeara.pythonanywhere.com/images/filename.jpg",
  "success": true
}
```

### Error Cases
```json
// 400 - Bad request
{
  "error": "bad request / invalid image"
}

// 500 - Save failed
{
  "error": "save failed"
}
```

## 🎉 **Next Steps**

### 1. **Test với Debug Method**
- Sử dụng `debugUploadImage()` để xem chi tiết
- Kiểm tra console logs
- Xem Network tab trong DevTools

### 2. **Kiểm Tra File**
- Đảm bảo file hợp lệ
- Kiểm tra file type và size
- Test với file khác nhau

### 3. **Contact Support**
- Nếu vẫn lỗi 400, có thể cần liên hệ support
- Cung cấp debug logs
- Cung cấp file test case

---

**Tình trạng**: 🔍 **DEBUG MODE**
**Ngày cập nhật**: 24/10/2025
**Tác giả**: AI Assistant
**API Reference**: [https://chimeara.pythonanywhere.com/apidocs/#/Teacher/post_images](https://chimeara.pythonanywhere.com/apidocs/#/Teacher/post_images)
