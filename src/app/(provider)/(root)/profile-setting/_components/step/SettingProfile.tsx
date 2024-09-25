"use client";
import { findDuplicateHandle, profileUpdate } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { invalidCheckId } from "@/utils/invalidCheck";
import { generateRandomHandle } from "@/utils/randomId";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingProfile() {
  const { userData, isPending } = useAuth();
  const [isInvalid, setIsInvalid] = useState<string>("");
  const [isNickOK, setIsNickOK] = useState<boolean>(true);
  const [profileImg, setProfileImg] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [id, setID] = useState<string>(generateRandomHandle());
  const idRef = useRef<HTMLInputElement>(null);
  const nickRef = useRef<HTMLInputElement | null>(null);

  const findSameHandle = async (handle: string) => {
    const result = await findDuplicateHandle(handle);
    if (result) {
      setIsInvalid("중복된 아이디 입니다.");
    }
  };

  useEffect(() => {
    const result = findSameHandle(id);
    if (!!result) {
      setIsInvalid("사용가능한 아이디예요.");
    }
  }, []);

  /** 이미지 변경 로직 */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    const reader = new FileReader();
    if (file) {
      console.log(file);
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileClick = () => {
    document.getElementById("file-input")?.click();
  };

  /** 닉네임 관련 함수 */
  // 닉네임 onChange
  const handleNickChange = () => {
    if (nickRef.current) {
      setIsNickOK(!!nickRef.current.value);
    }
  };

  /** ID 관련 함수 */

  // 아이디 x 누르면 input clear
  const handleIdDelete = () => {
    if (idRef.current) {
      idRef.current.value = "";
      setIsInvalid("");
    }
  };

  // 아이디 onChange
  const handleIdChange = () => {
    if (idRef.current) {
      const text = invalidCheckId(idRef.current.value);
      setIsInvalid(text);
      findSameHandle(idRef.current.value);
    }
  };

  /** 버튼 누를 때 함수 */
  const handleSubmit = () => {
    if (!isPending && userData && idRef.current) {
      const updateData = {
        nickname: nickRef.current?.value,
        handle: `@${idRef.current.value}`,
        file: file,
        userId: userData.id,
      };
      profileUpdate(updateData);
    }
  };

  const checkPass = isInvalid === "사용가능한 아이디예요." && isNickOK;

  if (isPending || !userData) {
    return <p>loading...</p>;
  }
  return (
    <ProfileSettingContainer
      title="프로필을 만들어볼까요?"
      sub="나를 표현하는 프로필을 만들어보세요."
    >
      <div className="flex flex-col w-full pt-[82px] pb-[23px] items-center">
        <div className="relative w-[200px] h-[200px] mb-[84px]">
          <Image
            src={profileImg ? profileImg : userData.profile_url}
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
            ref={nickRef}
            className="w-[356px] py-3 px-[18px] border-b-[1px] font-medium outline-none"
            defaultValue={userData.nickname}
            maxLength={20}
            onChange={handleNickChange}
            placeholder="닉네임을 입력해주세요"
          />
          <Image
            alt="edit"
            width={24}
            height={24}
            src={"/icons/edit.svg"}
            className="absolute bottom-3 right-6"
          />
        </label>
        <label className=" mt-3">
          <p className="text-sm pl-2">아이디</p>
          <div className="relative">
            <input
              ref={idRef}
              onChange={handleIdChange}
              type="text"
              maxLength={15}
              autoFocus
              defaultValue={id}
              placeholder="아이디를 입력해주세요"
              className="w-[356px] py-3 px-[18px] border-b-[1px] font-medium outline-none"
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
          </div>
          <p
            className={`${
              isInvalid === "사용가능한 아이디예요."
                ? "text-mint"
                : "text-warning"
            } text-sm pt-1.5 pl-4`}
          >
            {isInvalid}
          </p>
        </label>
      </div>
      <NextStepButton isClickable={checkPass} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingProfile;
