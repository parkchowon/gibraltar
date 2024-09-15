import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./supabase/middleware";

const LOGIN_KEY = "sb-zdumabzfaygdbxnucjib-auth-token.0";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (pathname === "/") {
    if (!request.cookies.get(LOGIN_KEY)) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    url.pathname = "/home";
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
