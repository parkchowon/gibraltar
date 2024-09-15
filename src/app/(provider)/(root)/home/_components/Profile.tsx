"use client";
import { UserDataProps } from "@/types/home.type";
import Image from "next/image";

function Profile({ userData, isPending }: UserDataProps) {
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
        </div>
        <p>오버워치 하는 중</p>
      </div>
      <button></button>
    </div>
  );
}

export default Profile;
