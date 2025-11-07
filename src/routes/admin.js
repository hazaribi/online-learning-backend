const express = require('express');
const { supabase } = require('../../config/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Get user count
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get course count
    const { count: courseCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get enrollment count
    const { count: enrollmentCount } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true });

    // Get revenue
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) || 0;

    res.json({
      stats: {
        users: userCount || 0,
        courses: courseCount || 0,
        enrollments: enrollmentCount || 0,
        revenue: totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all courses with stats
router.get('/courses', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users(name),
        enrollments(id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const coursesWithStats = courses.map(course => ({
      ...course,
      enrollment_count: course.enrollments?.length || 0,
      enrollments: undefined
    }));

    res.json({ courses: coursesWithStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;