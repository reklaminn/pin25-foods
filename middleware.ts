// Middleware tamamen devre dışı - Auth kontrolü layout'ta yapılıyor
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Hiçbir şey yapma, sadece geç
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
