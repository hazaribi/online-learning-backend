# Online Learning Platform - Backend API

A comprehensive backend API for an online learning platform similar to Udemy, Coursera, or Skillshare. Built with Node.js, Express, and Supabase.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📚 **Course Management** - Create, read, update courses
- 🎥 **Video Lessons** - Manage course lessons and content
- 📝 **Quiz System** - Interactive quizzes with scoring
- 📊 **Progress Tracking** - Track user learning progress
- 💳 **Payment Integration** - Stripe integration for course purchases
- 👥 **Role-based Access** - Student, Instructor, and Admin roles

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **File Storage**: Supabase Storage

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your Supabase and Stripe credentials
   ```

3. **Database Setup**
   - Run the SQL schema in `docs/database-schema.sql` in your Supabase SQL Editor

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)

### Lessons
- `GET /api/lessons/:courseId` - Get course lessons
- `GET /api/lessons/single/:id` - Get specific lesson (protected)

### Quiz
- `GET /api/quiz/:courseId` - Get course quiz (protected)
- `POST /api/quiz/submit` - Submit quiz answers (protected)

### Progress
- `GET /api/progress/:userId/:courseId` - Get user progress (protected)
- `POST /api/progress/update` - Update lesson progress (protected)

### Payment
- `POST /api/payment/create-checkout-session` - Create Stripe checkout (protected)
- `POST /api/payment/verify` - Stripe webhook for payment verification

## Database Schema

The platform uses the following main tables:
- `users` - User accounts and profiles
- `courses` - Course information
- `lessons` - Individual course lessons
- `quizzes` - Course assessments
- `enrollments` - User course enrollments
- `lesson_progress` - Individual lesson completion tracking
- `payments` - Payment transactions
- `certificates` - Course completion certificates

## Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

## User Roles

- **Student**: Can enroll in courses, watch lessons, take quizzes
- **Instructor**: Can create and manage their own courses
- **Admin**: Full access to all platform features

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Role-based access control

## Next Steps

1. Set up your Supabase project and database
2. Configure environment variables
3. Test API endpoints with Postman or similar tool
4. Build your frontend application to consume this API
5. Deploy to your preferred hosting platform

## License

MIT License - feel free to use this for your projects!