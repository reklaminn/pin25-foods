import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 1. .env.local dosyasının yolunu bul
const envPath = path.resolve(process.cwd(), '.env.local');

// 2. Dosyanın varlığını kontrol et
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.error(`❌ .env.local file not found at ${envPath}`);
  // Fallback to .env if .env.local doesn't exist
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: Hangi değişkenlerin eksik olduğunu göster
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  // ... (rest of the script remains the same)
  // 30 saniye sonra otomatik kapanma zamanlayıcısı
  const timeout = setTimeout(() => {
    console.error('⚠️ Script timed out, forcing exit...');
    process.exit(1);
  }, 30000);

  try {
    console.log('🚀 Starting admin creation...');

    // 1. Auth Kullanıcısı Oluştur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@p25foods.com',
      password: 'Bjk1903!*',
      email_confirm: true,
      user_metadata: { full_name: 'Admin User', role: 'super_admin' }
    });

    let userId = authData.user?.id;

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️ User exists in Auth, fetching ID...');
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingUser = users?.find(u => u.email === 'admin@p25foods.com');
        if (existingUser) userId = existingUser.id;
      } else {
        throw authError;
      }
    }

    if (!userId) throw new Error('Could not get User ID');

    console.log(`✅ Auth User ID: ${userId}`);

    // 2. Veritabanı Kaydını Güncelle/Oluştur
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', 'admin@p25foods.com')
      .single();

    if (existingAdmin) {
      await supabase.from('admins').update({
        id: userId,
        is_active: true,
        role: 'super_admin'
      }).eq('email', 'admin@p25foods.com');
      console.log('✅ Existing admin record updated.');
    } else {
      await supabase.from('admins').insert({
        id: userId,
        email: 'admin@p25foods.com',
        full_name: 'Admin User',
        role: 'super_admin',
        is_active: true,
        created_at: new Date().toISOString()
      });
      console.log('✅ New admin record created.');
    }

    console.log('\n🎉 SUCCESS! Admin ready.');
    console.log('Login: admin@p25foods.com / Bjk1903!*');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    clearTimeout(timeout);
    process.exit(0);
  }
}

createAdminUser();
