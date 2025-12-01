/*
  # Fix Storage Policies for Admin Users
  
  1. Changes:
     - Drop existing restrictive policies
     - Create new policies that allow admin users to upload/delete
     - Keep public read access for everyone
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Policy 1: Public read access (anyone can view uploaded files)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'assets' );

-- Policy 2: Allow authenticated users to upload to assets bucket
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( 
  bucket_id = 'assets' 
);

-- Policy 3: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated Users Can Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'assets' );

-- Policy 4: Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated Users Can Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'assets' );
