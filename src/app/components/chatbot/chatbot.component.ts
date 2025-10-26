import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  private destroy$ = new Subject<void>();
  private shouldScroll = false;
  private previousIsOpen = false;
  private readonly STORAGE_KEY = 'bioedutech_chat_history_new';
  private readonly MAX_MESSAGES = 10; // Welcome message + 9 messages (5 Q&A pairs = 10 messages)

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // Load lịch sử chat từ localStorage
    this.loadChatHistory();
  }

  private loadChatHistory(): void {
    // TEMPORARILY DISABLED: Không load lịch sử từ localStorage
    // try {
    //   const stored = localStorage.getItem(this.STORAGE_KEY);
    //   if (stored) {
    //     const savedMessages = JSON.parse(stored);
    //     // Convert timestamp strings back to Date objects
    //     this.messages = savedMessages.map((msg: any) => ({
    //       ...msg,
    //       timestamp: new Date(msg.timestamp)
    //     }));
    //   } else {
        // Thêm tin nhắn chào mừng nếu chưa có lịch sử
        this.messages.push({
          role: 'assistant',
          content: 'Chào bạn, Tôi là trợ lý Sinh học của cô Thảo, tôi có thể giúp bạn giải thích các khái niệm sinh học, gợi ý làm bài tập, hoặc trả lời các câu hỏi liên quan đến sinh học. Bạn muốn hỏi gì nào?',
          timestamp: new Date()
        });
    //     this.saveChatHistory();
    //   }
    // } catch (error) {
    //   console.error('Error loading chat history:', error);
    //   // Fallback nếu có lỗi
    //   this.messages.push({
    //     role: 'assistant',
    //     content: 'Chào bạn, Tôi là trợ lý Sinh học của cô Thảo, tôi có thể giúp bạn giải thích các khái niệm sinh học, gợi ý làm bài tập, hoặc trả lời các câu hỏi liên quan đến sinh học. Bạn muốn hỏi gì nào?',
    //     timestamp: new Date()
    //   });
    // }
    this.shouldScroll = true;
  }

  private saveChatHistory(): void {
    // TEMPORARILY DISABLED: Không lưu lịch sử vào localStorage
    return;
    
    // try {
    //   // Trim messages nếu vượt quá MAX_MESSAGES
    //   if (this.messages.length > this.MAX_MESSAGES) {
    //     const welcomeMessage = this.messages[0]; // Giữ tin nhắn chào mừng
    //     // Lấy MAX_MESSAGES - 1 tin nhắn cuối cùng
    //     const recentMessages = this.messages.slice(-(this.MAX_MESSAGES - 1));
    //     this.messages = [welcomeMessage, ...recentMessages];
    //   }
      
    //   localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
    // } catch (error) {
    //   console.error('Error saving chat history:', error);
    // }
  }

  ngAfterViewChecked(): void {
    // Scroll khi mở chat lần đầu
    if (!this.previousIsOpen && this.isOpen) {
      this.shouldScroll = true;
      this.previousIsOpen = true;
    }
    
    if (this.shouldScroll) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 50);
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeChat(): void {
    this.isOpen = false;
    this.previousIsOpen = false; // Reset để scroll lại khi mở
    // KHÔNG reset messages, giữ nguyên lịch sử chat
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.previousIsOpen = false; // Reset để scroll lại khi mở
      // KHÔNG reset messages, giữ nguyên lịch sử chat
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: this.currentMessage.trim(),
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.saveChatHistory(); // Lưu sau khi thêm user message
    this.shouldScroll = true;
    const messageToSend = this.currentMessage.trim();
    this.currentMessage = '';
    this.isLoading = true;

    // Gửi toàn bộ lịch sử chat để AI có context
    this.chatbotService.sendMessage(this.messages)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.messages.push({
              role: 'assistant',
              content: response.message,
              timestamp: new Date()
            });
            this.saveChatHistory(); // Lưu sau khi nhận phản hồi AI
            this.shouldScroll = true;
          } else {
            this.messages.push({
              role: 'assistant',
              content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
              timestamp: new Date()
            });
            this.saveChatHistory();
            this.shouldScroll = true;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.messages.push({
            role: 'assistant',
            content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
            timestamp: new Date()
          });
          this.saveChatHistory();
          this.shouldScroll = true;
        }
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    if (this.chatMessages && this.chatMessages.nativeElement) {
      const element = this.chatMessages.nativeElement;
      // Luôn scroll khi mở chat hoặc có tin nhắn mới
      element.scrollTop = element.scrollHeight;
    }
  }
}

