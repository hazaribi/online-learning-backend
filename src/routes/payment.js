const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { course_id } = req.body;

    // Get course details
    const { data: course, error } = await supabase
      .from('courses')
      .select('title, price')
      .eq('id', course_id)
      .single();

    if (error || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(course.price * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/course/${course_id}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/course/${course_id}?payment=cancelled`,
      metadata: {
        user_id: req.user.id,
        course_id: course_id
      }
    });

    // Save payment record
    await supabase
      .from('payments')
      .insert([{
        user_id: req.user.id,
        course_id,
        amount: course.price,
        stripe_payment_id: session.id,
        status: 'pending'
      }]);

    res.json({ checkout_url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment (webhook)
router.post('/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { user_id, course_id } = session.metadata;

      console.log('Webhook received:', { user_id, course_id, session_id: session.id });

      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('stripe_payment_id', session.id);

      if (paymentError) {
        console.error('Payment update error:', paymentError);
      }

      // Create enrollment
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert([{
          user_id,
          course_id,
          enrolled_at: new Date().toISOString()
        }]);

      if (enrollmentError) {
        console.error('Enrollment creation error:', enrollmentError);
      } else {
        console.log('Enrollment created successfully');
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;