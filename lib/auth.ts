import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Member Authentication
export async function memberLogin(email: string, password: string) {
  try {
    // Get member by email
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !member) {
      return { success: false, error: 'Email veya şifre hatalı' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, member.password_hash);
    if (!isValid) {
      return { success: false, error: 'Email veya şifre hatalı' };
    }

    // Update last login
    await supabase
      .from('members')
      .update({ last_login: new Date().toISOString() })
      .eq('id', member.id);

    // Remove password hash from response
    const { password_hash, ...memberData } = member;

    return { success: true, user: memberData, userType: 'member' };
  } catch (error) {
    console.error('Member login error:', error);
    return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
  }
}

export async function memberRegister(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('email', data.email)
      .single();

    if (existing) {
      return { success: false, error: 'Bu email adresi zaten kayıtlı' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create member
    const { data: member, error } = await supabase
      .from('members')
      .insert({
        email: data.email,
        password_hash: passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Member registration error:', error);
      return { success: false, error: 'Kayıt olurken bir hata oluştu' };
    }

    // Remove password hash from response
    const { password_hash, ...memberData } = member;

    return { success: true, user: memberData, userType: 'member' };
  } catch (error) {
    console.error('Member registration error:', error);
    return { success: false, error: 'Kayıt olurken bir hata oluştu' };
  }
}

// Update Member Profile
export async function updateMemberProfile(
  memberId: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }
) {
  try {
    // Check if email is already used by another member
    if (data.email) {
      const { data: existing } = await supabase
        .from('members')
        .select('id')
        .eq('email', data.email)
        .neq('id', memberId)
        .single();

      if (existing) {
        return { success: false, error: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' };
      }
    }

    // Update member
    const { data: member, error } = await supabase
      .from('members')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profil güncellenirken bir hata oluştu' };
    }

    // Remove password hash from response
    const { password_hash, ...memberData } = member;

    // Update localStorage
    saveUserSession(memberData, 'member');

    return { success: true, user: memberData };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Profil güncellenirken bir hata oluştu' };
  }
}

// Change Password
export async function changePassword(
  memberId: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    // Get member with password hash
    const { data: member, error } = await supabase
      .from('members')
      .select('password_hash')
      .eq('id', memberId)
      .single();

    if (error || !member) {
      return { success: false, error: 'Kullanıcı bulunamadı' };
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, member.password_hash);
    if (!isValid) {
      return { success: false, error: 'Mevcut şifre hatalı' };
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('members')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (updateError) {
      console.error('Password change error:', updateError);
      return { success: false, error: 'Şifre değiştirilirken bir hata oluştu' };
    }

    return { success: true };
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'Şifre değiştirilirken bir hata oluştu' };
  }
}

// Admin Authentication
export async function adminLogin(email: string, password: string) {
  try {
    // Get admin by email
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return { success: false, error: 'Email veya şifre hatalı' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return { success: false, error: 'Email veya şifre hatalı' };
    }

    // Update last login
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Remove password hash from response
    const { password_hash, ...adminData } = admin;

    return { success: true, user: adminData, userType: 'admin' };
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
  }
}

// Logout
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }
}

// Get current user
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (user && userType) {
      return { user: JSON.parse(user), userType };
    }
  }
  return null;
}

// Save user session
export function saveUserSession(user: any, userType: 'member' | 'admin') {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
  }
}
