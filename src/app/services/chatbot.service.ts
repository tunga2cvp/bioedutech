import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AI_CONFIG } from '../config/ai-config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly OPENAI_API_URL = AI_CONFIG.OPENAI_API_URL;
  private readonly API_KEY = AI_CONFIG.OPENAI_API_KEY;

  constructor(private http: HttpClient) {}

  sendMessage(messages: ChatMessage[]): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.API_KEY}`
    });

    // Chuyển đổi messages sang format OpenAI
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const body = {
      model: AI_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content: `Bạn là giáo viên Sinh học cấp 3 với kiến thức chuyên sâu về sinh học. Nhiệm vụ của bạn là:
- Trả lời các câu hỏi liên quan đến sinh học một cách chính xác, dễ hiểu
- Giải thích các khái niệm sinh học một cách chi tiết
- Hướng dẫn học sinh làm bài tập sinh học
- Sử dụng ngôn ngữ thân thiện, gần gũi như một giáo viên thực sự
- Đưa ra ví dụ cụ thể để học sinh dễ hiểu hơn
- Luôn khuyến khích và động viên học sinh

Hãy trả lời bằng tiếng Việt, súc tích nhưng đầy đủ thông tin.`
        },
        ...formattedMessages
      ],
      temperature: AI_CONFIG.TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS
    };

    return this.http.post<any>(this.OPENAI_API_URL, body, { headers }).pipe(
      map(response => {
        if (response.choices && response.choices.length > 0) {
          return {
            message: response.choices[0].message.content,
            success: true
          };
        } else {
          return {
            message: '',
            success: false,
            error: 'Không nhận được phản hồi từ AI'
          };
        }
      }),
      catchError(error => {
        console.error('Chatbot Error:', error);
        return throwError(() => ({
          message: '',
          success: false,
          error: 'Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.'
        }));
      })
    );
  }
}

