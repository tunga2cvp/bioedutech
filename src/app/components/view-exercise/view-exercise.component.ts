import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { ApiService } from '../../services/api.service';
import { Exercise } from '../../models/exercise.model';
import { TeacherHeaderComponent } from '../teacher-header/teacher-header.component';
import { ViewExerciseFooterComponent } from '../view-exercise-footer/view-exercise-footer.component';

@Component({
  selector: 'app-view-exercise',
  standalone: true,
  imports: [CommonModule, TeacherHeaderComponent, ViewExerciseFooterComponent],
  templateUrl: './view-exercise.component.html',
  styleUrls: ['./view-exercise.component.scss']
})
export class ViewExerciseComponent implements OnInit {
  exercise: Exercise | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const exerciseId = this.route.snapshot.paramMap.get('id');
    console.log('ViewExerciseComponent ngOnInit - Exercise ID:', exerciseId);
    if (exerciseId) {
      this.loadExercise(exerciseId);
    } else {
      console.error('No exercise ID provided');
      this.router.navigate(['/exercise-list']);
    }
  }

  loadExercise(id: string): void {
    console.log('=== LOADING EXERCISE DETAIL ===');
    console.log('Exercise ID from route:', id);
    
    this.exerciseService.getTestDetailFromServer(id).subscribe({
      next: (exercise) => {
        console.log('📥 Server API response received:', exercise);
        if (exercise) {
          this.exercise = exercise;
          console.log('✅ Exercise loaded successfully from server:', exercise.title);
          console.log('✅ Questions count:', exercise.questions.length);
        } else {
          console.log('⚠️ No exercise returned from server');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Server API call failed:', error);
        this.isLoading = false;
      }
    });
  }

  backToExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(97 + index);
  }

  getImageUrl(filename: string): string {
    if (!filename) return '';
    return this.apiService.getImageUrl(filename);
  }

  getQuestionTypeCount(): string {
    if (!this.exercise) return '0';
    
    const singleChoice = this.exercise.questions.filter(q => q.type === 'single').length;
    const multipleChoice = this.exercise.questions.filter(q => q.type === 'multiple').length;
    
    if (singleChoice > 0 && multipleChoice > 0) {
      return `${singleChoice} trắc nghiệm, ${multipleChoice} nhiều đáp án`;
    } else if (singleChoice > 0) {
      return `${singleChoice} trắc nghiệm`;
    } else {
      return `${multipleChoice} nhiều đáp án`;
    }
  }
}