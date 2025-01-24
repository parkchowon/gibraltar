"use client";
import supabase from "@/supabase/client";
import { Provider } from "@supabase/supabase-js";
import Logo from "@/assets/logo/gibraltar_logo.svg";
import LetterLogo from "@/assets/logo/gibraltar_letter.svg";
import { useAuth } from "@/contexts/auth.context";
import TwitterLogo from "@/assets/icons/twitter_logo.svg";
import KakaoLogo from "@/assets/icons/kakao_talk_logo.svg";
import Image from "next/image";

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

  return (
    <main className="flex flex-col lg:flex-row h-screen w-full justify-center items-center">
      <div className="fixed inset-0 -z-10">
        <Image
          src={"/background/gibraltar_bg_img.jpg"}
          alt="background"
          fill
          className="absolute object-cover"
        />
      </div>
      <div className="fixed inset-0 backdrop-blur-sm z-0" />
      <div className="w-52 h-52 rounded-full lg:mr-[187px] z-10 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <Logo />
          <LetterLogo />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-10 lg:backdrop-blur-sm w-[400px] gap-10 lg:gap-20 lg:h-screen lg:bg-white/85 z-10">
        <div className="flex flex-col gap-3">
          <p className="text-center lg:text-black text-white mt-10 lg:mt-0 lg:text-start lg:text-5xl text-2xl font-bold">
            환영합니다!
          </p>
          <p className="lg:text-black text-white">
            지브롤터의 새로운 시작을 함께해요
          </p>
        </div>
        <div className="flex flex-col w-[80%] lg:w-full text-center">
          <p className="py-4 font-bold lg:text-black text-white">소셜로그인</p>
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="flex gap-4 h-fit py-3 px-6 lg:px-[35px] mb-[11px] bg-[#FEE500] rounded-full text-base lg:text-base lg:text-left font-medium hover:brightness-95"
          >
            <KakaoLogo width={24} height={24} />
            <p>카카오로 시작하기</p>
          </button>
          <button
            onClick={() => handleSocialLogin("twitter")}
            className="flex gap-4 h-fit py-3 px-6 lg:px-[35px] mb-[11px] bg-[#00acee] rounded-full text-base lg:text-base lg:text-left text-white font-medium hover:brightness-95"
          >
            <TwitterLogo width={24} height={25} />
            <p>트위터로 시작하기</p>
          </button>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
