const express = require('express');
const { supabase } = require('../../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course completion notification
const createCourseCompletionNotification = async (userId, courseTitle) => {
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'course_completion',
        title: 'Course Completed!',
        message: `Congratulations! You have completed the course: ${courseTitle}`,
        read: false
      });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { router, createCourseCompletionNotification };