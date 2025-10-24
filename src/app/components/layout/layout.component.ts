import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    // Track current route for active navigation highlighting
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = (event as NavigationEnd).url;
      });
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    if (this.currentUser?.role === 'teacher') {
      this.router.navigate(['/teacher-dashboard']);
    } else if (this.currentUser?.role === 'student') {
      this.router.navigate(['/student-dashboard']);
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToCreateExercise(): void {
    this.router.navigate(['/create-exercise']);
  }

  goToExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  goToStudentManagement(): void {
    this.router.navigate(['/teacher/students']);
  }

  goToParseDemo(): void {
    this.router.navigate(['/parse-demo']);
  }

  goToApiTest(): void {
    this.router.navigate(['/api-test']);
  }
}
