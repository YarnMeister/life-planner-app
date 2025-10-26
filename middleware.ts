import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for route protection and request handling
 * 
 * This middleware runs on Edge runtime for fast response times.
 * For auth protection, we rely on API routes to validate tokens.
 * This middleware primarily handles redirects for unauthenticated users.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/verify', '/mantine-demo'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // If accessing a public route with a token, redirect to home
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * Only run on protected dashboard routes to avoid blocking dev during Phase 1
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};

