import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const path = req.nextUrl.pathname;

  // Sadece /admin rotalarını izle
  if (path.startsWith('/admin')) {
    console.log(`[Middleware] Request: ${path}`);

    // 1. Login sayfasını atla
    if (path === '/admin/login') {
      console.log('[Middleware] Skipping login page check');
      return res;
    }

    // 2. Oturum kontrolü
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('[Middleware] Session Error:', sessionError.message);
    }

    if (!session) {
      console.log('[Middleware] No session found, redirecting to login');
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }

    console.log('[Middleware] Session found for user:', session.user.email);

    // 3. Admin yetki kontrolü
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, is_active, role')
      .eq('id', session.user.id)
      .single();

    if (adminError) {
      console.error('[Middleware] Admin DB Error:', adminError.message);
      // DB hatası olsa bile güvenli tarafta kalıp yetkisiz sayalım
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (!admin) {
      console.log('[Middleware] User is NOT in admins table');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (!admin.is_active) {
      console.log('[Middleware] Admin account is inactive');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    console.log('[Middleware] Admin access granted:', admin.role);
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
