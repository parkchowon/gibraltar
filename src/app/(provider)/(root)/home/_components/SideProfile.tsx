"use client";
import SideProfileLoading from "@/components/Loading/SideProfileLoading";
import StatusModal from "@/components/Status/StatusModal";
import UserStatus from "@/components/Status/UserStatus";
import { USER_STATUS } from "@/constants/status";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";
import { useState } from "react";

function SideProfile() {
  const { userData, isPending } = useAuth();
  const [statusClick, setStatusClick] = useState<boolean>(false);
  const userState = userData?.status || "상태 표시 안 함";
  const status = {
    state: userState,
    color:
      USER_STATUS.find((state) => state.state === userState)?.color ||
      "#D4D4D4",
  };

  const handleStatusClick = () => {
    setStatusClick(!statusClick);
  };

  if (isPending) {
    return <SideProfileLoading />;
  }

  return (
    <div className="flex w-full mt-[37px] mb-[60px] py-4 px-5 rounded-2xl bg-white">
      <div className="relative w-[50px] h-[50px] aspect-square mr-[30px]">
        <Image
          alt="profile"
          src={userData?.profile_url ?? ""}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <div>
        <div className="flex">
          <p className="font-bold text-base">{userData?.nickname}</p>
          <p className="text-sm ml-1.5 text-gray-400">{userData?.handle}</p>
        </div>
        <div className="relative">
          {statusClick && userData && (
            <StatusModal userId={userData.id} setStatusClick={setStatusClick} />
          )}
          <button
            className="flex items-center gap-x-1.5"
            onClick={handleStatusClick}
          >
            <UserStatus status={status} intent={"side"} />
          </button>
        </div>
      </div>
      <button className="ml-auto">
        <Image
          width={30}
          height={30}
          alt="icon"
          src={"/icons/mypage_line.svg"}
        />
      </button>
    </div>
  );
}

export default SideProfile;
