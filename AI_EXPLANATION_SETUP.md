# AI Explanation Setup

Tinh nang AI Explanation cho phep hoc sinh hoi AI giai thich cau hoi va dap an tren man hinh ket qua bai thi.

## Cau Hinh

App dang dung flow cu: Angular goi thang OpenAI Chat Completions API va doc key tu file local:

```text
src/app/config/ai-config.ts
```

File nay da nam trong `.gitignore`, vi vay khong commit key that len repo.

Vi du cau hinh local:

```ts
export const AI_CONFIG = {
  MODEL: 'gpt-4o-mini',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  OPENAI_API_KEY: 'YOUR_REAL_OPENAI_API_KEY',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions'
};
```

File tracked `src/app/config/ai-config.template.ts` chi de placeholder, khong duoc dien key that vao do.

## Luong Hoat Dong

```text
ExamResultComponent.askAIExplanation()
  -> AIExplanationService.getExplanation()
  -> POST https://api.openai.com/v1/chat/completions
  -> Authorization: Bearer AI_CONFIG.OPENAI_API_KEY
```

## File Lien Quan

- `src/app/config/ai-config.ts`: config local co key that, bi git ignore.
- `src/app/config/ai-config.template.ts`: template khong chua key that.
- `src/app/services/ai-explanation.service.ts`: build prompt va goi OpenAI.

## Troubleshooting

### Loi `401 Invalid API key`

Key sai, het han, bi revoke, hoac `ai-config.ts` van dang de placeholder. Tao key moi tren OpenAI Platform va cap nhat `OPENAI_API_KEY`.

### Loi CORS

Neu browser bao CORS khi goi `https://api.openai.com`, do day la request truc tiep tu frontend. Flow hien tai van giu theo yeu cau "goi thang nhu cu"; neu can xu ly triet de cho production thi nen chuyen sang backend/proxy.

### Loi Push Protection

Khong commit key that vao:

- `src/app/config/ai-config.template.ts`
- docs
- example HTML
- bat ky file tracked nao

Chi dat key that trong `src/app/config/ai-config.ts` local.
