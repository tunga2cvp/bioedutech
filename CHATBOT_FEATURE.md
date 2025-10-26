# Tính Năng Chatbot Sinh Học

## Tổng quan
Tính năng chatbot được tích hợp vào ứng dụng BioEduTech, cho phép học sinh tương tác với một chatbot đóng vai trò như giáo viên dạy sinh học cấp 3. Chatbot này có thể giải thích các khái niệm sinh học, hướng dẫn làm bài tập và trả lời các câu hỏi liên quan đến sinh học.

## Vị trí và Cách sử dụng
- **Vị trí**: Bot được đặt cố định ở góc dưới bên phải màn hình trên tất cả các trang
- **Cách mở**: Click vào icon chat màu tím để mở/đóng cửa sổ chat
- **Cách sử dụng**: Nhập câu hỏi vào ô input và nhấn Enter hoặc click nút Send

## Tính năng chính

### 1. Giao diện
- Chat button với gradient tím ở góc dưới bên phải
- Animation pulse thu hút sự chú ý
- Chat window popup với thiết kế hiện đại
- Responsive design, hoạt động tốt trên mọi thiết bị

### 2. Chức năng Chat
- Nhận tin nhắn từ người dùng
- Trả lời ngay lập tức với AI OpenAI GPT-4
- Hiển thị loading indicator khi AI đang xử lý
- Tự động scroll xuống tin nhắn mới nhất
- Hiển thị thời gian của mỗi tin nhắn
- Phân biệt tin nhắn người dùng (phải) và bot (trái)

### 3. AI Personality
Chatbot được cấu hình với personality như giáo viên Sinh học:
- Trả lời chính xác, dễ hiểu về sinh học
- Giải thích chi tiết các khái niệm
- Hướng dẫn làm bài tập
- Ngôn ngữ thân thiện, gần gũi
- Đưa ra ví dụ cụ thể
- Khuyến khích và động viên học sinh

## Cấu trúc File

### Service
- `src/app/services/chatbot.service.ts`
  - Xử lý giao tiếp với OpenAI API
  - Format messages theo chuẩn OpenAI
  - Error handling
  - Type definitions cho ChatMessage và ChatResponse

### Component
- `src/app/components/chatbot/chatbot.component.ts`
  - Quản lý state của chat window (mở/đóng)
  - Quản lý messages array
  - Xử lý send message
  - Auto-scroll
  - Loading state management

- `src/app/components/chatbot/chatbot.component.html`
  - UI structure cho chat button và chat window
  - Tin nhắn hiển thị
  - Input field
  - Loading indicator

- `src/app/components/chatbot/chatbot.component.scss`
  - Styling cho chat button (fixed position, gradient, animation)
  - Styling cho chat window (popup, responsive)
  - Styling cho messages (bubbles, timestamps)
  - Animation effects (slideIn, pulse, typing)

### Integration
- `src/app/app.component.ts` - Import và sử dụng ChatbotComponent
- `src/app/app.component.html` - Thêm `<app-chatbot></app-chatbot>` tag

## Cấu hình

### API Key
API key được cấu hình trong `src/app/config/ai-config.ts`:
```typescript
OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY'
OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions'
MODEL: 'gpt-4o-mini'
MAX_TOKENS: 1000
TEMPERATURE: 0.7
```

### System Prompt
Chatbot được cấu hình với system prompt chi tiết để đóng vai trò giáo viên Sinh học, đảm bảo:
- Trả lời chính xác về sinh học
- Giải thích dễ hiểu
- Ngôn ngữ thân thiện
- Có ví dụ cụ thể

## Tính năng Kỹ thuật

### Auto-scroll
Component tự động scroll xuống tin nhắn mới nhất khi:
- Gửi tin nhắn mới
- Nhận phản hồi từ AI
- Mở chat window lần đầu

### Loading State
- Hiển thị typing indicator khi đang xử lý
- Disable input và send button khi loading
- Hiển thị 3 dots animation

### Error Handling
- Hiển thị thông báo lỗi khi API fail
- Thông báo user-friendly
- Không làm crash ứng dụng

### Context Management
- Gửi toàn bộ lịch sử chat để AI có context
- AI có thể tham chiếu câu hỏi trước
- Cuộc hội thoại liền mạch

### State Reset
- Khi đóng chat và mở lại, reset về tin nhắn chào mừng
- Giữ tin nhắn chào mừng để user biết cách sử dụng

## Responsive Design
- Desktop: Chat window 380x600px
- Mobile: Full width - 40px, height là 100vh - 100px
- Chat button luôn visible ở góc dưới phải
- Scrollable message list

## Testing
Để test tính năng chatbot:
1. Chạy ứng dụng với `ng serve`
2. Kiểm tra icon chat xuất hiện ở góc dưới phải
3. Click để mở chat window
4. Gửi một câu hỏi sinh học
5. Kiểm tra phản hồi từ AI
6. Test auto-scroll
7. Test loading state
8. Test error handling (nếu có)

## Lưu ý

### API Key Security
- API key hiện đang hard-code trong config file
- **CẦN**: Chuyển sang environment variables để bảo mật hơn
- **KHÔNG**: Commit API key lên git public

### Cost Management
- Mỗi tin nhắn tốn token OpenAI
- Monitor API usage thường xuyên
- Có thể cần rate limiting cho user

### Future Improvements
- [ ] Lưu lịch sử chat vào localStorage
- [ ] Thêm quick questions templates
- [ ] Tích hợp với bài tập sinh học cụ thể
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Share chat history
- [ ] Export chat as PDF
- [ ] Admin dashboard để monitor chats

## Sử dụng API

### ChatbotService.sendMessage()
```typescript
const messages: ChatMessage[] = [
  { role: 'user', content: 'What is DNA?', timestamp: new Date() }
];

chatbotService.sendMessage(messages).subscribe({
  next: (response) => {
    console.log('AI Response:', response.message);
  },
  error: (error) => {
    console.error('Error:', error);
  }
});
```

### ChatMessage Interface
```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Dependencies
- `@angular/core` - Component lifecycle, ViewChild
- `@angular/common` - CommonModule, Date pipe
- `@angular/forms` - FormsModule, ngModel
- `@angular/common/http` - HttpClient
- `rxjs` - Observables, Subject, operators

## Troubleshooting

### Chatbot không hiển thị
- Kiểm tra import ChatbotComponent trong app.component
- Kiểm tra selector `app-chatbot` trong HTML

### API không hoạt động
- Kiểm tra API key trong ai-config.ts
- Kiểm tra network connectivity
- Check console errors

### Messages không scroll
- Kiểm tra ViewChild reference
- Đảm bảo ngAfterViewChecked implement đúng

## Documentation
- File này: `CHATBOT_FEATURE.md`
- Service: `src/app/services/chatbot.service.ts`
- Component: `src/app/components/chatbot/`

