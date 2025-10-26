import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'BioEduTech';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is already logged in from localStorage
    this.authService.checkStoredAuth();
  }
}
