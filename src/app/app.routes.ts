import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { LoginTestComponent } from './components/login/login-test.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { StudentManagementComponent } from './components/student-management/student-management.component';
import { CreateExerciseComponent } from './components/create-exercise/create-exercise.component';
import { ExerciseListComponent } from './components/exercise-list/exercise-list.component';
import { ViewExerciseComponent } from './components/view-exercise/view-exercise.component';
import { CreateExerciseComponent as EditExerciseComponent } from './components/create-exercise/create-exercise.component';
import { ParseDemoComponent } from './components/parse-demo/parse-demo.component';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { StudentLayoutComponent } from './components/student-layout/student-layout.component';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { ExamResultComponent } from './components/exam-result/exam-result.component';
import { TeacherReportsComponent } from './components/teacher-reports/teacher-reports.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login-test', component: LoginTestComponent },
  
  // Teacher routes
  { path: 'teacher', component: TeacherDashboardComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'teacher/students', component: StudentManagementComponent },
  { path: 'create-exercise', component: CreateExerciseComponent },
  { path: 'edit-exercise/:id', component: EditExerciseComponent },
  { path: 'exercise-list', component: ExerciseListComponent },
  { path: 'reports', component: TeacherReportsComponent },
  { path: 'parse-demo', component: ParseDemoComponent },
  { path: 'api-test', component: ApiTestComponent },
  
  // Student routes with layout
  {
    path: 'student',
    component: StudentLayoutComponent,
    children: [
      { path: '', component: StudentDashboardComponent },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'exam/:id', component: TakeExamComponent },
      { path: 'exam-result/:id', component: ExamResultComponent }
    ]
  },
  {
    path: 'student-dashboard',
    component: StudentLayoutComponent,
    children: [
      { path: '', component: StudentDashboardComponent }
    ]
  },
  {
    path: 'view-exercise/:id',
    component: StudentLayoutComponent,
    children: [
      { path: '', component: ViewExerciseComponent }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
