import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const profileVariants = cva("relative aspect-square flex-shrink-0", {
  variants: {
    intent: {
      post: "w-10 h-10 lg:w-[46px] lg:h-[46px]",
      card: "lg:w-[106px] lg:h-[106px] w-16 h-16",
      two: "w-7 h-7",
      three: "w-[23px] h-[23px]",
      edit: "absolute lg:w-[155px] lg:h-[155px] w-24 h-24 cursor-default",
      quote: "w-[46px] h-[46px] cursor-default",
      miniQuote: "w-6 h-6 cursor-default",
    },
  },
  defaultVariants: {
    intent: "post",
  },
});

export type ProfileVariantsType = VariantProps<typeof profileVariants>;

// 지금 컴포넌트 props type
type ProfileBtnProps = {
  handle?: string;
  profileUrl: string;
  type?: "non-click" | "click";
} & ProfileVariantsType;

function ProfileBtn({
  handle,
  profileUrl,
  intent,
  type = "click",
}: ProfileBtnProps) {
  const router = useRouter();

  const handleProfileClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // 편집때 쓰이는 프로필은 클릭하면 페이지 이동 없게
    if (type === "non-click") return;
    e.stopPropagation();
    router.push(`/${handle}`);
  };

  return (
    <button
      onClick={handleProfileClick}
      className={profileVariants({ intent })}
    >
      <Image
        src={profileUrl}
        alt="profile image"
        fill
        className="absolute object-cover rounded-full"
      />
    </button>
  );
}

export default ProfileBtn;
