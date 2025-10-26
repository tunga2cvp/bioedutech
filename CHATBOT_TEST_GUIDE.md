# Hướng Dẫn Test Chatbot

## Test cơ bản

### 1. Kiểm tra UI
- [ ] Icon chat xuất hiện ở góc dưới bên phải
- [ ] Icon có animation pulse
- [ ] Click vào icon mở chat window
- [ ] Chat window có animation slide-in mượt mà
- [ ] Tin nhắn chào mừng hiển thị ngay khi mở
- [ ] Layout responsive (test trên mobile và desktop)

### 2. Test chức năng Chat

#### Gửi tin nhắn
- [ ] Nhập tin nhắn vào input
- [ ] Nhấn Enter để gửi
- [ ] Nhấn nút Send để gửi
- [ ] Input được clear sau khi gửi
- [ ] Tin nhắn người dùng hiển thị bên phải (màu tím)

#### Nhận phản hồi
- [ ] Loading indicator hiển thị (3 dots)
- [ ] Tin nhắn AI hiển thị bên trái (màu xám)
- [ ] Tự động scroll xuống tin nhắn mới
- [ ] Thời gian hiển thị cho mỗi tin nhắn

#### Cuộc hội thoại liên tục
- [ ] Gửi nhiều câu hỏi liên tiếp
- [ ] AI nhớ context từ tin nhắn trước
- [ ] Scroll hoạt động tốt với nhiều tin nhắn

### 3. Test các câu hỏi mẫu

#### Câu hỏi về khái niệm
```
Hỏi: DNA là gì?
Dự kiến: Bot giải thích DNA một cách chi tiết, dễ hiểu
```

#### Câu hỏi về quá trình sinh học
```
Hỏi: Quá trình quang hợp diễn ra như thế nào?
Dự kiến: Bot mô tả chi tiết quá trình quang hợp
```

#### Câu hỏi về hệ sinh thái
```
Hỏi: Các nhóm sinh vật trong hệ sinh thái là gì?
Dự kiến: Bot liệt kê và giải thích các nhóm sinh vật
```

#### Câu hỏi về tế bào
```
Hỏi: Cấu trúc của tế bào động vật gồm những gì?
Dự kiến: Bot mô tả các bộ phận của tế bào động vật
```

## Test lỗi

### 1. Error handling
- [ ] Disable API key để test error
- [ ] Kiểm tra thông báo lỗi hiển thị
- [ ] Kiểm tra app không bị crash

### 2. Edge cases
- [ ] Gửi tin nhắn rỗng (không cho phép)
- [ ] Gửi tin nhắn rất dài
- [ ] Gửi tin nhắn đặc biệt (emoji, ký tự lạ)
- [ ] Đóng chat khi đang loading

### 3. State management
- [ ] Mở/đóng chat nhiều lần
- [ ] Gửi tin nhắn rồi đóng chat
- [ ] Mở lại chat (reset về chào mừng)
- [ ] Nhiều tin nhắn -> scroll xuống
- [ ] Test trên các trang khác nhau

## Test Responsive

### Desktop (1920x1080)
- [ ] Chat button ở góc phải
- [ ] Chat window size 380x600px
- [ ] Layout đẹp, không bị overflow

### Tablet (768x1024)
- [ ] Chat window vẫn hiển thị tốt
- [ ] Tin nhắn không bị quá dài

### Mobile (375x667)
- [ ] Chat window full width - 40px
- [ ] Height 100vh - 100px
- [ ] Có thể scroll tin nhắn dễ dàng
- [ ] Input và button dễ sử dụng

## Performance Test

### 1. Load time
- [ ] App load không bị chậm
- [ ] Chat window mở nhanh
- [ ] Animation mượt mà (60fps)

### 2. Memory
- [ ] Không có memory leak
- [ ] Component destroy clean
- [ ] Subscription được unsubscribe

### 3. Network
- [ ] API call thành công
- [ ] Response time hợp lý (< 5s)
- [ ] Retry khi fail (nếu có)

## Test câu hỏi chi tiết

### Câu hỏi 1: DNA và RNA
```
User: Sự khác biệt giữa DNA và RNA là gì?
```
**Đánh giá:**
- Bot giải thích được cấu trúc khác nhau
- Bot nêu được chức năng khác nhau
- Ngôn ngữ dễ hiểu, sinh viên có thể hiểu

### Câu hỏi 2: Quá trình phân chia tế bào
```
User: Tôi không hiểu quá trình nguyên phân. Bạn giải thích giúp tôi được không?
```
**Đánh giá:**
- Bot mô tả các giai đoạn của nguyên phân
- Bot giải thích mục đích của nguyên phân
- Bot có ví dụ cụ thể

### Câu hỏi 3: Hệ sinh thái rừng
```
User: Trong rừng nhiệt đới, các mối quan hệ giữa sinh vật là gì?
```
**Đánh giá:**
- Bot liệt kê được các mối quan hệ (cộng sinh, ký sinh, con mồi-con thú)
- Bot giải thích từng loại quan hệ
- Bot đưa ra ví dụ cụ thể

### Câu hỏi 4: Bài tập
```
User: Có 2n = 14, vậy có bao nhiêu nhiễm sắc thể ở kỳ sau của nguyên phân?
```
**Đánh giá:**
- Bot tính toán đúng
- Bot giải thích vì sao có số lượng đó
- Bot trình bày cách làm rõ ràng

### Câu hỏi 5: Khái niệm khó
```
User: Cơ chế hoạt động của quang hợp ở thực vật C3, C4, CAM khác nhau như thế nào?
```
**Đánh giá:**
- Bot so sánh được 3 nhóm thực vật
- Bot giải thích sự khác biệt về cơ chế
- Bot đưa ra ví dụ cụ thể

## Checklist Test tổng thể

### Tính năng Chatbot
- [x] Service xử lý API
- [x] Component hiển thị UI
- [x] Tích hợp vào app
- [x] Auto-scroll
- [x] Loading state
- [x] Error handling
- [x] Responsive design
- [x] Animation mượt mà

### Giao diện
- [x] Chat button đẹp
- [x] Chat window popup
- [x] Message bubbles
- [x] Timestamp
- [x] Avatar và header
- [x] Input và send button

### Chức năng AI
- [x] Kết nối với OpenAI
- [x] Context management
- [x] System prompt phù hợp
- [x] Trả lời chính xác
- [x] Ngôn ngữ thân thiện

### Edge Cases
- [ ] Không API key -> error message
- [ ] API fail -> error message
- [ ] Tin nhắn rỗng -> không gửi
- [ ] Đóng chat khi loading -> handle clean

## Cách test thủ công

1. **Chạy app:**
   ```bash
   ng serve
   ```

2. **Mở browser:**
   ```
   http://localhost:4200
   ```

3. **Test các bước:**
   - Click icon chat
   - Gửi câu hỏi: "DNA là gì?"
   - Kiểm tra phản hồi từ AI
   - Test thêm các câu hỏi khác
   - Đóng và mở lại chat
   - Test trên mobile

## Ghi chú

- Chatbot sử dụng OpenAI GPT-4o-mini
- Mỗi lần gửi tin nhắn tốn API credits
- Kiểm tra API key trong `src/app/config/ai-config.ts`
- Monitor API usage trong OpenAI dashboard

