import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teacher-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teacher-header.component.html',
  styleUrl: './teacher-header.component.scss'
})
export class TeacherHeaderComponent implements OnInit {
  currentUser: any = null;
  isLoggedIn = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.role === 'teacher') {
        this.currentUser = user;
        this.isLoggedIn = true;
      } else {
        this.currentUser = null;
        this.isLoggedIn = false;
      }
    });

    // Track current route for active navigation highlighting
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  isActiveRoute(route: string): boolean {
    if (route === 'student-management') {
      return this.currentRoute.includes('/teacher/students');
    }
    return this.currentRoute.includes(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    this.router.navigate(['/teacher-dashboard']);
  }

  goToHome(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/teacher-dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  goToExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  goToCreateExercise(): void {
    this.router.navigate(['/create-exercise']);
  }

  goToStudentManagement(): void {
    this.router.navigate(['/teacher/students']);
  }

  goToReports(): void {
    this.router.navigate(['/reports']);
  }
}
