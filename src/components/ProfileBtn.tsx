import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function ProfileBtn({
  userId,
  profileUrl,
}: {
  userId: string;
  profileUrl: string;
}) {
  const router = useRouter();

  const handleProfileClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    router.push(`/${userId}`);
  };
  return (
    <button
      onClick={handleProfileClick}
      className="relative w-[46px] h-[46px] rounded-full aspect-square bg-gray-50 flex-shrink-0"
    >
      <Image
        src={profileUrl}
        alt="profile image"
        fill
        className="absolute object-cover max-h-[46px] rounded-full"
      />
    </button>
  );
}

export default ProfileBtn;
