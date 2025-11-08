const express = require('express');
const { supabase } = require('../../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all lessons for a course
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ lessons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific lesson
router.get('/single/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        course:courses(title, instructor_id)
      `)
      .eq('id', id)
      .single();

    if (error || !lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if user is enrolled or lesson is free
    if (!lesson.is_free) {
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('course_id', lesson.course_id)
        .single();

      if (!enrollment && lesson.course.instructor_id !== req.user.id) {
        return res.status(403).json({ error: 'Enrollment required to access this lesson' });
      }
    }

    res.json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lesson (instructor only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { course_id, title, description, video_url, order_index } = req.body;

    // Verify instructor owns the course
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', course_id)
      .single();

    if (!course || course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add lessons to this course' });
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id,
        title,
        description,
        video_url,
        order_index: order_index || 1
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson (instructor only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, video_url, order_index } = req.body;

    // Verify instructor owns the lesson's course
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id, courses(instructor_id)')
      .eq('id', id)
      .single();

    if (!lesson || lesson.courses.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this lesson' });
    }

    const { data: updatedLesson, error } = await supabase
      .from('lessons')
      .update({ title, description, video_url, order_index })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lesson (instructor only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify instructor owns the lesson's course
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id, courses(instructor_id)')
      .eq('id', id)
      .single();

    if (!lesson || lesson.courses.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this lesson' });
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;