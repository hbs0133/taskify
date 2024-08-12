// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  const { pathname } = request.nextUrl;

  // 로그인이 되어있지 않고 보호된 페이지에 접근하려는 경우
  if (!token) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/mydashboard') ||
      pathname.startsWith('/mypage')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    // 로그인이 되어있는데, 로그인 페이지나 메인 페이지에 접근하려는 경우
    if (pathname === '/signin' || pathname === '/signup' || pathname === '/') {
      return NextResponse.redirect(new URL('/mydashboard', request.url));
    }
  }

  // 기본적으로 요청을 그대로 반환
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/mydashboard/:path*',
    '/mypage/:path*',
    '/signin',
    '/signup',
    '/',
  ],
};
