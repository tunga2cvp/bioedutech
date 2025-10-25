import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AI_CONFIG } from '../config/ai-config';

export interface AIExplanationRequest {
  question: string;
  answers: string[];
  correctAnswers: number[];
  userAnswers: number[];
  explanation?: string;
}

export interface AIExplanationResponse {
  explanation: string;
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIExplanationService {
  private readonly OPENAI_API_URL = AI_CONFIG.OPENAI_API_URL;
  private readonly API_KEY = AI_CONFIG.OPENAI_API_KEY;

  constructor(private http: HttpClient) {}

  getExplanation(request: AIExplanationRequest): Observable<AIExplanationResponse> {
    const prompt = this.buildPrompt(request);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.API_KEY}`
    });

    const body = {
      model: 'gpt-4o-mini', // Sử dụng cùng model như example
      messages: [
        {
          role: 'system',
          content: 'Bạn là giáo viên Sinh học cấp 3, luôn trả lời chính xác và giải thích rõ ràng.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7 // Sử dụng cùng temperature như example
    };

    return this.http.post<any>(this.OPENAI_API_URL, body, { headers }).pipe(
      map(response => {
        if (response.choices && response.choices.length > 0) {
          return {
            explanation: response.choices[0].message.content,
            success: true
          };
        } else {
          return {
            explanation: '',
            success: false,
            error: 'Không nhận được phản hồi từ AI'
          };
        }
      }),
      catchError(error => {
        console.error('AI Explanation Error:', error);
        return [{
          explanation: '',
          success: false,
          error: 'Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.'
        }];
      })
    );
  }

  private buildPrompt(request: AIExplanationRequest): string {
    // Tạo câu hỏi theo format của example
    const questionText = `${request.question}\n${request.answers.map((answer, index) => 
      `${String.fromCharCode(97 + index)}) ${answer}`
    ).join('\n')}`;

    // Tạo danh sách đáp án đúng
    const correctAnswers = request.correctAnswers.map(index => 
      `${String.fromCharCode(97 + index)}) ${request.answers[index]}`
    ).join('\n');

    return `
Bạn là giáo viên Sinh học cấp 3. Hãy đọc câu hỏi trắc nghiệm dưới đây và:
1. Xác định đáp án đúng (chỉ rõ lựa chọn nào, ví dụ: b)).
2. Giải thích vì sao đáp án đó đúng và các đáp án khác sai.

Câu hỏi:
${questionText}

ĐÁP ÁN ĐÚNG:
${correctAnswers}
    `.trim();
  }
}
