const express = require('express');
const Course = require('../models/Course');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new course (Instructor only)
router.post('/', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const { title, description, price, category, thumbnail_url } = req.body;
    
    const course = await Course.create({
      title,
      description,
      price,
      category,
      thumbnail_url,
      instructor_id: req.user.id
    });

    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (!course.isOwnedBy(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updatedCourse = await course.update(updates);
    res.json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (!course.isOwnedBy(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await course.delete();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get courses by instructor
router.get('/instructor/:instructorId', authenticateToken, async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    // Check if user is requesting their own courses or is admin
    if (req.user.id !== instructorId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const courses = await Course.findByInstructor(instructorId);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;