# Hướng dẫn cấu hình AI Explanation

## Tổng quan
Tính năng AI Explanation cho phép học sinh hỏi AI (đóng vai trò giáo viên sinh học THPT) để giải thích câu hỏi và đáp án một cách chi tiết.

## Cấu hình OpenAI API

### 1. Lấy OpenAI API Key
1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng nhập hoặc tạo tài khoản
3. Vào **API Keys** trong menu
4. Tạo API key mới
5. Copy API key (bắt đầu với OpenAI API key prefix)

### 2. Cập nhật API Key
⚠️ **QUAN TRỌNG**: File `ai-config.ts` đã được thêm vào `.gitignore` để bảo mật!

Mở file `src/app/config/ai-config.ts` và thay thế:

```typescript
export const AI_CONFIG = {
  // Thay thế bằng OpenAI API key thực tế của bạn
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY', // ← Thay thế ở đây
  // ... các cấu hình khác
};
```

**Lưu ý bảo mật:**
- ✅ File `ai-config.ts` đã được ignore trong Git
- ✅ Sử dụng `ai-config.template.ts` làm template
- ❌ KHÔNG commit API key lên Git

### 3. Cấu hình Model (Tùy chọn)
Bạn có thể thay đổi model AI trong cùng file:

```typescript
export const AI_CONFIG = {
  OPENAI_API_KEY: 'your-actual-api-key',
  MODEL: 'gpt-3.5-turbo', // hoặc 'gpt-4' cho kết quả tốt hơn
  MAX_TOKENS: 1000,        // Số token tối đa
  TEMPERATURE: 0.7,        // Độ sáng tạo (0-1)
  // ...
};
```

## Cách sử dụng

### 1. Trong màn hình kết quả bài thi
- Sau khi hoàn thành bài thi, học sinh sẽ thấy màn hình review kết quả
- Mỗi câu hỏi sẽ có nút **"🤖 Hỏi AI giải thích"**
- Click nút để AI giải thích câu hỏi và đáp án

### 2. Nội dung giải thích từ AI
AI sẽ giải thích:
- **Tại sao đáp án đúng lại là như vậy?** (Kiến thức sinh học liên quan)
- **Tại sao các đáp án khác lại sai?**
- **Kiến thức sinh học bổ sung** mà học sinh nên biết
- **Lời khuyên** để ghi nhớ kiến thức tốt hơn

### 3. Tính năng
- ✅ **Loading state**: Hiển thị "Đang hỏi AI..." khi đang xử lý
- ✅ **Error handling**: Xử lý lỗi khi không kết nối được AI
- ✅ **Rich formatting**: Hỗ trợ HTML formatting trong câu trả lời
- ✅ **Responsive**: Hoạt động tốt trên mọi thiết bị

## Lưu ý quan trọng

### 1. Chi phí API
- OpenAI tính phí theo số token sử dụng
- GPT-3.5-turbo: ~$0.002/1K tokens
- GPT-4: ~$0.03/1K tokens
- Mỗi câu hỏi thường sử dụng ~200-500 tokens

### 2. Bảo mật
- **KHÔNG** commit API key vào Git
- Sử dụng environment variables trong production
- Có thể tạo proxy server để ẩn API key

### 3. Giới hạn
- OpenAI có rate limit
- Có thể cần retry logic cho production
- Nên cache kết quả để tiết kiệm chi phí

## Troubleshooting

### Lỗi "Invalid API Key"
- Kiểm tra API key có đúng không
- Đảm bảo có credit trong tài khoản OpenAI

### Lỗi "Rate limit exceeded"
- Chờ một lúc rồi thử lại
- Cân nhắc giảm số request đồng thời

### Lỗi "Network error"
- Kiểm tra kết nối internet
- Kiểm tra firewall/proxy settings

## Cải tiến có thể

### 1. Caching
```typescript
// Cache kết quả AI để tránh gọi lại
private cache = new Map<string, string>();
```

### 2. Retry Logic
```typescript
// Retry khi gặp lỗi
.pipe(
  retry(3),
  catchError(this.handleError)
)
```

### 3. Environment Variables
```typescript
// Sử dụng environment variables
OPENAI_API_KEY: environment.openaiApiKey
```

## Support
Nếu gặp vấn đề, vui lòng kiểm tra:
1. API key có đúng không
2. Có credit trong tài khoản OpenAI không
3. Kết nối internet có ổn định không
4. Console có lỗi gì không
