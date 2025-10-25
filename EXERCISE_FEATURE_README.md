# Exercise Management Feature - BioEduTech

## Tổng quan

Tính năng quản lý bài tập trong BioEduTech được thiết kế đơn giản và trực quan, tập trung vào việc xem và quản lý nội dung bài tập một cách hiệu quả. Tính năng này cho phép giáo viên tạo, xem và quản lý các bài tập trắc nghiệm.

## Kiến trúc tính năng

### Components

#### 1. ExerciseListComponent
**Mục đích**: Hiển thị danh sách tất cả bài tập

**Tính năng chính**:
- Load danh sách bài tập từ API
- Hiển thị thống kê tổng quan
- Tìm kiếm bài tập theo tên
- Navigation đến trang xem chi tiết

**API Integration**:
```typescript
// Load exercises từ server
this.exerciseService.loadExercisesFromServer().subscribe({
  next: (exercises) => {
    this.exercises = exercises;
    this.applyFilters();
  }
});
```

**Template Structure**:
```html
<!-- Header với nút tạo bài tập mới -->
<div class="header">
  <button class="btn btn-primary" (click)="createNewExercise()">
    + Tạo Bài Tập Mới
  </button>
</div>

<!-- Thống kê -->
<div class="stats-section">
  <div class="stat-card">
    <h3>{{ stats.totalExercises }}</h3>
    <p>Tổng bài tập</p>
  </div>
</div>

<!-- Tìm kiếm -->
<div class="filters-section">
  <input [(ngModel)]="searchTerm" (input)="onSearchChange()" 
         placeholder="Tìm kiếm bài tập...">
</div>

<!-- Danh sách bài tập -->
<div class="exercises-grid">
  <app-exercise-card
    *ngFor="let exercise of filteredExercises"
    [exercise]="exercise"
    (viewExercise)="viewExercise($event)">
  </app-exercise-card>
</div>
```

#### 2. ExerciseCardComponent
**Mục đích**: Hiển thị thông tin một bài tập trong danh sách

**Tính năng chính**:
- Hiển thị thông tin cơ bản (tên, mô tả, số câu hỏi)
- Nút "Xem bài thi" duy nhất
- Design đẹp và responsive

**Template Structure**:
```html
<div class="exercise-card">
  <div class="exercise-header">
    <div class="exercise-title">
      <h4>{{ exercise.title }}</h4>
      <span class="badge badge-published">Đã xuất bản</span>
    </div>
  </div>

  <div class="exercise-content">
    <p class="exercise-description">{{ exercise.description }}</p>
    <div class="exercise-meta">
      <div class="meta-item">
        <span class="meta-label">Số câu hỏi:</span>
        <span class="meta-value">{{ exercise.totalQuestions || exercise.questions.length }}</span>
      </div>
    </div>
  </div>

  <div class="exercise-footer">
    <div class="exercise-actions-footer">
      <button type="button" class="btn btn-primary btn-sm" 
              (click)="onViewExercise($event)">
        📖 Xem bài thi
      </button>
    </div>
  </div>
</div>
```

#### 3. ViewExerciseComponent
**Mục đích**: Hiển thị chi tiết bài tập với toàn bộ nội dung

**Tính năng chính**:
- Load chi tiết bài tập từ API
- Hiển thị tất cả câu hỏi cùng lúc
- Hiển thị đáp án đúng được đánh dấu
- Hiển thị hình ảnh qua API GET `/images/{filename}`
- Layout đẹp và dễ đọc

**API Integration**:
```typescript
// Load exercise detail từ server
this.exerciseService.getTestDetailFromServer(id).subscribe({
  next: (exercise) => {
    this.exercise = exercise;
    this.isLoading = false;
  }
});

// Get image URL từ API
getImageUrl(filename: string): string {
  if (!filename) return '';
  return this.apiService.getImageUrl(filename);
}
```

