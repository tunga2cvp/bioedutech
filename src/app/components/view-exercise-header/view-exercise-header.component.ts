import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-exercise-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-exercise-header.component.html',
  styleUrls: ['./view-exercise-header.component.scss']
})
export class ViewExerciseHeaderComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  goToExerciseList(): void {
    this.router.navigate(['/exercise-list']);
  }

  goToLandingPage(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
