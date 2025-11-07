# Testing Checklist - Online Learning Platform

## 🧪 Manual Testing Guide

### **Authentication Module Tests**

#### User Registration
- [ ] **Test 1:** Valid signup with student role
  - Navigate to `/signup`
  - Fill: name, email, password, role="student"
  - Expected: Success message, auto-login, redirect to courses

- [ ] **Test 2:** Valid signup with instructor role
  - Same as above with role="instructor"
  - Expected: Success + instructor navigation options

- [ ] **Test 3:** Duplicate email signup
  - Use existing email
  - Expected: "User already exists" error

- [ ] **Test 4:** Invalid email format
  - Use invalid email (no @, etc.)
  - Expected: Validation error

#### User Login
- [ ] **Test 5:** Valid login credentials
  - Navigate to `/login`
  - Enter correct email/password
  - Expected: Success, JWT token, redirect to courses

- [ ] **Test 6:** Invalid credentials
  - Enter wrong password
  - Expected: "Invalid credentials" error

- [ ] **Test 7:** Non-existent user
  - Enter email that doesn't exist
  - Expected: "Invalid credentials" error

#### Authentication Persistence
- [ ] **Test 8:** Token persistence
  - Login successfully
  - Refresh page
  - Expected: User remains logged in

- [ ] **Test 9:** Logout functionality
  - Click logout button
  - Expected: Redirect to home, token removed

#### Protected Routes
- [ ] **Test 10:** Access protected route without login
  - Navigate to `/instructor` without login
  - Expected: Redirect to login

- [ ] **Test 11:** Role-based access control
  - Login as student, try to access `/instructor`
  - Expected: Redirect to home page

---

### **Course CRUD Module Tests**

#### Course Creation (Instructor)
- [ ] **Test 12:** Create course as instructor
  - Login as instructor
  - Navigate to `/create-course`
  - Fill all required fields
  - Expected: Course created, redirect to courses

- [ ] **Test 13:** Create course with missing fields
  - Leave required fields empty
  - Expected: Validation errors

- [ ] **Test 14:** Create course as student
  - Login as student
  - Try to access `/create-course`
  - Expected: Access denied/redirect

#### Course Reading
- [ ] **Test 15:** View all courses (public)
  - Navigate to `/courses` without login
  - Expected: List of published courses only

- [ ] **Test 16:** View course details
  - Click on any course
  - Expected: Course details page with lessons

- [ ] **Test 17:** Course details show correct info
  - Verify title, description, price, instructor
  - Expected: All data matches database

#### Course Updates (Instructor)
- [ ] **Test 18:** Edit own course
  - Login as instructor
  - Go to instructor dashboard
  - Edit a course
  - Expected: Course updated successfully

- [ ] **Test 19:** Edit other instructor's course
  - Try to edit course owned by different instructor
  - Expected: Access denied

- [ ] **Test 20:** Publish/unpublish course
  - Change course status from draft to published
  - Expected: Status updated, course visible publicly

#### Course Deletion
- [ ] **Test 21:** Delete own course
  - Click delete button on own course
  - Confirm deletion
  - Expected: Course removed from database

- [ ] **Test 22:** Delete other's course
  - Try to delete course owned by another instructor
  - Expected: Access denied

---

### **Enrollment Module Tests**

#### Free Course Enrollment
- [ ] **Test 23:** Enroll in free course
  - Login as student
  - Navigate to free course (price = 0)
  - Click "Enroll Now - Free"
  - Expected: Instant enrollment, access to lessons

- [ ] **Test 24:** Access lessons after free enrollment
  - After enrolling, click on lessons
  - Expected: Video player loads, progress tracking works

#### Paid Course Enrollment
- [ ] **Test 25:** Payment flow initiation
  - Navigate to paid course
  - Click "Buy Now"
  - Expected: Redirect to Stripe checkout

- [ ] **Test 26:** Successful payment (use Stripe test cards)
  - Complete payment with test card: 4242424242424242
  - Expected: Redirect back, enrollment created, access granted

- [ ] **Test 27:** Failed payment
  - Use declined test card: 4000000000000002
  - Expected: Payment fails, no enrollment created

#### Enrollment Status
- [ ] **Test 28:** Check enrollment status
  - Enroll in course, refresh page
  - Expected: Shows "You are enrolled!" message

