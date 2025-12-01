import { supabase } from './supabase';

/**
 * Uploads a logo file to Supabase Storage
 */
export async function uploadLogo(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an old logo file from Supabase Storage
 */
export async function deleteOldLogo(url: string) {
  try {
    const path = url.split('/').pop();
    if (!path) return;

    await supabase.storage
      .from('assets')
      .remove([`public/${path}`]);
  } catch (error) {
    console.error('Delete error:', error);
  }
}

/**
 * Fetches the current logo URL from site settings
 */
export async function getLogoUrl(): Promise<string> {
  try {
    // Fetch from site_settings table using key-value pattern
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .single();

    if (error) {
      // If row doesn't exist (PGRST116), return default
      if (error.code !== 'PGRST116') {
        console.warn('Error fetching logo:', error.message);
      }
      return '/logo.svg';
    }

    if (data && data.value) {
      return data.value;
    }

    return '/logo.svg';
  } catch (error) {
    console.error('Unexpected error fetching logo:', error);
    return '/logo.svg';
  }
}
