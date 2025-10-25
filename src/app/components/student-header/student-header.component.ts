import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { StudentUser } from '../../models/user.model';

@Component({
  selector: 'app-student-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.scss'
})
export class StudentHeaderComponent implements OnInit {
  currentUser: StudentUser | null = null;
  isLoggedIn = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.role === 'student') {
        this.currentUser = user as StudentUser;
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
    return this.currentRoute.includes(route);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    this.router.navigate(['/student-dashboard']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToProfile(): void {
    // TODO: Implement student profile page
    console.log('Student profile - to be implemented');
  }

  goToExams(): void {
    this.router.navigate(['/student']);
  }
}
