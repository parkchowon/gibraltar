"use client";
import { useAuth } from "@/contexts/auth.context";
import { generateRandomHandle } from "@/utils/randomId";
import Image from "next/image";
import { ChangeEvent, useRef } from "react";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingProfile() {
  const { userData, isPending } = useAuth();
  const idRef = useRef<HTMLInputElement | null>(null);

  /** 이미지 변경 로직 */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  const handleProfileClick = () => {
    document.getElementById("file-input")?.click();
  };

  /** input 로직 */

  // 아이디 x 누르면 input clear
  const handleIdDelete = () => {
    if (idRef.current) {
      idRef.current.value = "";
    }
  };

  if (isPending || !userData) {
    return <p>loading...</p>;
  }
  return (
    <ProfileSettingContainer
      title="프로필을 만들어볼까요?"
      sub="나를 표현하는 프로필을 만들어보세요."
    >
      <div className="flex flex-col w-full pt-[82px] pb-[53px] items-center">
        <div className="relative w-[200px] h-[200px] mb-[84px]">
          <Image
            src={userData.profile_url}
            width={200}
            height={200}
            alt="profile"
            className="absolute rounded-full"
          />
          {/** 컴퓨터에서 사진 받는 input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="file-input"
            onChange={handleImageChange}
          />
          {/** 실제 사진을 고르기 위해 클릭하는 버튼 */}
          <button
            onClick={handleProfileClick}
            className="flex justify-center items-center absolute bottom-0 right-0 w-12 h-12 rounded-full bg-black opacity-25"
          >
            <Image
              alt="camera"
              width={25}
              height={25}
              src={"/icons/camera.svg"}
            />
          </button>
        </div>
        {/* input 받는 곳 */}
        <label className="relative">
          <p className="text-sm pl-2">닉네임</p>
          <input
            type="text"
            className="w-[356px] py-3 px-[18px] border-b-[1px] font-medium outline-none"
            defaultValue={userData.nickname}
          />
          <Image
            alt="edit"
            width={24}
            height={24}
            src={"/icons/edit.svg"}
            className="absolute bottom-3 right-6"
          />
        </label>
        <label className="relative mt-3">
          <p className="text-sm pl-2">아이디</p>
          <input
            ref={idRef}
            type="text"
            className="w-[356px] py-3 px-[18px] border-b-[1px] font-medium outline-none"
            defaultValue={generateRandomHandle()}
          />
          <button onClick={handleIdDelete}>
            <Image
              alt="edit"
              width={15}
              height={15}
              src={"/icons/circle_x.svg"}
              className="absolute bottom-[18px] right-6"
            />
          </button>
        </label>
      </div>
    </ProfileSettingContainer>
  );
}

export default SettingProfile;
