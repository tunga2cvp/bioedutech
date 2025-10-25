import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-footer.component.html',
  styleUrl: './student-footer.component.scss'
})
export class StudentFooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  goToExams(): void {
    this.router.navigate(['/student']);
  }

  goToResults(): void {
    // TODO: Implement results page
    console.log('Results page - to be implemented');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
