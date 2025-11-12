const express = require('express');
const Progress = require('../models/Progress');
const { authenticateToken } = require('../middleware/auth');
const { createCourseCompletionNotification } = require('./notifications');
const { supabase } = require('../../config/supabase');

const router = express.Router();

// Get user progress for a course
router.get('/:userId/:courseId', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Check if user can access this progress (own progress or instructor/admin)
    if (req.user.id !== userId && !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const progress = await Progress.getProgress(userId, courseId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson progress
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { lesson_id, watched_duration, completed } = req.body;
    
    const result = await Progress.updateLessonProgress(req.user.id, lesson_id, {
      watched_duration,
      completed
    });

    // Check if course is completed
    if (completed) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('course_id, courses(title)')
        .eq('id', lesson_id)
        .single();

      if (lesson) {
        const progress = await Progress.getProgress(req.user.id, lesson.course_id);
        if (progress.completion_percentage === 100) {
          await createCourseCompletionNotification(req.user.id, lesson.courses.title);
        }
      }
    }

    res.json({
      message: 'Progress updated successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's statistics
router.get('/stats/me', authenticateToken, async (req, res) => {
  try {
    const stats = await Progress.getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics (for admin/instructor access)
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user can access these stats
    if (req.user.id !== userId && !['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await Progress.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;