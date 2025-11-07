const express = require('express');
const { supabase } = require('../../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Enroll in a course
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { course_id } = req.body;

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('course_id', course_id)
      .single();

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Create enrollment
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([{
        user_id: req.user.id,
        course_id,
        enrolled_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user enrollments
router.get('/my-courses', authenticateToken, async (req, res) => {
  try {
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        course:courses(
          id, title, description, thumbnail_url,
          instructor:users(name)
        )
      `)
      .eq('user_id', req.user.id)
      .order('enrolled_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check enrollment status
router.get('/check/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(400).json({ error: error.message });
    }

    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;