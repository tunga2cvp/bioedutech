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

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login-test', component: LoginTestComponent },
  { path: 'teacher', component: TeacherDashboardComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'teacher/students', component: StudentManagementComponent },
  { path: 'create-exercise', component: CreateExerciseComponent },
  { path: 'edit-exercise/:id', component: EditExerciseComponent },
  { path: 'exercise-list', component: ExerciseListComponent },
  { path: 'view-exercise/:id', component: ViewExerciseComponent },
  { path: 'parse-demo', component: ParseDemoComponent },
  { path: 'api-test', component: ApiTestComponent },
  { path: 'student', component: StudentDashboardComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: '**', redirectTo: '' }
];
