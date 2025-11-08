-- Check if enrollments table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'enrollments';

-- Check current enrollments
SELECT 
  e.id,
  e.user_id,
  e.course_id,
  e.enrolled_at,
  u.name as user_name,
  c.title as course_title
FROM enrollments e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN courses c ON e.course_id = c.id
ORDER BY e.enrolled_at DESC;