**Template Structure**:
```html
<div class="exercise-content">
  <!-- Header với thông tin bài tập -->
  <div class="exercise-header">
    <div class="exercise-info">
      <h1>{{ exercise.title }}</h1>
      <p class="exercise-description">{{ exercise.description }}</p>
      <div class="exercise-meta">
        <span class="meta-item">
          <strong>Số câu hỏi:</strong> {{ exercise.totalQuestions || exercise.questions.length }}
        </span>
      </div>
    </div>
    <div class="exercise-actions">
      <button class="btn btn-secondary" (click)="backToExerciseList()">
        ← Quay lại
      </button>
    </div>
  </div>

  <!-- Danh sách câu hỏi -->
  <div class="questions-list">
    <h2>Danh sách câu hỏi</h2>
    <div *ngFor="let question of exercise.questions; let i = index" class="question-item">
      <div class="question-header">
        <h3>Câu {{ i + 1 }}: {{ question.content }}</h3>
        <span class="question-type">
          {{ question.type === 'multiple' ? 'Nhiều đáp án' : 'Một đáp án' }}
        </span>
      </div>
      
      <!-- Hình ảnh minh họa -->
      <div *ngIf="question.imageUrl" class="question-image">
        <img [src]="getImageUrl(question.imageUrl)" 
             alt="Ảnh minh họa câu {{ i + 1 }}">
      </div>

      <!-- Các đáp án -->
      <div class="answer-options">
        <div *ngFor="let option of question.options; let j = index" class="option-item">
          <div class="option-content">
            <span class="option-letter">{{ getOptionLetter(j) }})</span>
            <span class="option-text">{{ option.content }}</span>
            <span *ngIf="option.isCorrect" class="correct-indicator">✓</span>
          </div>
        </div>
      </div>

      <!-- Giải thích -->
      <div *ngIf="question.explanation" class="question-explanation">
        <strong>Giải thích:</strong> {{ question.explanation }}
      </div>
    </div>
  </div>
</div>
```

#### 4. CreateExerciseComponent
**Mục đích**: Tạo bài tập mới

**Tính năng chính**:
- Form tạo bài tập với validation
- Thêm câu hỏi và đáp án
- Upload hình ảnh cho câu hỏi
- Submit bài tập qua API

## Services

### ExerciseService
**Mục đích**: Xử lý logic bài tập và data conversion

**Methods chính**:
```typescript
// Load danh sách bài tập từ server
loadExercisesFromServer(): Observable<Exercise[]>

// Load chi tiết bài tập từ server
getTestDetailFromServer(testId: string): Observable<Exercise | null>

// Convert API response sang Exercise model
private convertTestToExercise(test: TestListItem): Exercise
private convertTestDetailToExercise(testDetail: TestDetailResponse): Exercise
```

**Data Conversion**:
```typescript
private convertTestToExercise(test: TestListItem): Exercise {
  return {
    id: String(test.id), // Sử dụng server ID
    title: test.exam_name || 'Bài tập không có tên',
    description: test.description || 'Mô tả bài tập',
    questions: test.questions || defaultQuestions,
    totalQuestions: test.question_count || 0,
    createdAt: new Date(test.created_at),
    // ... other fields
  };
}
```

### ApiService
**Mục đích**: Xử lý tất cả API calls

**Methods chính**:
```typescript
// Lấy danh sách bài tập
getTests(page: number = 1, limit: number = 10): Observable<TestListResponse>

// Lấy chi tiết bài tập
getTestDetail(testId: string): Observable<TestDetailResponse>

// Tạo bài tập mới
createTest(testData: TestCreationData): Observable<TestCreationResponse>

// Upload hình ảnh
uploadImage(file: File): Observable<ImageUploadResponse>

// Tạo URL hình ảnh
getImageUrl(filename: string): string
```

## Data Models

### Exercise Model
```typescript
export interface Exercise {
  id: string;
  title: string;
  description: string;
  grade: number;
  chapter: string;
  timeLimit: number;
  maxScore: number;
  questions: Question[];
  createdAt: Date;
  totalQuestions?: number;
  retryLimit: number;
  showAnswersAfterSubmit: boolean;
  startDate?: Date;
  endDate?: Date;
  assignedClasses: string[];
  createdBy: string;
}
```

### Question Model
```typescript
export interface Question {
  id: string;
  content: string;
  imageUrl?: string;
  options: Option[];
  type: 'single' | 'multiple';
  explanation?: string;
  order: number;
}
```

### Option Model
```typescript
export interface Option {
  id: string;
  content: string;
  isCorrect: boolean;
  order: number;
}
```

## API Integration

### Endpoints
```typescript
// Lấy danh sách bài tập
GET /exams?page=1&limit=10

// Lấy chi tiết bài tập
GET /exams/{id}

// Tạo bài tập mới
POST /exams

// Upload hình ảnh
POST /images

// Lấy hình ảnh
GET /images/{filename}
```

### API Response Structure
```typescript
// Test List Response
interface TestListResponse {
  exams: TestListItem[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

// Test Detail Response
interface TestDetailApiResponse {
  success: boolean;
  exam: {
    exam_name: string;
    id: string | number;
    questions: TestDetailQuestion[];
    question_count?: number;
    // ... other fields
  };
}
```

## Styling và UI

