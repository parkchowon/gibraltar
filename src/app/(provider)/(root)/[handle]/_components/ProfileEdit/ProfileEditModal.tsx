import BackArrowBtn from "@/components/BackArrowBtn";
import ReactDOM from "react-dom";
import React, { Dispatch, SetStateAction, useState } from "react";
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

  const [isTimeClick, setIsTimeClick] = useState<boolean>(false);
  const [isStyleClick, setIsStyleClick] = useState<boolean>(false);
  const [isTeamClick, setIsTeamClick] = useState<boolean>(false);
  const [isTierClick, setIsTierClick] = useState<boolean>(false);
  const [isHeroClick, setIsHeroClick] = useState<boolean>(false);
  const [isModeClick, setIsModeClick] = useState<boolean>(false);

  // 닉네임 수정
  const handleNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.currentTarget.value);
  };

  // handle(id) 수정
  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.currentTarget.value);
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        onClick={() => setEditClick(false)}
        className="absolute inset-0 bg-black opacity-30"
      />
      <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] px-6 py-6 bg-white rounded-2xl">
        {/* 홈으로 */}
        <BackArrowBtn
          intent={"profileEditModal"}
          type="modal"
          setModalClick={setEditClick}
        />
        <div className="flex flex-col pl-[9.7%] pr-[71px]">
          <div className="flex justify-center items-center w-full py-12 gap-[46px]">
            {/* 프로필 사진 부분 */}
            <div className="relative w-fit h-fit flex items-center justify-center">
              <button className="absolute grid place-items-center w-[45px] h-[45px] bg-black rounded-full bg-opacity-40 z-20">
                <CameraIcon width="25" height="25" color="white" />
              </button>
              <ProfileBtn
                profileUrl={profileUser.profile_url}
                handle={profileUser.handle}
                intent={"edit"}
                type="non-click"
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
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p>세부 프로필</p>
            <DetailTitle
              title="플레이 모드"
              type="mode"
              onClick={handleDetailEditClick}
            />
            {isModeClick && <GameMode />}
            <DetailTitle
              title="게임 시간대"
              type="time"
              onClick={handleDetailEditClick}
            />
            {isTimeClick && <GameTime />}
            <DetailTitle
              title="게임 스타일"
              type="style"
              onClick={handleDetailEditClick}
            />
            {isStyleClick && <GameStyle />}
            <DetailTitle
              title="티어"
              type="tier"
              onClick={handleDetailEditClick}
            />
            {isTierClick && <GameTier />}
            <DetailTitle
              title="플레이 영웅"
              type="hero"
              onClick={handleDetailEditClick}
            />
            {isHeroClick && <FavHero />}
            <DetailTitle
              title="응원하는 팀"
              type="team"
              onClick={handleDetailEditClick}
            />
            {isTeamClick && <FavTeam />}
          </div>
        </div>
        <div className="flex w-full h-fit justify-center mt-5">
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
