import { NextResponse } from 'next/server';

export function middleware(req) {
  const { cookies } = req;
  const token = cookies.authToken; // Use cookies or get from headers

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

// You can specify which routes the middleware should apply to:
export const config = {
  matcher: ['/'], // Apply to certain routes, or use ['/:path*'] for all
};
