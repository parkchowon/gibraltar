import BackArrowBtn from "@/components/BackArrowBtn";
import ReactDOM from "react-dom";
import styles from "@/styles/postbox.module.css";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ProfileBtn from "@/components/ProfileBtn";
import CameraIcon from "@/assets/icons/camera_edit.svg";
import EditInput from "../EditInput";
import GameTime from "./GameTime";
import DetailTitle from "./DetailTitle";
import GameStyle from "./GameStyle";
import GameTier from "./GameTier";
import GameMode from "./GameMode";
import FavHero from "./FavHero";
import FavTeam from "./FavTeam";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/apis/auth.api";

function ProfileEditModal({
  profileUser,
  setEditClick,
}: {
  profileUser: {
    created_at: string;
    email: string;
    handle: string;
    id: string;
    nickname: string;
    profile_url: string;
    status: string | null;
  };
  setEditClick: Dispatch<SetStateAction<boolean>>;
}) {
  const [nickname, setNickname] = useState<string>(profileUser.nickname);
  const [handle, setHandle] = useState<string>(profileUser.handle);
  const [bio, setBio] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [profileImg, setProfileImg] = useState<string>(profileUser.profile_url);

  const [isTimeClick, setIsTimeClick] = useState<boolean>(false);
  const [isStyleClick, setIsStyleClick] = useState<boolean>(false);
  const [isTeamClick, setIsTeamClick] = useState<boolean>(false);
  const [isTierClick, setIsTierClick] = useState<boolean>(false);
  const [isHeroClick, setIsHeroClick] = useState<boolean>(false);
  const [isModeClick, setIsModeClick] = useState<boolean>(false);

  const { data: profile, isPending } = useQuery({
    queryKey: ["profileDetail", profileUser.id],
    queryFn: () => getUserProfile(profileUser.id),
  });

  useEffect(() => {
    setBio(profile?.bio || "");
  }, [profile]);

  // 닉네임 수정
  const handleNickChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // TODO: 유효성 검사 추가가
    setNickname(e.currentTarget.value);
  };

  // handle(id) 수정
  const handleHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // TODO: handle 유효성 검사 추가
    setHandle(e.currentTarget.value);
  };

  // bio 수정정
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.currentTarget.value);
  };

  // img 클릭
  const handleProfileImgClick = () => {
    document.getElementById("file-input")?.click();
  };

  /** 이미지 변경 로직 */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDetailEditClick = (type: string) => {
    switch (type) {
      case "mode":
        return setIsModeClick(!isModeClick);
      case "time":
        return setIsTimeClick(!isTimeClick);
      case "style":
        return setIsStyleClick(!isStyleClick);
      case "team":
        return setIsTeamClick(!isTeamClick);
      case "tier":
        return setIsTierClick(!isTierClick);
      case "hero":
        return setIsHeroClick(!isHeroClick);
    }
  };

  if (isPending || !profile) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/35">
        <p>loading...</p>
      </div>
    );
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        onClick={() => setEditClick(false)}
        className="absolute w-full h-full inset-0 bg-black opacity-30"
      />
      <div
        className={`relative w-[38.3%] h-[90%] max-h-[90%] pb-[30px] bg-white rounded-2xl`}
      >
        {/* 홈으로 */}
        <BackArrowBtn
          intent={"profileEditModal"}
          type="modal"
          setModalClick={setEditClick}
        />
        <div
          id="modal"
          className={`flex flex-col px-6 pl-[9.7%] mt-[73px] pr-[71px] h-[650px] ${styles.customModalScrollbar} overflow-y-auto`}
        >
          <div className="flex justify-center items-center w-full py-10 gap-[46px]">
            {/* 프로필 사진 부분 */}
            <div className="relative w-fit h-fit flex items-center justify-center">
              <button
                onClick={handleProfileImgClick}
                className="absolute grid place-items-center w-10 h-10 bg-black rounded-full bg-opacity-40 z-20"
              >
                <CameraIcon width="25" height="25" color="white" />
              </button>
              <ProfileBtn
                profileUrl={profileImg}
                handle={profileUser.handle}
                intent={"edit"}
                type="non-click"
              />
              {/** 컴퓨터에서 사진 받는 input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-input"
                onChange={handleImageChange}
              />
            </div>
            {/* 닉네임, 아이디 수정 input 부분 */}
            <div className="flex flex-col flex-grow gap-3">
              <EditInput
                label="닉네임"
                value={nickname}
                onChange={handleNickChange}
              />
              <EditInput
                label="아이디"
                value={handle}
                onChange={handleHandleChange}
              />
              <EditInput
                label="바이오"
                value={bio}
                onChange={handleBioChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-semibold">세부 프로필</p>
            <DetailTitle
              title="플레이 모드"
              type="mode"
              onClick={handleDetailEditClick}
            />
            {isModeClick && <GameMode mode={profile.play_mode} />}
            <DetailTitle
              title="게임 시간대"
              type="time"
              onClick={handleDetailEditClick}
            />
            {isTimeClick && <GameTime time={profile.play_time} />}
            <DetailTitle
              title="게임 스타일"
              type="style"
              onClick={handleDetailEditClick}
            />
            {isStyleClick && <GameStyle style={profile.play_style} />}
            <DetailTitle
              title="티어"
              type="tier"
              onClick={handleDetailEditClick}
            />
            {isTierClick && (
              <GameTier tier={profile.tier} grade={profile.tier_grade} />
            )}
            <DetailTitle
              title="플레이 영웅"
              type="hero"
              onClick={handleDetailEditClick}
            />
            {isHeroClick && (
              <FavHero main={profile.main_champs} play={profile.play_champs} />
            )}
            <DetailTitle
              title="응원하는 팀"
              type="team"
              onClick={handleDetailEditClick}
            />
            {isTeamClick && <FavTeam team={profile.favorite_team} />}
          </div>
        </div>
        <div className="flex w-full h-fit pt-3 justify-center">
          <button className="px-12 py-3.5 text-gray-500 font-medium bg-gray-400 rounded-full">
            변경사항 저장
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProfileEditModal;
