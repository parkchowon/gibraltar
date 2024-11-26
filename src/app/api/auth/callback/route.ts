import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const LOGIN_KEY = "sb-zdumabzfaygdbxnucjib-auth-token";

// TODO: 트위터로 로그인하고 돌아오면 auth/error 화면으로 돌아감..
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const supabase = createClient();
  const searchParams = url.searchParams;
  const origin = url.origin;
  const code = searchParams.get("code");

  if (code) {
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.exchangeCodeForSession(code);
      if (authError) {
        return NextResponse.redirect(
          `${origin}/auth/error?reason=${encodeURIComponent(authError.message)}`
        );
      }

      // userId가 없을 경우
      if (session) {
        const userId = session?.user.id;
        if (!userId) {
          console.error("User ID is undefined");
          return NextResponse.redirect("/auth/error");
        }

        // user_profiles 테이블에 없을 경우 최초 가입자.
        const { data, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (profileError && profileError.code !== "PGRST116") {
          console.error(profileError);
          return NextResponse.redirect(`${origin}/auth/error`);
        }
        const redirectUrl = data !== null ? "/home" : "/profile-setting?step=1";
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      }
    } catch (e) {
      return NextResponse.redirect(
        `${origin}/auth/error?reason=${encodeURIComponent(`${e}`)}`
      );
    }
  }
  return NextResponse.redirect(
    `${url.origin}/auth/error?reason=${encodeURIComponent("No code provided")}`
  );
}
