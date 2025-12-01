import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('key');

    if (error) throw error;

    // Convert array to object for easier access
    const settings: Record<string, string> = {};
    data?.forEach(item => {
      settings[item.key] = item.value || '';
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Ayarlar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Geçersiz veri formatı' },
        { status: 400 }
      );
    }

    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from('site_settings')
        .update({ value: String(value), updated_at: new Date().toISOString() })
        .eq('key', key)
    );

    const results = await Promise.all(updates);
    
    // Check for errors
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error('Update errors:', errors);
      throw new Error('Bazı ayarlar güncellenemedi');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ayarlar başarıyla kaydedildi' 
    });
  } catch (error) {
    console.error('Save settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Ayarlar kaydedilirken hata oluştu' },
      { status: 500 }
    );
  }
}
