import React from "react";
import ArrowBtn from "@/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";
import { cva, VariantProps } from "class-variance-authority";

const arrowBtnVariants = cva("flex gap-8", {
  variants: {
    intent: {
      profilePage: "items-center",
      detailPostPage: "w-full py-6 px-[25px]",
    },
  },
  defaultVariants: {
    intent: "detailPostPage",
  },
});

export type ArrowBtnVariantsType = VariantProps<typeof arrowBtnVariants>;

type BackArrowBtnProp = ArrowBtnVariantsType;

function BackArrowBtn({ intent }: BackArrowBtnProp) {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className={arrowBtnVariants({ intent })}>
      <button onClick={handleBackClick}>
        <ArrowBtn width="15" height="14" />
      </button>
      <p>홈으로</p>
    </div>
  );
}

export default BackArrowBtn;
