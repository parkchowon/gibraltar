"use client";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";

function Profile() {
  const { userData, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex w-full mt-[37px] mb-[60px] py-4 px-5 rounded-2xl bg-white">
        <div className="relative w-[50px] h-[50px] aspect-square mr-[30px] rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-2">
          <p className="bg-gray-300 h-5 w-20 rounded-md"></p>
          <p className="bg-gray-300 h-5 w-40 rounded-md"></p>
        </div>
        <button></button>
      </div>
    );
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
        <div className="flex items-center gap-x-1.5">
          <div className="w-[9px] h-[9px] rounded-full bg-mint" />
          <p className="text-xs text-gray-400">오버워치 하는 중</p>
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

export default Profile;
