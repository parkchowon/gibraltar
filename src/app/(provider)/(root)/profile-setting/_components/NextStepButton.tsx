"use client";
import { useRouter, useSearchParams } from "next/navigation";

function NextStepButton({ text }: { text: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step");

  const handleClickNext = () => {
    if (step !== "6") {
      router.push(`/profile-setting?step=${Number(step) + 1}`);
    }
    router.push("/home");
  };

  return (
    <button
      onClick={handleClickNext}
      className="w-[352px] bg-mint rounded-full py-[19px] font-medium text-xl text-[#6A6A6A]"
    >
      {text}
    </button>
  );
}

export default NextStepButton;
