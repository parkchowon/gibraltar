"use client";
import { useRouter, useSearchParams } from "next/navigation";

type ButtonProps = {
  text?: string;
  isClickable?: boolean;
  onClick: () => Promise<void | boolean>;
};
function NextStepButton({
  text = "다음단계로",
  isClickable = true,
  onClick,
}: ButtonProps) {
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step");

  const handleClickNext = async () => {
    const result = await onClick();
    if (result === true) {
      return confirm("프로필 업데이트 중 오류");
    }

    if (Number(step) < 6) {
      router.push(`/profile-setting?step=${Number(step) + 1}`);
    } else {
      router.push("/home");
    }
  };

  return (
    <button
      onClick={handleClickNext}
      disabled={!isClickable}
      className={`w-[352px] ${
        isClickable
          ? "bg-mint text-white font-extrabold text-lg"
          : "bg-[#E5E5E5] cursor-not-allowed"
      } rounded-full py-[19px] font-extrabold text-lg text-[#6A6A6A]`}
    >
      {step === "6" ? "지브롤터 시작하기" : "다음 단계로"}
    </button>
  );
}

export default NextStepButton;
