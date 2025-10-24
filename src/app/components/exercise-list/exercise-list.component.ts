import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { Exercise, ExerciseStats } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, ExerciseCardComponent],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss']
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  stats: ExerciseStats | null = null;
  isLoading = false;
  searchTerm = '';

  constructor(
    private exerciseService: ExerciseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadExercises();
    this.loadStats();
  }

  loadExercises(): void {
    this.isLoading = true;
    console.log('🔄 Starting to load exercises...');
    // Load từ server trực tiếp
    this.exerciseService.loadExercisesFromServer().subscribe({
      next: (exercises) => {
        console.log('📥 Received exercises from service:', exercises.length);
        console.log('📋 Exercises data:', exercises);
        this.exercises = exercises;
        console.log('📊 this.exercises after assignment:', this.exercises.length);
        this.applyFilters();
        console.log('🔍 this.filteredExercises after applyFilters:', this.filteredExercises.length);
        console.log('🔍 filteredExercises data:', this.filteredExercises);
        this.isLoading = false;
        console.log('✅ Loading completed. isLoading:', this.isLoading);
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách bài tập từ server:', error);
        // Fallback to local data
        this.exerciseService.getExercises().subscribe({
          next: (exercises) => {
            this.exercises = exercises;
            this.applyFilters();
            this.isLoading = false;
          },
          error: (fallbackError) => {
            console.error('Lỗi khi tải danh sách bài tập:', fallbackError);
            this.isLoading = false;
          }
        });
      }
    });
  }

  loadStats(): void {
    // Load stats từ server data
    this.exerciseService.loadExercisesFromServer().subscribe({
      next: (exercises) => {
        // Tính toán stats từ dữ liệu server - bỏ cơ chế bản nháp
        const totalExercises = exercises.length;
        const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
        const averageQuestionsPerExercise = totalExercises > 0 ? totalQuestions / totalExercises : 0;

        this.stats = {
          totalExercises,
          publishedExercises: totalExercises, // Tất cả bài tập đều được coi là đã xuất bản
          totalQuestions,
          averageQuestionsPerExercise
        };
      },
      error: (error) => {
        console.error('Lỗi khi tải thống kê:', error);
        // Fallback to local stats
        this.exerciseService.getExerciseStats().subscribe({
          next: (stats) => {
            this.stats = stats;
          }
        });
      }
    });
  }

  applyFilters(): void {
    console.log('🔍 applyFilters called with this.exercises.length:', this.exercises.length);
    let filtered = [...this.exercises];
    console.log('🔍 Initial filtered array length:', filtered.length);

    // Chỉ lọc theo tên bài tập
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchTerm = this.searchTerm.toLowerCase().trim();
      console.log('🔍 Filtering by search term:', searchTerm);
      filtered = filtered.filter(ex => 
        ex.title.toLowerCase().includes(searchTerm)
      );
      console.log('🔍 After search filter, filtered length:', filtered.length);
    }

    this.filteredExercises = filtered;
    console.log('🔍 Final filteredExercises length:', this.filteredExercises.length);
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  createNewExercise(): void {
    this.router.navigate(['/create-exercise']);
  }



  viewExercise(exercise: Exercise, event?: Event): void {
    console.log('=== VIEW EXERCISE CLICKED ===');
    console.log('Exercise object:', exercise);
    console.log('Exercise ID:', exercise?.id);
    console.log('Exercise title:', exercise?.title);
    console.log('Current URL before navigation:', window.location.href);
    
    if (!exercise) {
      console.error('Exercise object is missing');
      alert('Không thể xem bài tập này. Vui lòng thử lại.');
      return;
    }
    
    if (!exercise.id) {
      console.error('Exercise ID is missing:', exercise);
      alert('Bài tập này chưa có ID. Vui lòng tạo lại bài tập.');
      return;
    }
    
    console.log('About to navigate to:', `/view-exercise/${exercise.id}`);
    console.log('Router object:', this.router);
    
    // Prevent default behavior if event is provided
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.router.navigate(['/view-exercise', exercise.id]).then(
      (success) => {
        console.log('✅ Navigation successful:', success);
        console.log('New URL after navigation:', window.location.href);
        if (!success) {
          console.error('Navigation returned false - route may not exist');
        }
      },
      (error) => {
        console.error('❌ Navigation failed:', error);
        alert('Không thể chuyển đến trang xem bài tập. Vui lòng thử lại.');
      }
    );
  }







  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  private generateId(): string {
    return 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
