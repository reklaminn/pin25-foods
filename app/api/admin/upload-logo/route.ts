import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya formatı. PNG, JPG veya SVG kullanın.' },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Dosya boyutu 2MB\'dan küçük olmalıdır.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from('assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Yükleme hatası: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('assets')
      .getPublicUrl(filePath);

    // Update site_settings with new logo URL
    const { error: updateError } = await supabaseAdmin
      .from('site_settings')
      .update({ 
        value: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'logo_url');

    if (updateError) {
      console.error('Settings update error:', updateError);
      // Try to clean up uploaded file
      await supabaseAdmin.storage.from('assets').remove([filePath]);
      
      return NextResponse.json(
        { success: false, error: 'Logo URL kaydedilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'Logo başarıyla yüklendi'
    });

  } catch (error: any) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Delete old logo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL bulunamadı' },
        { status: 400 }
      );
    }

    // Extract file path from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `public/${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from('assets')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { success: false, error: 'Dosya silinemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Logo başarıyla silindi'
    });

  } catch (error: any) {
    console.error('Logo delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    );
  }
}
