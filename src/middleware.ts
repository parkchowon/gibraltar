import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./supabase/middleware";

// env.로
const LOGIN_KEY = "sb-zdumabzfaygdbxnucjib-auth-token";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    if (
      !request.cookies.get(`${LOGIN_KEY}.1`) &&
      !request.cookies.get(`${LOGIN_KEY}.0`)
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  if (pathname === "/login") {
    if (
      request.cookies.get(`${LOGIN_KEY}.1`) &&
      request.cookies.get(`${LOGIN_KEY}.0`)
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return;
  }

  if (
    pathname === "/home" &&
    !request.cookies.get(`${LOGIN_KEY}.1`) &&
    !request.cookies.get(`${LOGIN_KEY}.0`)
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
