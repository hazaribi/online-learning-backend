-- Insert sample courses with different categories and instructors
INSERT INTO courses (title, description, price, instructor_id, status, category, thumbnail_url) VALUES 
(
  'Complete Web Development Bootcamp',
  'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy them to production.',
  99.99,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Web Development',
  'https://picsum.photos/400/200?random=1'
),
(
  'Data Science with Python',
  'Learn data analysis, machine learning, and visualization with Python. Work with pandas, numpy, matplotlib, and scikit-learn.',
  79.99,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Data Science',
  'https://picsum.photos/400/200?random=2'
),
(
  'Digital Marketing Masterclass',
  'Complete guide to digital marketing including SEO, social media marketing, email marketing, and Google Ads.',
  59.99,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Business',
  'https://picsum.photos/400/200?random=3'
),
(
  'UI/UX Design Fundamentals',
  'Learn user interface and user experience design principles. Master Figma, create wireframes, and design beautiful interfaces.',
  0,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Design',
  'https://picsum.photos/400/200?random=4'
),
(
  'React Native Mobile Development',
  'Build cross-platform mobile apps with React Native. Learn navigation, state management, and publish to app stores.',
  89.99,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Web Development',
  'https://picsum.photos/400/200?random=5'
),
(
  'Machine Learning A-Z',
  'Comprehensive machine learning course covering supervised and unsupervised learning, deep learning, and neural networks.',
  129.99,
  (SELECT id FROM users WHERE role = 'instructor' LIMIT 1),
  'published',
  'Data Science',
  'https://picsum.photos/400/200?random=6'
);

-- Add lessons for the courses
INSERT INTO lessons (course_id, title, description, video_url, duration, order_index) 
SELECT 
  c.id,
  'Introduction to ' || c.title,
  'Welcome to the course! In this lesson, we will cover the basics and what you will learn.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  600,
  1
FROM courses c;

INSERT INTO lessons (course_id, title, description, video_url, duration, order_index) 
SELECT 
  c.id,
  'Getting Started',
  'Set up your development environment and create your first project.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  900,
  2
FROM courses c;

INSERT INTO lessons (course_id, title, description, video_url, duration, order_index) 
SELECT 
  c.id,
  'Advanced Concepts',
  'Dive deeper into advanced topics and best practices.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1200,
  3
FROM courses c;