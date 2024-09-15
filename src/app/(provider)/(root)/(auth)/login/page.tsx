"use client";
import supabase from "@/supabase/client";
import { Provider } from "@supabase/supabase-js";

function LoginPage() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleSocialLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${baseURL}/home`,
      },
    });

    if (error) {
      console.error("소셜로그인 에러 : ", error);
    }
  };

  return (
    <main className="flex h-screen w-full justify-center items-center">
      <div className="w-[450px] h-[450px] rounded-full mr-[187px] bg-gray-300" />
      <div className="flex flex-col w-[380px]">
        <p className="text-4xl font-medium mb-10">지브롤터로 떠납니다</p>
        <button
          onClick={() => handleSocialLogin("kakao")}
          className="h-fit py-4 px-[35px] mb-[11px] bg-[#FEE500] rounded-full text-[20px] text-left font-medium"
        >
          카카오로 시작하기
        </button>
        <button
          onClick={() => handleSocialLogin("twitter")}
          className="h-fit py-4 px-[35px] mb-[11px] bg-[#00acee] rounded-full text-[20px] text-left text-white font-medium"
        >
          트위터로 시작하기
        </button>
      </div>
    </main>
  );
}

export default LoginPage;
