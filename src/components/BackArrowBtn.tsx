import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ArrowBtn from "@/assets/icons/arrow.svg";
import { usePathname, useRouter } from "next/navigation";
import { cva, VariantProps } from "class-variance-authority";
import { usePostStore } from "@/stores/post.store";

const arrowBtnVariants = cva("flex gap-8 py-6", {
  variants: {
    intent: {
      page: "sticky top-0 z-20 w-full px-[25px] border-gray-300 border-b-[1px] bg-gray-200 bg-opacity-60 backdrop-blur-md",
      commentModal: "w-full px-[25px]",
      profileEditModal:
        "absolute top-0 left-0 w-full h-fit bg-white z-30 border-b-[1px] px-6 rounded-t-2xl",
    },
  },
  defaultVariants: {
    intent: "page",
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
  const pathname = usePathname();
  const [title, setTitle] = useState<string>("뒤로가기");

  useEffect(() => {
    switch (pathname) {
      case "/home":
        return setTitle("홈");
      case "/notifications":
        return setTitle("알림");
      case "/info":
        return setTitle("오버워치 정보");
      case "/group":
        return setTitle("그룹찾기");
      default:
        return setTitle("뒤로가기");
    }
  }, [pathname]);

  const { setIsModalOpen } = usePostStore();

  const handleBackClick = () => {
    router.back();
  };

  const handleCloseClick = () => {
    if (setModalClick) setModalClick(false);
    else setIsModalOpen("closed");
  };

  return (
    <div className={`${arrowBtnVariants({ intent })}`}>
      {title === "뒤로가기" ? (
        <button onClick={type === "page" ? handleBackClick : handleCloseClick}>
          <ArrowBtn width="15" height="14" />
        </button>
      ) : null}
      <p className={`${title !== "뒤로가기" && "font-semibold px-5"}`}>
        {title}
      </p>
    </div>
  );
}

export default BackArrowBtn;
