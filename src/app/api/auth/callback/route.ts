import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const origin = url.origin;
  const code = searchParams.get("code");

  console.log("Code: ", code);
  if (code) {
    try {
      const { error: authError } = await supabase.auth.exchangeCodeForSession(
        code
      );
      if (authError) {
        console.error("Auth Error: ", authError);
        return NextResponse.redirect(
          `${origin}/auth/error?reason=${encodeURIComponent(authError.message)}`
        );
      }

      const {
        data: { user },
        error: UserError,
      } = await supabase.auth.getUser();
      // userId가 없을 경우
      if (user) {
        const userId = user.id;

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
        const redirectUrl = data ? "/home" : "/profile-setting?step=1";
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
