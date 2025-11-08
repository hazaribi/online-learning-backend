-- Update course thumbnails with relevant images
UPDATE courses SET thumbnail_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop' WHERE title LIKE '%Web Development%';
UPDATE courses SET thumbnail_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop' WHERE category = 'Data Science';
UPDATE courses SET thumbnail_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop' WHERE category = 'Business';
UPDATE courses SET thumbnail_url = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop' WHERE category = 'Design';
UPDATE courses SET thumbnail_url = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop' WHERE title LIKE '%React Native%';