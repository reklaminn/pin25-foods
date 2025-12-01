/*
  # Create Assets Storage Bucket
  1. Storage: 'assets' adında public bir bucket oluşturur.
  2. Security:
     - Herkesin dosyaları görmesine izin verir (Public Read).
     - Sadece giriş yapmış kullanıcıların dosya yüklemesine/silmesine izin verir.
*/

-- 'assets' bucket'ını oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Herkese okuma izni ver (Logo'nun sitede görünmesi için)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'assets' );

-- Policy 2: Giriş yapmış kullanıcılara yükleme izni ver
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'assets' );

-- Policy 3: Giriş yapmış kullanıcılara güncelleme izni ver
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'assets' );

-- Policy 4: Giriş yapmış kullanıcılara silme izni ver
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'assets' );
