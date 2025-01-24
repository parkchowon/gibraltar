import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const cookies = request.cookies.getAll();
  const isLoggedIn = cookies.some((cookie) => {
    console.log(cookie.name);
    return cookie.name.includes(`${process.env.NEXT_LOGIN_KEY}`);
  });

  if (!isLoggedIn) {
    if (pathname !== "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } else {
    if (pathname === "/") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
    if (pathname === "/login") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
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
