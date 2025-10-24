// Base User Interface
export interface BaseUser {
  id: string;
  username: string;
  email: string;
  role: 'teacher' | 'student';
  name: string;
  createdAt: Date;
  isActive: boolean;
}

// Student User Interface
export interface StudentUser extends BaseUser {
  role: 'student';
  grade: 10 | 11 | 12;
  school: string;
  class: string;
  studentId: string;
  password?: string; // Optional password field
}

// Teacher User Interface
export interface TeacherUser extends BaseUser {
  role: 'teacher';
  teacherId: string;
  school: string;
  subject: string;
  phone: string;
  department: string;
  experience: number; // years of experience
  qualifications: string[];
  isVerified: boolean;
  verificationDocuments?: string[];
}

// Union type for all user types
export type User = StudentUser | TeacherUser;

// Login credentials interface
export interface LoginCredentials {
  username: string;
  password: string;
  role: 'teacher' | 'student';
}

// Registration data interfaces
export interface StudentRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  grade: 10 | 11 | 12;
  school: string;
  class: string;
  studentId: string;
}

export interface TeacherRegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  teacherId: string;
  school: string;
  subject: string;
  phone: string;
  department: string;
  experience: number;
  qualifications: string[];
  verificationDocuments?: File[];
}

// Auth response interface
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
