import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/exercise.model';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss']
})
export class ExerciseCardComponent {
  @Input() exercise!: Exercise;
  
  @Output() viewExercise = new EventEmitter<Exercise>();
  @Output() viewReport = new EventEmitter<Exercise>();
  @Output() deleteExercise = new EventEmitter<Exercise>();

  getStatusBadgeClass(): string {
    return 'badge-published';
  }

  getStatusText(): string {
    return 'Đã xuất bản';
  }

  onViewExercise(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.viewExercise.emit(this.exercise);
  }

  onViewReport(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.viewReport.emit(this.exercise);
  }

  onDeleteExercise(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.deleteExercise.emit(this.exercise);
  }
}
