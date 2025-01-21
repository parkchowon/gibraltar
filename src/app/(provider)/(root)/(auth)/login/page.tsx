"use client";
import supabase from "@/supabase/client";
import { Provider } from "@supabase/supabase-js";
import Logo from "@/assets/logo/gibraltar_logo.svg";
import LetterLogo from "@/assets/logo/gibraltar_letter.svg";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth.context";

function LoginPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useAuth();

  const handleSocialLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseURL}/api/auth/callback`,
      },
    });

    if (error) {
      console.error("소셜로그인 에러 : ", error);
    }
  };

  // useEffect(() => {
  //   if (user?.id) {
  //     window.location.reload();
  //   }
  // }, [user]);

  return (
    <main className="flex h-screen w-full justify-center items-center">
      <div className="w-52 h-52 rounded-full mr-[187px]">
        <div className="flex flex-col gap-4">
          <Logo />
          <LetterLogo />
        </div>
      </div>
      <div className="flex flex-col w-[380px] gap-20">
        <p className="text-4xl font-medium">지브롤터로 떠납니다</p>
        <div className="flex flex-col w-full text-center">
          <p className="py-4">소셜로그인</p>
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="h-fit py-3 px-[35px] mb-[11px] bg-[#FEE500] rounded-full text-xl text-left font-medium"
          >
            카카오로 시작하기
          </button>
          <button
            onClick={() => handleSocialLogin("twitter")}
            className="h-fit py-3 px-[35px] mb-[11px] bg-[#00acee] rounded-full text-xl text-left text-white font-medium"
          >
            트위터로 시작하기
          </button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
