"use client";
import { getUser } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingProfile() {
  const { isInitialized, user } = useAuth();

  const { isPending, data: userData } = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => {
      if (user) {
        return getUser(user.id);
      }
    },
    enabled: isInitialized,
  });

  if (isPending || !userData) {
    return <p>loading...</p>;
  }
  return (
    <ProfileSettingContainer
      title="프로필을 만들어볼까요?"
      sub="나를 표현하는 프로필을 만들어보세요."
    >
      <div className="flex flex-col w-full pt-[82px] pb-[130px] items-center">
        <div className="relative w-[200px] h-[200px] mb-[84px]">
          <Image
            src={userData.profile_url}
            width={200}
            height={200}
            alt="profile"
            className="absolute rounded-full"
          />
          <button className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-black opacity-25" />
        </div>
        <input
          type="text"
          className="w-[356px] py-3 px-[18px] border-b-[1px] font-medium"
          defaultValue={userData.nickname}
        />
      </div>
    </ProfileSettingContainer>
  );
}

export default SettingProfile;
