-- Check current courses and their status
SELECT id, title, status, category FROM courses;

-- Update all courses to published status
UPDATE courses SET status = 'published' WHERE status IS NULL OR status = 'draft';

-- Verify the update
SELECT id, title, status, category FROM courses;