import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAccessToken = request.cookies.has("accessToken");
  const hasRefreshToken = request.cookies.has("refreshToken");
  const hasLegacyToken = request.cookies.has("token");
  const isAuthenticated = hasAccessToken || hasRefreshToken || hasLegacyToken;

  // Strictly protected routes: /candidate/*, /recruiter/*, /admin/* (excluding /admin/login)
  const isCandidateProtected =
    pathname === "/candidate" || pathname.startsWith("/candidate/");
  const isRecruiterProtected =
    pathname === "/recruiter" || pathname.startsWith("/recruiter/");
  const isAdminProtected =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/login");
  const isProtectedRoute =
    isCandidateProtected || isRecruiterProtected || isAdminProtected;

  // Explicit authentication routes
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname === "/candidate-login" ||
    pathname === "/recruiter-login" ||
    pathname === "/candidate-signup" ||
    pathname === "/recruiter-signup" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password";

  // Authentication routes are always accessible; never redirect them to themselves
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated visitors attempting to access protected dashboards
  if (isProtectedRoute && !isAuthenticated) {
    // Admin routes redirect strictly to the dedicated /admin/login gateway
    if (isAdminProtected) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin" && pathname !== "/admin/dashboard") {
        adminLoginUrl.searchParams.set("returnUrl", pathname);
      }
      return NextResponse.redirect(adminLoginUrl);
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "role",
      isRecruiterProtected ? "recruiter" : "candidate",
    );

    // Only attach returnUrl for genuine protected routes, never for auth pages or root
    if (!isAuthRoute && pathname !== "/") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  // All other public routes (home, about, terms, etc.) are allowed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/candidate/:path*",
    "/recruiter/:path*",
    "/admin/:path*",
    "/admin",
    "/login",
    "/register",
    "/admin/login",
    "/candidate-login",
    "/recruiter-login",
    "/candidate-signup",
    "/recruiter-signup",
  ],
};

export { proxy as middleware };
export default proxy;
