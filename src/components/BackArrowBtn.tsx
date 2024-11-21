import React, { Dispatch, SetStateAction } from "react";
import ArrowBtn from "@/assets/icons/arrow.svg";
import { useRouter } from "next/navigation";
import { cva, VariantProps } from "class-variance-authority";
import { usePostStore } from "@/stores/post.store";

const arrowBtnVariants = cva("flex gap-8", {
  variants: {
    intent: {
      profilePage: "items-center",
      detailPostPage: "fixed z-20 bg-inherit w-full py-6 px-[25px]",
      commentModal: "w-full py-6 px-[25px]",
      profileEditModal: "",
    },
  },
  defaultVariants: {
    intent: "detailPostPage",
  },
});

export type ArrowBtnVariantsType = VariantProps<typeof arrowBtnVariants>;

type BackArrowBtnProp = {
  type?: "page" | "modal";
  setModalClick?: Dispatch<SetStateAction<boolean>>;
} & ArrowBtnVariantsType;

function BackArrowBtn({
  type = "page",
  setModalClick,
  intent,
}: BackArrowBtnProp) {
  const router = useRouter();
  const { setIsModalOpen } = usePostStore();

  const handleBackClick = () => {
    router.back();
  };

  const handleCloseClick = () => {
    if (setModalClick) setModalClick(false);
    else setIsModalOpen("closed");
  };

  return (
    <div className={arrowBtnVariants({ intent })}>
      <button onClick={type === "page" ? handleBackClick : handleCloseClick}>
        <ArrowBtn width="15" height="14" />
      </button>
      <p>홈으로</p>
    </div>
  );
}

export default BackArrowBtn;
