import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ExerciseService } from '../../services/exercise.service';
import { TeacherDashboardComponent } from './teacher-dashboard.component';

describe('TeacherDashboardComponent', () => {
  let component: TeacherDashboardComponent;
  let fixture: ComponentFixture<TeacherDashboardComponent>;
  const teacher = {
    id: 'teacher-1',
    username: 'teacher',
    role: 'teacher',
    name: 'Teacher',
    teacherId: 'teacher-1',
    school: 'School',
    subject: 'Sinh học',
    phone: '',
    department: '',
    experience: 0,
    qualifications: [],
    isVerified: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDashboardComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: AuthService,
          useValue: {
            currentUser$: of(teacher),
            getCurrentTeacher: jasmine.createSpy('getCurrentTeacher').and.returnValue(teacher),
            isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
            logout: jasmine.createSpy('logout')
          }
        },
        {
          provide: ExerciseService,
          useValue: {
            getExerciseStats: jasmine.createSpy('getExerciseStats').and.returnValue(of({
              totalExercises: 0,
              publishedExercises: 0,
              totalQuestions: 0,
              averageQuestionsPerExercise: 0
            }))
          }
        },
        {
          provide: ApiService,
          useValue: {
            getTests: jasmine.createSpy('getTests').and.returnValue(of({
              success: true,
              exams: [],
              count: 0
            })),
            getStudents: jasmine.createSpy('getStudents').and.returnValue(of({
              success: true,
              users: [],
              count: 0
            }))
          }
        },
        {
          provide: Router,
          useValue: {
            events: of({}),
            url: '/teacher-dashboard',
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
