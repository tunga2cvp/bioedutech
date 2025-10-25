import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StudentUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private studentsSubject = new BehaviorSubject<StudentUser[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor() {
    this.loadStudentsFromStorage();
  }

  private loadStudentsFromStorage(): void {
    const stored = localStorage.getItem('students');
    if (stored) {
      try {
        const students = JSON.parse(stored);
        const processedStudents = students.map((student: any) => ({
          ...student,
          createdAt: new Date(student.createdAt)
        }));
        this.studentsSubject.next(processedStudents);
      } catch (error) {
        console.error('Error parsing stored students:', error);
        this.studentsSubject.next([]);
      }
    }
  }

  getStoredStudents(): StudentUser[] {
    return this.studentsSubject.value;
  }

  saveStudent(student: StudentUser): void {
    const students = this.getStoredStudents();
    students.push(student);
    this.updateStudents(students);
  }

  saveStudents(students: StudentUser[]): void {
    const existingStudents = this.getStoredStudents();
    const allStudents = [...existingStudents, ...students];
    this.updateStudents(allStudents);
  }

  updateStudent(updatedStudent: StudentUser): void {
    const students = this.getStoredStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      this.updateStudents(students);
    }
  }

  deleteStudent(studentId: string): void {
    const students = this.getStoredStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);
    this.updateStudents(filteredStudents);
  }

  private updateStudents(students: StudentUser[]): void {
    this.studentsSubject.next(students);
    localStorage.setItem('students', JSON.stringify(students));
  }

  // Check if username exists
  isUsernameExists(username: string): boolean {
    const students = this.getStoredStudents();
    return students.some(s => s.username === username);
  }

  // Check if email exists
  isEmailExists(email: string): boolean {
    const students = this.getStoredStudents();
    return students.some(s => s.email === email);
  }

  // Check if student ID exists
  isStudentIdExists(studentId: string): boolean {
    const students = this.getStoredStudents();
    return students.some(s => s.studentId === studentId);
  }
}
