import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StudentHeaderComponent } from '../student-header/student-header.component';
import { StudentFooterComponent } from '../student-footer/student-footer.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentHeaderComponent, StudentFooterComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.scss'
})
export class StudentLayoutComponent implements OnInit {
  isStudent = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isStudent = user?.role === 'student';
    });
  }
}
