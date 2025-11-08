-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true);

-- Create storage policies for videos bucket
CREATE POLICY "Anyone can view videos" ON storage.objects 
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Instructors can upload videos" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'videos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Instructors can update their videos" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Instructors can delete their videos" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);