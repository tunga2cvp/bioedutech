import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseService } from '../../services/exercise.service';
import { ApiService } from '../../services/api.service';
import { Exercise } from '../../models/exercise.model';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-view-exercise',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
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
}