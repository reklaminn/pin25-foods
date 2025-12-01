import { supabase } from './supabase';

/**
 * Get current admin session
 */
export async function getAdminSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Verify user is an admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, email, full_name, role, is_active')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !admin) {
      return null;
    }

    return {
      session,
      admin
    };
  } catch (error) {
    console.error('Get admin session error:', error);
    return null;
  }
}

/**
 * Sign out admin
 */
export async function signOutAdmin() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Çıkış yapılırken bir hata oluştu' };
  }
}

/**
 * Check if user is authenticated admin
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

/**
 * Require admin authentication (for server components)
 */
export async function requireAdminAuth() {
  const session = await getAdminSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
