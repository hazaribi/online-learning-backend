# Online Learning Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional: student, instructor
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### POST /auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### GET /auth/profile
Get current user profile (Protected).

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

## 📚 Course Endpoints

### GET /courses
Get all published courses (Public).

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript basics",
      "price": 49.99,
      "category": "Programming",
      "thumbnail_url": "https://example.com/image.jpg",
      "instructor": {
        "name": "John Instructor",
        "email": "instructor@example.com"
      },
      "lesson_count": 10,
      "status": "published"
    }
  ]
}
```

### GET /courses/:id
Get specific course details (Public).

**Response:**
```json
{
  "course": {
    "id": "uuid",
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript basics",
    "price": 49.99,
    "category": "Programming",
    "thumbnail_url": "https://example.com/image.jpg",
    "instructor": {
      "name": "John Instructor",
      "email": "instructor@example.com"
    },
    "lessons": [
      {
        "id": "uuid",
        "title": "Introduction to JavaScript",
        "duration": 600,
        "order_index": 1,
        "is_free": true
      }
    ]
  }
}
```

### POST /courses
Create new course (Instructor/Admin only).

**Request Body:**
```json
{
  "title": "React Development",
  "description": "Build modern web apps with React",
  "price": 79.99,
  "category": "Web Development",
  "thumbnail_url": "https://example.com/react.jpg"
}
```

**Response:**
```json
{
  "message": "Course created successfully",
  "course": {
    "id": "uuid",
    "title": "React Development",
    "description": "Build modern web apps with React",
    "price": 79.99,
    "category": "Web Development",
    "thumbnail_url": "https://example.com/react.jpg",
    "instructor_id": "uuid",
    "status": "draft"
  }
}
```

### PUT /courses/:id
Update course (Owner/Admin only).

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "price": 89.99,
  "status": "published"
}
```

### DELETE /courses/:id
Delete course (Owner/Admin only).

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

### GET /courses/instructor/:instructorId
Get courses by instructor (Protected).

---

## 🎓 Enrollment Endpoints

### POST /enrollment
Enroll in a course (Protected).

**Request Body:**
```json
{
  "course_id": "uuid"
}
```

**Response:**
```json
{
  "message": "Enrolled successfully",
  "enrollment": {
    "id": "uuid",
    "user_id": "uuid",
    "course_id": "uuid",
    "enrolled_at": "2023-01-01T00:00:00Z"
  }
}
```

### GET /enrollment/my-courses
Get user's enrolled courses (Protected).

### GET /enrollment/check/:courseId
Check enrollment status (Protected).

**Response:**
```json
{
  "enrolled": true
}
```

---

## 📊 Progress Endpoints

### GET /progress/:userId/:courseId
Get user progress for a course (Protected).

### POST /progress/update
Update lesson progress (Protected).

**Request Body:**
```json
{
  "lesson_id": "uuid",
  "watched_duration": 300,
  "completed": true
}
```

---

## 💳 Payment Endpoints

### POST /payment/create-checkout-session
Create Stripe checkout session (Protected).

**Request Body:**
```json
{
  "course_id": "uuid"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/session_id"
}
```

### POST /payment/verify
Stripe webhook for payment verification.

---

## 🎯 Quiz Endpoints

### GET /quiz/:courseId
Get quiz for a course (Protected).

### POST /quiz/submit
Submit quiz answers (Protected).

**Request Body:**
```json
{
  "quiz_id": "uuid",
  "answers": ["0", "1", "2"]
}
```

---

## 👨‍🏫 Admin Endpoints

### GET /admin/dashboard
Get admin dashboard stats (Admin only).

### GET /admin/users
Get all users (Admin only).

### GET /admin/courses
Get all courses with stats (Admin only).

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error