- [ ] **Test 29:** Access control for non-enrolled users
  - Try to access paid lesson without enrollment
  - Expected: Lesson locked, payment prompt shown

---

### **Instructor Dashboard Tests**

#### Dashboard Access
- [ ] **Test 30:** Instructor dashboard access
  - Login as instructor
  - Navigate to `/instructor`
  - Expected: Dashboard with course statistics

- [ ] **Test 31:** Student cannot access instructor dashboard
  - Login as student
  - Try to access `/instructor`
  - Expected: Redirect to home

#### Course Management
- [ ] **Test 32:** View course statistics
  - Check total, published, draft counts
  - Expected: Numbers match actual course data

- [ ] **Test 33:** Course table functionality
  - Verify all courses are listed
  - Check edit/delete/view buttons work
  - Expected: All actions functional

- [ ] **Test 34:** Edit course via dashboard
  - Click edit button
  - Modify course details in modal
  - Save changes
  - Expected: Course updated, modal closes

---

### **Video & Progress Tests**

#### Video Player
- [ ] **Test 35:** Video playback
  - Enroll in course with video lessons
  - Click on lesson
  - Expected: Video player loads and plays

- [ ] **Test 36:** Progress tracking
  - Watch video for some time
  - Check progress is saved
  - Expected: Progress percentage updates

#### Quiz Functionality
- [ ] **Test 37:** Take quiz
  - Complete course lessons
  - Click "Take Quiz"
  - Answer questions and submit
  - Expected: Score calculated, pass/fail result shown

- [ ] **Test 38:** Quiz retake
  - Retake same quiz
  - Expected: New attempt recorded

---

### **Admin Dashboard Tests**

#### Admin Access
- [ ] **Test 39:** Admin dashboard access
  - Login as admin user
  - Navigate to `/admin`
  - Expected: Admin dashboard with platform stats

- [ ] **Test 40:** Non-admin cannot access
  - Login as student/instructor
  - Try to access `/admin`
  - Expected: Access denied

#### Platform Management
- [ ] **Test 41:** View platform statistics
  - Check user count, course count, revenue
  - Expected: Accurate statistics displayed

- [ ] **Test 42:** User management
  - View all users table
  - Expected: All users listed with roles

---

### **API Endpoint Tests**

#### Authentication Endpoints
- [ ] **Test 43:** POST /api/auth/signup
- [ ] **Test 44:** POST /api/auth/login
- [ ] **Test 45:** GET /api/auth/profile

#### Course Endpoints
- [ ] **Test 46:** GET /api/courses
- [ ] **Test 47:** GET /api/courses/:id
- [ ] **Test 48:** POST /api/courses
- [ ] **Test 49:** PUT /api/courses/:id
- [ ] **Test 50:** DELETE /api/courses/:id

#### Enrollment Endpoints
- [ ] **Test 51:** POST /api/enrollment
- [ ] **Test 52:** GET /api/enrollment/my-courses
- [ ] **Test 53:** GET /api/enrollment/check/:courseId

---

## 🎥 Demo Video Script

### **Recording Checklist:**
1. **Setup & Introduction (2 min)**
   - Show both frontend and backend running
   - Explain the platform overview
   - Show database schema

2. **Authentication Demo (3 min)**
   - User signup process
   - Login/logout functionality
   - Role-based navigation

3. **Student Journey (5 min)**
   - Browse courses
   - View course details
   - Enroll in free course
   - Access lessons and video player
   - Take quiz
   - Check progress

4. **Instructor Journey (5 min)**
   - Login as instructor
   - Access instructor dashboard
   - Create new course
   - Manage existing courses
   - Publish course

5. **Admin Features (3 min)**
   - Admin dashboard
   - Platform statistics
   - User management

6. **Payment Flow (3 min)**
   - Paid course enrollment
   - Stripe integration demo
   - Post-payment access

7. **Technical Features (2 min)**
   - API endpoints demonstration
   - Database integration
   - Security features

### **Total Demo Duration: ~23 minutes**

---

## ✅ **Testing Results Summary**

**Completed Tests:** ___/53
**Passed:** ___
**Failed:** ___
**Issues Found:** ___

**Critical Issues:**
- [ ] List any blocking issues

**Minor Issues:**
- [ ] List cosmetic/minor issues

**Overall Status:** 
- [ ] Ready for Production
- [ ] Needs Minor Fixes
- [ ] Needs Major Fixes