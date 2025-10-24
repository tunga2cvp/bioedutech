export interface Exercise {
  id: string;
  title: string;
  description: string;
  grade: number; // 10, 11, 12
  chapter: string;
  timeLimit: number; // minutes
  maxScore: number;
  questions: Question[];
  createdAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  retryLimit?: number; // Số lần làm lại cho phép
  showAnswersAfterSubmit?: boolean; // Hiển thị đáp án sau khi nộp bài
  startDate?: Date; // Thời gian bắt đầu
  endDate?: Date; // Thời gian kết thúc
  assignedClasses?: string[]; // Danh sách lớp được phân bổ
  createdBy: string; // ID của giáo viên tạo
}

export interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  options: AnswerOption[];
  type: 'single' | 'multiple';
  explanation?: string;
  order: number; // Thứ tự câu hỏi trong bài tập
}

export interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
  order: number; // Thứ tự đáp án (a, b, c, d)
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number;
  maxScore: number;
  questionsText?: string; // Text format để parse
  questions?: Question[]; // Hoặc danh sách câu hỏi đã parse
  retryLimit?: number;
  showAnswersAfterSubmit?: boolean;
  startDate?: Date;
  endDate?: Date;
  assignedClasses?: string[];
}

export interface QuestionParseResult {
  questions: Question[];
  errors: string[];
}

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string; // Server URL hoặc local URL
  serverFilename?: string; // Filename trên server
  error?: string;
}

export interface ExerciseListFilter {
  grade?: number;
  chapter?: string;
  isPublished?: boolean;
  createdBy?: string;
  searchTerm?: string;
}

export interface ExerciseStats {
  totalExercises: number;
  publishedExercises: number;
  draftExercises: number;
  totalQuestions: number;
  averageQuestionsPerExercise: number;
}
