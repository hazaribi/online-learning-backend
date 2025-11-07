-- Sample Data for Online Learning Platform
-- Run this after creating the schema

-- Insert sample instructor user
INSERT INTO users (id, email, password, name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'instructor@example.com', '$2a$12$LQv3c1yqBwEHxv68fVFoSO7hSdY6d/wjTvteRf.rqOFmRr9e7Fu', 'John Instructor', 'instructor');

-- Insert sample courses
INSERT INTO courses (id, title, description, price, category, thumbnail_url, instructor_id, status) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'JavaScript Fundamentals', 'Learn the basics of JavaScript programming', 49.99, 'Programming', 'https://via.placeholder.com/300x200?text=JavaScript', '550e8400-e29b-41d4-a716-446655440000', 'published'),
('660e8400-e29b-41d4-a716-446655440002', 'React Development', 'Build modern web applications with React', 79.99, 'Web Development', 'https://via.placeholder.com/300x200?text=React', '550e8400-e29b-41d4-a716-446655440000', 'published'),
('660e8400-e29b-41d4-a716-446655440003', 'Node.js Backend', 'Create powerful backend APIs with Node.js', 69.99, 'Backend', 'https://via.placeholder.com/300x200?text=Node.js', '550e8400-e29b-41d4-a716-446655440000', 'published');

-- Insert sample lessons
INSERT INTO lessons (course_id, title, description, video_url, duration, order_index, is_free) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Introduction to JavaScript', 'What is JavaScript and why learn it?', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 600, 1, true),
('660e8400-e29b-41d4-a716-446655440001', 'Variables and Data Types', 'Understanding JavaScript variables', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 900, 2, false),
('660e8400-e29b-41d4-a716-446655440002', 'React Components', 'Building your first React component', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 1200, 1, true),
('660e8400-e29b-41d4-a716-446655440003', 'Express.js Setup', 'Setting up your first Express server', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 800, 1, true);

-- Insert sample quizzes
INSERT INTO quizzes (course_id, title, questions, passing_score) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'JavaScript Basics Quiz', '[
  {
    "question": "What is JavaScript?",
    "options": ["A programming language", "A markup language", "A database", "An operating system"],
    "correct_answer": "0"
  },
  {
    "question": "Which keyword is used to declare variables in JavaScript?",
    "options": ["var", "let", "const", "All of the above"],
    "correct_answer": "3"
  }
]', 70);