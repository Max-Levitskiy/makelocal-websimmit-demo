import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware for MakeLocal authentication
 * Runs on every request to protected routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp|woff|woff2)$/)
  ) {
    return NextResponse.next();
  }

  // Get the MakeLocal session cookie
  // The cookie name format is: sb-{projectRef}-auth-token
  // For now, we'll look for any sb-*-auth-token cookie
  const authCookie = request.cookies
    .getAll()
    .find((cookie) => cookie.name.match(/^sb-.*-auth-token$/));

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add custom header to indicate if user is authenticated
  if (authCookie) {
    requestHeaders.set("x-makelocal-auth", "true");
    requestHeaders.set("x-makelocal-auth-cookie", authCookie.name);
  } else {
    requestHeaders.set("x-makelocal-auth", "false");
  }

  // Add pathname for client-side access
  requestHeaders.set("x-pathname", pathname);

  // For protected routes, we'll let the client-side auth provider handle redirects
  // Since this is anonymous auth, we don't want to block initial page loads
  // The AuthProvider will ensure session is created on client-side

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Configure which routes the middleware runs on
 * Run on all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
