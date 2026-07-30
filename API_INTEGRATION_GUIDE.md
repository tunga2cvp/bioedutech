# API Integration Guide

Tài liệu này phản ánh code hiện tại trong `src/app/services/api.service.ts`.

## Base URL

```ts
private baseUrl = 'https://chimeara.pythonanywhere.com';
```

Frontend hiện chưa dùng `src/environments`. Nếu muốn đổi base URL theo môi trường, cần refactor `ApiService`.

## Auth

### `POST /login`

Code: `ApiService.loginStudent()`

Request:

```json
{
  "username": "student01",
  "password": "123456"
}
```

Response frontend kỳ vọng:

```json
{
  "success": true,
  "message": "Login success",
  "user": {
    "id": 1,
    "username": "student01",
    "email": "student01@example.com",
    "role": "student",
    "name": "Nguyen Van A"
  }
}
```

`AuthService` tự map user theo `role` backend trả về và lưu `currentUser` vào `localStorage`.

## Exams

### `GET /exams?page=&limit=`

Code: `ApiService.getTests(page, limit)`

Response frontend kỳ vọng:

```json
{
  "success": true,
  "exams": [
    {
      "id": 1,
      "exam_name": "Bài kiểm tra Sinh học",
      "created_at": "2025-10-24T10:00:00Z",
      "status": "active",
      "question_count": 10,
      "timer": "30m"
    }
  ],
  "count": 1
}
```

Lưu ý:

- Code hiện dùng field `question_count`, không phải `total_questions`.
- `ExerciseService.convertTestToExercise()` map `exam_name` sang `Exercise.title`.

### `GET /exams/{exam_id}`

Code: `ApiService.getTestDetail(testId)`

Backend response được `ApiService` transform từ:

```json
{
  "success": true,
  "exam": {
    "id": 1,
    "exam_name": "Bài kiểm tra Sinh học",
    "questions": [
      {
        "content": "Câu hỏi?",
        "answers": ["A", "B", "C", "D"],
        "correct_answers": [1],
        "image": null,
        "explanation": "Giải thích"
      }
    ],
    "timer": "30m"
  }
}
```

Sang `TestDetailResponse` phẳng hơn để component dùng.

### `POST /exams`

Code: `ApiService.createTest()`

Request hiện gửi:

```json
{
  "exam_name": "Bài kiểm tra Sinh học",
  "timer": "30m",
  "questions": [
    {
      "content": "Câu hỏi?",
      "answers": ["A", "B", "C", "D"],
      "correct_answers": [1],
      "image": "filename.png"
    }
  ]
}
```

Response frontend kỳ vọng:

```json
{
  "result": "success",
  "message": "Created",
  "test_id": "1",
  "id": 1,
  "created_at": "2025-10-24T10:00:00Z",
  "status": "active",
  "total_questions": 1,
  "max_score": 100,
  "time_limit": 60
}
```

### `POST /exams/{exam_id}/submit`

Code: `ApiService.submitExam()`

Request:

```json
{
  "student_id": 1,
  "answers": [[1], [0, 2]],
  "time_taken": 120
}
```

Response:

```json
{
  "success": true,
  "student_id": 1,
  "test_id": 1,
  "submission_id": 99,
  "score": 8,
  "max_score": 10,
  "percentage": 80
}
```

### `GET /exams/{exam_id}/results`

Code: `ApiService.getExamResults(examId, studentId?)`

Optional query:

```text
?student_id=1
```

Response:

```json
{
  "success": true,
  "count": 1,
  "results": [
    {
      "submission_id": 99,
      "student_id": 1,
      "student": {
        "name": "Nguyen Van A",
        "username": "student01"
      },
      "score": 8,
      "max_score": 10,
      "percentage": 80,
      "time_taken": 120,
      "timestamp": "2025-10-24T10:00:00Z"
    }
  ]
}
```

`TeacherReportsComponent` bỏ qua result có `student === null`.

### `DELETE /exams/{exam_id}`

Code: `ApiService.deleteExam()`

Response:

```json
{
  "success": true,
  "message": "Deleted"
}
```

## Images

### `POST /images`

Code: `ApiService.uploadImage()`

Request: `multipart/form-data`, field `file`.

Response:

```json
{
  "success": true,
  "path": "/images/filename.png",
  "filename": "filename.png"
}
```

Frontend lưu filename/path cuối cùng vào `question.imageUrl`.

### `GET /images/{filename}`

Code: `ApiService.getImage()` và `ApiService.getImageUrl()`.

Trong template thường dùng URL trực tiếp:

```ts
this.apiService.getImageUrl(filename)
```

## Users

### `GET /users?page=&limit=&role=`

Code: `ApiService.getUsers()`, `getStudents()`, `getTeachers()`

Response:

```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "student01",
      "role": "student",
      "name": "Nguyen Van A"
    }
  ],
  "count": 1
}
```

### `DELETE /users/{user_id}`

Code: `ApiService.deleteUser()`

Response:

```json
{
  "success": true,
  "message": "Deleted"
}
```

## Excel Student Registration

### `POST /register_excel`

Code: `ApiService.registerStudentsExcel()`

Request: `multipart/form-data`, field `file`.

Response:

```json
{
  "success": true,
  "created": 2,
  "created_items": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "username": "student01"
    }
  ]
}
```

### `GET /register_excel/template`

Code: `ApiService.downloadExcelTemplate()`

Response: `Blob` Excel template.

Nếu API lỗi, `ExcelService.downloadTemplate()` tạo template local với các cột:

```text
name, username, password
```

## Timer

Backend có thể trả:

- `timer`: string, ví dụ `30m`, `1h`, `45s`, `1h30m`, `2h15m30s`.
- `time_limit`: number theo phút, dùng fallback.

Timer parser và form validator hiện dùng chung quy ước: các đơn vị theo thứ tự `h`, `m`, `s`, có thể bỏ đơn vị không dùng.

## Error Handling

`ApiService.handleError()` map một số HTTP status sang message tiếng Việt:

- `400`: dữ liệu không hợp lệ.
- `401`: sai username/password.
- `403`: truy cập bị từ chối.
- `404`: không tìm thấy tài khoản.
- `500`: lỗi máy chủ.

Một số method upload/submit đang có `console.log`/`console.error` debug riêng.

## Known Integration Notes

- Tài liệu cũ có nhắc `/tests`; code hiện đã dùng `/exams`.
- Tài liệu cũ có nhắc `src/environments`; code hiện không có thư mục này.
- `submitTest()` là method legacy và hiện post vào `/exams`, không phải luồng submit học sinh chính.
- Luồng submit chính là `submitExam()` với endpoint `/exams/{exam_id}/submit`.
