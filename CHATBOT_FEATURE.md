# Tinh Nang Chatbot Sinh Hoc

Chatbot Sinh hoc la widget hoi dap AI tren landing page. Bot dong vai giao vien Sinh hoc THPT, tra loi bang tieng Viet va dung system prompt trong `ChatbotService`.

## Vi Tri

- Component: `src/app/components/chatbot/`
- Service: `src/app/services/chatbot.service.ts`
- Duoc import trong `LandingPageComponent`.

## Luong Hoat Dong

```text
ChatbotComponent.sendMessage()
  -> ChatbotService.sendMessage(messages)
  -> POST https://api.openai.com/v1/chat/completions
  -> Authorization: Bearer AI_CONFIG.OPENAI_API_KEY
```

## Cau Hinh AI

Frontend doc key tu file local `src/app/config/ai-config.ts`:

```ts
export const AI_CONFIG = {
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  OPENAI_API_KEY: 'YOUR_REAL_OPENAI_API_KEY',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions'
};
```

`src/app/config/ai-config.ts` da nam trong `.gitignore`, khong commit key that. File `ai-config.template.ts` chi de placeholder.

## Cach Chay Local

```bash
npm start
```

Mo:

```text
http://localhost:4200
```

## Tinh Nang

- Floating chat button.
- Chat window popup.
- Message bubbles cho user/assistant.
- Loading state khi cho AI.
- Luu chat history trong localStorage.
- Auto-scroll xuong message moi nhat.
- Error handling khi OpenAI loi.

## Troubleshooting

### OpenAI tra 401/429

- 401: key sai, het han, bi revoke, hoac `ai-config.ts` chua co key that.
- 429: het quota hoac rate limit.

### Console bao CORS toi `api.openai.com`

Day la han che khi goi API truc tiep tu browser. Repo hien dang giu flow cu theo yeu cau; neu can ban on dinh cho production thi nen dua request qua backend.

## File Lien Quan

- `src/app/config/ai-config.ts`
- `src/app/config/ai-config.template.ts`
- `src/app/services/chatbot.service.ts`
- `src/app/components/chatbot/`
