import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const profileVariants = cva("relative aspect-square flex-shrink-0", {
  variants: {
    intent: {
      post: "w-[46px] h-[46px]",
      two: "w-7 h-7",
      three: "w-[23px] h-[23px]",
      edit: "absolute w-[166px] h-[166px] cursor-default",
    },
  },
  defaultVariants: {
    intent: "post",
  },
});

export type ProfileVariantsType = VariantProps<typeof profileVariants>;

// 지금 컴포넌트 props type
type ProfileBtnProps = {
  userId: string;
  profileUrl: string;
} & ProfileVariantsType;

function ProfileBtn({ userId, profileUrl, intent }: ProfileBtnProps) {
  const router = useRouter();

  const handleProfileClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // 편집때 쓰이는 프로필은 클릭하면 페이지 이동 없게
    if (intent === "edit") return;
    e.stopPropagation();
    router.push(`/${userId}`);
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
