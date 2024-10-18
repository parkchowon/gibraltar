import { createClient } from '@/supabase/server';
import { NextRequest, NextResponse } from "next/server";

const LOGIN_KEY = "sb-zdumabzfaygdbxnucjib-auth-token";


export async function GET(request:NextRequest) {
  const url = new URL(request.url);
  const supabase = createClient();
  const searchParams = url.searchParams;
  const origin = url.origin;
  const code = searchParams.get('code')

  if(code){
    try{
      const { data: {session}, error: authError } = await supabase.auth.exchangeCodeForSession(code);
      if (authError) {
        return NextResponse.redirect(`${origin}/auth/error`);
      }
      
      // userId가 없을 경우
      const userId = session?.user.id;
      if (!userId) {
        console.error('User ID is undefined');
        return NextResponse.redirect('/auth/error');
      }

      // user_profiles 테이블에 없을 경우 최초 가입자.
      const {data, error: profileError} = await supabase.from('user_profiles').select('*').eq('user_id', userId).single()
      if(profileError){
        console.error(profileError)
        return NextResponse.redirect(`${origin}/auth/error`)
      }
      const redirectUrl = data ? '/home' : '/profile-setting?step=1';
      return NextResponse.redirect(`${origin}${redirectUrl}`)
  
    } catch (e){
      return NextResponse.redirect(`${origin}/auth/error`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`);
}