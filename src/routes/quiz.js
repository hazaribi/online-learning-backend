const express = require('express');
const Quiz = require('../models/Quiz');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get quiz for a course
router.get('/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findByCourse(courseId);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { quiz_id, answers } = req.body;

    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    const result = quiz.calculateScore(answers);

    // Save attempt
    await quiz.saveAttempt(req.user.id, answers, result);

    res.json({
      message: 'Quiz submitted successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's quiz attempts
router.get('/attempts/me', authenticateToken, async (req, res) => {
  try {
    const attempts = await Quiz.getUserAttempts(req.user.id);
    res.json({ attempts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create quiz (Instructor only)
router.post('/create', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const quizData = req.body;
    
    // Validate quiz data
    Quiz.validateQuizData(quizData);
    
    const quiz = await Quiz.create(quizData);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;