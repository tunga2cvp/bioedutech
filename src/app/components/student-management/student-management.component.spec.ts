import { of } from 'rxjs';

import { User } from '../../services/api.service';
import { StudentManagementComponent } from './student-management.component';

describe('StudentManagementComponent pagination', () => {
  let component: StudentManagementComponent;

  const createStudents = (count: number): User[] =>
    Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Học sinh ${index + 1}`,
      username: `student${index + 1}`,
      email: `student${index + 1}@example.com`,
      role: 'student'
    }));

  beforeEach(() => {
    component = new StudentManagementComponent(
      {} as any,
      {} as any,
      {} as any,
      {
        getStudents: () => of({ success: true, count: 0, users: [] })
      } as any,
      {} as any,
      { open: jasmine.createSpy('open') } as any
    );
  });

  it('should paginate the filtered student list', () => {
    component.filteredStudents = createStudents(45);

    component.updatePagination();

    expect(component.totalPages).toBe(3);
    expect(component.paginatedStudents.length).toBe(20);
    expect(component.firstVisibleStudent).toBe(1);
    expect(component.lastVisibleStudent).toBe(20);

    component.onPageChange(3);

    expect(component.paginatedStudents.length).toBe(5);
    expect(component.firstVisibleStudent).toBe(41);
    expect(component.lastVisibleStudent).toBe(45);
  });

  it('should reset to the first page after filtering', () => {
    component.students = createStudents(45);
    component.filteredStudents = [...component.students];
    component.currentPage = 3;
    component.searchTerm = 'Học sinh 1';

    component.filterStudents();

    expect(component.currentPage).toBe(1);
    expect(component.filteredStudents.length).toBe(11);
    expect(component.paginatedStudents.length).toBe(11);
  });

  it('should clamp the current page after the data shrinks', () => {
    component.filteredStudents = createStudents(45);
    component.currentPage = 3;
    component.updatePagination();
    component.filteredStudents = createStudents(10);

    component.updatePagination();

    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.paginatedStudents.length).toBe(10);
  });
});