### SCSS Structure
```scss
// Exercise List
.exercise-list-container {
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .stats-section {
    .stat-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  }
  
  .exercises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
}

// Exercise Card
.exercise-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

// View Exercise
.view-exercise-container {
  .exercise-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .question-item {
    background: #f8f9fa;
    border-left: 5px solid #3498db;
    
    .option-item {
      background: white;
      border: 2px solid #e9ecef;
      
      &:hover {
        border-color: #3498db;
      }
      
      .correct-indicator {
        color: #27ae60;
        font-weight: bold;
      }
    }
  }
}
```

### Responsive Design
```scss
@media (max-width: 768px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }
  
  .exercise-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .question-header {
    flex-direction: column;
    gap: 10px;
  }
}
```

## Error Handling

### API Error Handling
```typescript
// Exercise Service
loadExercisesFromServer(): Observable<Exercise[]> {
  return new Observable(observer => {
    this.apiService.getTests(1, 100).subscribe({
      next: (response) => {
        try {
          const exercises = response.exams.map(test => 
            this.convertTestToExercise(test)
          ).filter(exercise => exercise !== null);
          
          observer.next(exercises);
          observer.complete();
        } catch (error) {
          console.error('Error converting exercises:', error);
          observer.error(error);
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        observer.error(error);
        observer.complete();
      }
    });
  });
}
```

### Component Error Handling
```typescript
// View Exercise Component
loadExercise(id: string): void {
  this.exerciseService.getTestDetailFromServer(id).subscribe({
    next: (exercise) => {
      if (exercise) {
        this.exercise = exercise;
      } else {
        console.log('No exercise returned from server');
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Failed to load exercise:', error);
      this.isLoading = false;
    }
  });
}
```

## Performance Optimization

### Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExerciseCardComponent {
  // Component implementation
}
```

### TrackBy Functions
```html
<app-exercise-card
  *ngFor="let exercise of filteredExercises; trackBy: trackByExerciseId"
  [exercise]="exercise">
</app-exercise-card>
```

```typescript
trackByExerciseId(index: number, exercise: Exercise): string {
  return exercise.id;
}
```

### Lazy Loading
```typescript
// App Routes
const routes: Routes = [
  {
    path: 'exercise-list',
    loadComponent: () => import('./components/exercise-list/exercise-list.component')
      .then(m => m.ExerciseListComponent)
  },
  {
    path: 'view-exercise/:id',
    loadComponent: () => import('./components/view-exercise/view-exercise.component')
      .then(m => m.ViewExerciseComponent)
  }
];
```

## Testing

### Unit Tests
```typescript
describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ExerciseService', ['loadExercisesFromServer']);
    
    TestBed.configureTestingModule({
      imports: [ExerciseListComponent],
      providers: [
        { provide: ExerciseService, useValue: spy }
      ]
    });
    
    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
  });

  it('should load exercises on init', () => {
    const mockExercises = [/* mock data */];
    exerciseService.loadExercisesFromServer.and.returnValue(of(mockExercises));
    
    component.ngOnInit();
    
    expect(exerciseService.loadExercisesFromServer).toHaveBeenCalled();
    expect(component.exercises).toEqual(mockExercises);
  });
});
```

### Integration Tests
```typescript
describe('Exercise Feature Integration', () => {
  it('should display exercise list and navigate to detail', async () => {
    // Test exercise list display
    await page.goto('/exercise-list');
    await expect(page.locator('.exercises-grid')).toBeVisible();
    
    // Test navigation to exercise detail
    await page.click('.exercise-card:first-child .btn-primary');
    await expect(page).toHaveURL(/\/view-exercise\/\d+/);
    await expect(page.locator('.questions-list')).toBeVisible();
  });
});
```

## Deployment

### Build Configuration
```json
// angular.json
{
  "projects": {
    "bioedutech": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/bioedutech",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

### Environment Configuration
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.bioedutech.com/api'
};

// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## Kết luận

Tính năng quản lý bài tập trong BioEduTech được thiết kế để đơn giản và hiệu quả, tập trung vào việc xem và quản lý nội dung bài tập một cách trực quan. Kiến trúc component-based và service-oriented giúp code dễ maintain và mở rộng.

**Điểm mạnh**:
- ✅ Giao diện đơn giản và trực quan
- ✅ API integration hoàn chỉnh
- ✅ Responsive design
- ✅ Error handling tốt
- ✅ Code clean và maintainable

**Hướng phát triển**:
- 🔄 Thêm tính năng chỉnh sửa bài tập
- 🔄 Thêm tính năng xóa bài tập
- 🔄 Cải thiện performance
- 🔄 Thêm unit tests và e2e tests