-- Add missing columns to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS lesson_count INTEGER DEFAULT 0;

-- Update existing courses with categories
UPDATE courses SET category = 'Web Development' WHERE category IS NULL;

-- Insert sample courses if none exist
INSERT INTO courses (title, description, price, instructor_id, status, category, thumbnail_url) 
SELECT * FROM (VALUES 
  ('Complete Web Development Bootcamp', 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and deploy them to production.', 99.99, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Web Development', 'https://picsum.photos/400/200?random=1'),
  ('Data Science with Python', 'Learn data analysis, machine learning, and visualization with Python. Work with pandas, numpy, matplotlib, and scikit-learn.', 79.99, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Data Science', 'https://picsum.photos/400/200?random=2'),
  ('Digital Marketing Masterclass', 'Complete guide to digital marketing including SEO, social media marketing, email marketing, and Google Ads.', 59.99, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Business', 'https://picsum.photos/400/200?random=3'),
  ('UI/UX Design Fundamentals', 'Learn user interface and user experience design principles. Master Figma, create wireframes, and design beautiful interfaces.', 0, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Design', 'https://picsum.photos/400/200?random=4'),
  ('React Native Mobile Development', 'Build cross-platform mobile apps with React Native. Learn navigation, state management, and publish to app stores.', 89.99, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Web Development', 'https://picsum.photos/400/200?random=5'),
  ('Machine Learning A-Z', 'Comprehensive machine learning course covering supervised and unsupervised learning, deep learning, and neural networks.', 129.99, (SELECT id FROM users WHERE role = 'instructor' LIMIT 1), 'published', 'Data Science', 'https://picsum.photos/400/200?random=6')
) AS v(title, description, price, instructor_id, status, category, thumbnail_url)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE courses.title = v.title);