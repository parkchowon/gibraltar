import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  const url = new URL(request.url);
  const supabase = createClient();
  const searchParams = url.searchParams;
  const origin = url.origin;
  const code = searchParams.get('code')
  const isProfileSetting = request.cookies.get('hasProfileSetting');

  if(code){
    try{
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(`${origin}/auth/error`);
      }
      const redirectUrl = isProfileSetting ? '/home' : '/profile-setting?step=1';
      return NextResponse.redirect(`${origin}${redirectUrl}`)
  
    } catch (e){
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}