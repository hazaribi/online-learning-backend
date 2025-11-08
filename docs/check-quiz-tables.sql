-- Check if quiz tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('quizzes', 'quiz_attempts', 'quiz_questions');

-- Check quizzes table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quizzes';

-- Check existing quizzes
SELECT * FROM quizzes LIMIT 5;