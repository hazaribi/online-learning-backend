require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
console.log('Loading routes...');
let authRoutes, courseRoutes, lessonRoutes, quizRoutes, progressRoutes, paymentRoutes, adminRoutes, enrollmentRoutes, notificationRoutes;

try {
  authRoutes = require('./routes/auth');
  console.log('✅ Auth routes loaded');
  courseRoutes = require('./routes/courses');
  console.log('✅ Course routes loaded');
  lessonRoutes = require('./routes/lessons');
  console.log('✅ Lesson routes loaded');
  quizRoutes = require('./routes/quiz');
  console.log('✅ Quiz routes loaded');
  progressRoutes = require('./routes/progress');
  console.log('✅ Progress routes loaded');
  paymentRoutes = require('./routes/payment');
  console.log('✅ Payment routes loaded');
  adminRoutes = require('./routes/admin');
  console.log('✅ Admin routes loaded');
  enrollmentRoutes = require('./routes/enrollment');
  console.log('✅ Enrollment routes loaded');
  const { router: notificationRouter } = require('./routes/notifications');
  notificationRoutes = notificationRouter;
  console.log('✅ Notification routes loaded');
} catch (error) {
  console.error('❌ Route loading error:', error.message);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Learning Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      courses: '/api/courses/*',
      lessons: '/api/lessons/*',
      quiz: '/api/quiz/*',
      progress: '/api/progress/*',
      payment: '/api/payment/*'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Online Learning Platform API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;