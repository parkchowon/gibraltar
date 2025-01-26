"use client";
import { findDuplicateHandle } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { invalidCheckId } from "@/utils/invalidCheck";
import { generateRandomHandle } from "@/utils/randomId";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";
import { useProfileStore } from "@/stores/profile.store";
import { profileUpdate } from "@/apis/profile.api";
import { MAX_HANDLE_LENGTH, MAX_NICKNAME_LENGTH } from "@/constants/textLength";
import LogoLoading from "@/components/Loading/LogoLoading";

function SettingProfile() {
  const { userData, isPending, refetch: userRefetch } = useAuth();
  const { putNickname } = useProfileStore();

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
  const handleSubmit = async () => {
    if (!isPending && userData && idRef.current) {
      const updateData = {
        nickname: nickRef.current?.value,
        handle: `@${idRef.current.value}`,
        file: file,
        userId: userData.id,
      };
      putNickname(nickRef.current?.value ?? "");
      const isFailed = await profileUpdate(updateData);
      userRefetch();
      return isFailed;
    }
  };

  const checkPass = isInvalid === "사용가능한 아이디예요." && isNickOK;

  if (isPending || !userData) {
    return (
      <div className="w-full h-screen">
        <LogoLoading />
      </div>
    );
  }
  return (
    <ProfileSettingContainer
      title="프로필을 만들어볼까요?"
      sub="나를 표현하는 프로필을 만들어보세요."
    >
      <div className="flex flex-col w-full lg:pt-[82px] pt-12 pb-[23px] items-center">
        <div className="relative lg:w-[200px] lg:h-[200px] w-24 h-24 mb-[84px]">
          <Image
            src={profileImg ? profileImg : userData.profile_url}
            alt="profile"
            fill
            className="absolute rounded-full object-cover object-center"
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
            className="flex justify-center items-center absolute bottom-0 right-0 lg:w-12 lg:h-12 w-8 h-8 rounded-full bg-black opacity-25"
          >
            <Image
              alt="camera"
              width={25}
              height={25}
              src={"/icons/camera.svg"}
              className="lg:w-6 lg:h-6 w-4 h-4"
            />
          </button>
        </div>
        {/* input 받는 곳 */}
        <label className="relative">
          <p className="text-xs lg:text-sm pl-2">닉네임</p>
          <input
            type="text"
            ref={nickRef}
            className="lg:w-[356px] w-52 lg:py-3 py-1 lg:px-[18px] px-3 border-b-[1px] text-sm lg:text-base outline-none"
            defaultValue={userData.nickname}
            maxLength={MAX_NICKNAME_LENGTH}
            onChange={handleNickChange}
            placeholder="닉네임을 입력해주세요"
          />
          <Image
            alt="edit"
            width={24}
            height={24}
            src={"/icons/edit.svg"}
            className="absolute lg:bottom-3 lg:right-6 lg:w-6 lg:h-6 w-4 h-4 right-3 bottom-1"
          />
        </label>
        <label className=" mt-3">
          <p className="text-xs lg:text-sm pl-2">아이디</p>
          <div className="relative">
            <input
              ref={idRef}
              onChange={handleIdChange}
              type="text"
              maxLength={MAX_HANDLE_LENGTH}
              autoFocus
              defaultValue={id}
              placeholder="아이디를 입력해주세요"
              className="lg:w-[356px] w-52 lg:py-3 py-1 lg:px-[18px] px-3 border-b-[1px] text-sm lg:text-base outline-none"
            />
            <button onClick={handleIdDelete}>
              <Image
                alt="edit"
                width={15}
                height={15}
                src={"/icons/circle_x.svg"}
                className="absolute lg:bottom-[18px] lg:right-6 right-3 bottom-2 w-3 h-3"
              />
            </button>
          </div>
          <p
            className={`${
              isInvalid === "사용가능한 아이디예요."
                ? "text-mint"
                : "text-warning"
            } lg:text-sm text-xs pt-1.5 pl-4`}
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
