import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { Exercise, ExerciseListFilter, ExerciseStats } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.scss']
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  stats: ExerciseStats | null = null;
  isLoading = false;
  searchTerm = '';
  activeDropdownId: string | null = null;
  showPreviewModal = false;
  selectedExerciseForPreview: Exercise | null = null;
  
  filter: ExerciseListFilter = {
    grade: undefined,
    chapter: '',
    isPublished: undefined,
    searchTerm: ''
  };

  // Các lớp học và chương học
  grades = [
    { value: undefined, label: 'Tất cả lớp' },
    { value: 10, label: 'Lớp 10' },
    { value: 11, label: 'Lớp 11' },
    { value: 12, label: 'Lớp 12' }
  ];

  chapters = [
    'Tất cả chương',
    'Chương 1: Cơ chế di truyền và biến dị',
    'Chương 2: Tính quy luật của hiện tượng di truyền',
    'Chương 3: Di truyền học quần thể',
    'Chương 4: Ứng dụng di truyền học',
    'Chương 5: Tiến hóa',
    'Chương 6: Sinh thái học'
  ];

  statusOptions = [
    { value: undefined, label: 'Tất cả trạng thái' },
    { value: true, label: 'Đã xuất bản' },
    { value: false, label: 'Bản nháp' }
  ];

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
    // Load từ server trực tiếp
    this.exerciseService.loadExercisesFromServer().subscribe({
      next: (exercises) => {
        this.exercises = exercises;
        this.applyFilters();
        this.isLoading = false;
        console.log('Loaded exercises from server:', exercises.length);
        console.log('Sample exercise:', exercises[0]);
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
    // Load stats từ server data thay vì local data
    this.exerciseService.loadExercisesFromServer().subscribe({
      next: (exercises) => {
        // Tính toán stats từ dữ liệu server
        const totalExercises = exercises.length;
        const publishedExercises = exercises.filter(ex => ex.isPublished).length;
        const draftExercises = totalExercises - publishedExercises;
        const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
        const averageQuestionsPerExercise = totalExercises > 0 ? totalQuestions / totalExercises : 0;

        this.stats = {
          totalExercises,
          publishedExercises,
          draftExercises,
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
    let filtered = [...this.exercises];

    // Filter by grade
    if (this.filter.grade !== undefined) {
      filtered = filtered.filter(ex => ex.grade === this.filter.grade);
    }

    // Filter by chapter
    if (this.filter.chapter && this.filter.chapter !== 'Tất cả chương') {
      filtered = filtered.filter(ex => ex.chapter === this.filter.chapter);
    }

    // Filter by published status
    if (this.filter.isPublished !== undefined) {
      filtered = filtered.filter(ex => ex.isPublished === this.filter.isPublished);
    }

    // Filter by search term
    if (this.filter.searchTerm) {
      const searchTerm = this.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(ex => 
        ex.title.toLowerCase().includes(searchTerm) ||
        ex.description.toLowerCase().includes(searchTerm) ||
        ex.chapter.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredExercises = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.filter.searchTerm = this.searchTerm;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filter = {
      grade: undefined,
      chapter: '',
      isPublished: undefined,
      searchTerm: ''
    };
    this.searchTerm = '';
    this.applyFilters();
  }

  createNewExercise(): void {
    this.router.navigate(['/create-exercise']);
  }

  testButtons(): void {
    console.log('Test buttons clicked');
    console.log('Current exercises:', this.exercises);
    console.log('Filtered exercises:', this.filteredExercises);
    if (this.filteredExercises.length > 0) {
      console.log('First exercise:', this.filteredExercises[0]);
      console.log('First exercise ID:', this.filteredExercises[0].id);
      console.log('First exercise title:', this.filteredExercises[0].title);
      this.viewExercise(this.filteredExercises[0]);
    } else {
      alert('Không có bài tập nào để test');
    }
  }

  testNavigation(): void {
    console.log('Test navigation clicked');
    console.log('Current URL:', window.location.href);
    
    // Test navigation to create-exercise
    this.router.navigate(['/create-exercise']).then(
      (success) => {
        console.log('Navigation to create-exercise successful:', success);
        console.log('New URL:', window.location.href);
      },
      (error) => {
        console.error('Navigation to create-exercise failed:', error);
      }
    );
  }

  editExercise(exercise: Exercise): void {
    console.log('Edit exercise clicked:', exercise);
    console.log('Exercise ID:', exercise?.id);
    console.log('Exercise title:', exercise?.title);
    
    if (!exercise) {
      console.error('Exercise object is missing');
      alert('Không thể chỉnh sửa bài tập này. Vui lòng thử lại.');
      return;
    }
    
    if (!exercise.id) {
      console.error('Exercise ID is missing:', exercise);
      alert('Bài tập này chưa có ID. Vui lòng tạo lại bài tập.');
      return;
    }
    
    console.log('Navigating to edit exercise:', exercise.id);
    console.log('Current URL:', window.location.href);
    
    this.router.navigate(['/edit-exercise', exercise.id]).then(
      (success) => {
        console.log('Navigation successful:', success);
        console.log('New URL:', window.location.href);
      },
      (error) => {
        console.error('Navigation failed:', error);
        alert('Không thể chuyển đến trang chỉnh sửa. Vui lòng thử lại.');
      }
    );
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

  publishExercise(exercise: Exercise): void {
    if (confirm(`Bạn có chắc chắn muốn xuất bản bài tập "${exercise.title}"?`)) {
      this.exerciseService.publishExercise(exercise.id).subscribe({
        next: () => {
          alert('Xuất bản bài tập thành công!');
          this.loadExercises();
          this.loadStats();
        },
        error: (error) => {
          alert('Lỗi khi xuất bản bài tập: ' + error);
        }
      });
    }
  }

  unpublishExercise(exercise: Exercise): void {
    if (confirm(`Bạn có chắc chắn muốn hủy xuất bản bài tập "${exercise.title}"?`)) {
      this.exerciseService.updateExercise(exercise.id, { 
        isPublished: false, 
        publishedAt: undefined 
      }).subscribe({
        next: () => {
          alert('Hủy xuất bản bài tập thành công!');
          this.loadExercises();
          this.loadStats();
        },
        error: (error) => {
          alert('Lỗi khi hủy xuất bản bài tập: ' + error);
        }
      });
    }
  }

  deleteExercise(exercise: Exercise): void {
    if (confirm(`Bạn có chắc chắn muốn xóa bài tập "${exercise.title}"? Hành động này không thể hoàn tác.`)) {
      this.exerciseService.deleteExercise(exercise.id).subscribe({
        next: () => {
          alert('Xóa bài tập thành công!');
          this.loadExercises();
          this.loadStats();
        },
        error: (error) => {
          alert('Lỗi khi xóa bài tập: ' + error);
        }
      });
    }
  }

  duplicateExercise(exercise: Exercise): void {
    const duplicatedExercise = {
      ...exercise,
      id: this.generateId(),
      title: exercise.title + ' (Bản sao)',
      isPublished: false,
      publishedAt: undefined,
      createdAt: new Date(),
      questions: exercise.questions.map(q => ({
        ...q,
        id: this.generateId(),
        options: q.options.map(opt => ({
          ...opt,
          id: this.generateId()
        }))
      }))
    };

    this.exerciseService.createExercise(duplicatedExercise).subscribe({
      next: () => {
        alert('Sao chép bài tập thành công!');
        this.loadExercises();
        this.loadStats();
      },
      error: (error) => {
        alert('Lỗi khi sao chép bài tập: ' + error);
      }
    });
  }

  getStatusBadgeClass(exercise: Exercise): string {
    if (exercise.isPublished) {
      return 'badge-published';
    } else {
      return 'badge-draft';
    }
  }

  getStatusText(exercise: Exercise): string {
    return exercise.isPublished ? 'Đã xuất bản' : 'Bản nháp';
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getGradeLabel(grade: number): string {
    return `Lớp ${grade}`;
  }

  getTimeLimitText(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} phút`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} giờ`;
      } else {
        return `${hours} giờ ${remainingMinutes} phút`;
      }
    }
  }

  toggleDropdown(exerciseId: string): void {
    this.activeDropdownId = this.activeDropdownId === exerciseId ? null : exerciseId;
  }

  isDropdownOpen(exerciseId: string): boolean {
    return this.activeDropdownId === exerciseId;
  }

  closeDropdown(): void {
    this.activeDropdownId = null;
  }

  previewExercise(exercise: Exercise): void {
    this.selectedExerciseForPreview = exercise;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedExerciseForPreview = null;
  }

  viewExerciseFromPreview(): void {
    if (this.selectedExerciseForPreview) {
      this.closePreviewModal();
      this.viewExercise(this.selectedExerciseForPreview);
    }
  }

  editExerciseFromPreview(): void {
    if (this.selectedExerciseForPreview) {
      this.closePreviewModal();
      this.editExercise(this.selectedExerciseForPreview);
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  private generateId(): string {
    return 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
