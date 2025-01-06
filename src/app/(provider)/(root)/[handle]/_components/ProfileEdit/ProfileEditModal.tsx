import BackArrowBtn from "@/components/BackArrowBtn";
import ReactDOM from "react-dom";
import styles from "@/styles/postbox.module.css";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { findDuplicateHandle, getUserProfile } from "@/apis/auth.api";
import { profileUpdate } from "@/apis/profile.api";
import { invalidCheckId } from "@/utils/invalidCheck";
import { useProfileStore } from "@/stores/profile.store";
import { useRouter } from "next/navigation";
import { useProfileUpdateMutation } from "@/hooks/userProfileMutation";
import LogoLoading from "@/components/Loading/LogoLoading";

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
  const router = useRouter();

  const mutation = useProfileUpdateMutation({
    onSuccess: () => {
      setEditClick(false);
      if (handle !== profileUser.handle) {
        router.push(`/@${handle}`);
      }
    },
  });

  const [nickname, setNickname] = useState<string>(profileUser.nickname);
  const [handle, setHandle] = useState<string>(profileUser.handle.slice(1));
  const [handleCheck, setHandleCheck] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [profileImg, setProfileImg] = useState<string>(profileUser.profile_url);

  // users 테이블 데이터인, 위 4개의 데이터가 바뀌었을 때 check
  const [usersChange, setUsersChange] = useState<boolean>(false);

  const [isTimeClick, setIsTimeClick] = useState<boolean>(false);
  const [isStyleClick, setIsStyleClick] = useState<boolean>(false);
  const [isTeamClick, setIsTeamClick] = useState<boolean>(false);
  const [isTierClick, setIsTierClick] = useState<boolean>(false);
  const [isHeroClick, setIsHeroClick] = useState<boolean>(false);
  const [isModeClick, setIsModeClick] = useState<boolean>(false);

  // 비공개 계정 toggle
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // ref
  const modeRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);

  const { playStyle, tier, grade, playChamps, favoriteTeam, putPlayStyle } =
    useProfileStore();

  const { data: profile, isPending } = useQuery({
    queryKey: ["profileDetail", profileUser.id],
    queryFn: () => getUserProfile(profileUser.id),
  });

  useEffect(() => {
    setBio(profile?.bio || "");
  }, [profile]);

  // 닉네임 수정
  const handleNickChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNickname(e.currentTarget.value);
    if (e.currentTarget.value === profileUser.nickname) {
      return setUsersChange(false);
    }
    return setUsersChange(true);
  };

  // handle(id) 수정
  const handleHandleChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newHandle = e.currentTarget.value;

    const text = invalidCheckId(newHandle);
    setHandle(e.currentTarget.value);
    if (
      text === "사용가능한 아이디예요." &&
      newHandle !== profileUser.handle.slice(1)
    ) {
      const result = await findDuplicateHandle(newHandle);
      if (result) {
        return setHandleCheck("중복된 아이디 입니다.");
      } else {
        setHandleCheck("");
        if (newHandle !== profileUser.handle) {
          return setUsersChange(true);
        }
        return setUsersChange(false);
      }
    }
    if (newHandle !== profileUser.handle.slice(1)) {
      setHandleCheck(text);
    }
  };

  // bio 수정
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
      setUsersChange(true);
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailEditClick = (type: string) => {
    switch (type) {
      case "mode":
        scrollToRef(modeRef);
        return setIsModeClick(!isModeClick);
      case "time":
        scrollToRef(timeRef);
        return setIsTimeClick(!isTimeClick);
      case "style":
        scrollToRef(styleRef);
        return setIsStyleClick(!isStyleClick);
      case "team":
        scrollToRef(teamRef);
        return setIsTeamClick(!isTeamClick);
      case "tier":
        scrollToRef(tierRef);
        return setIsTierClick(!isTierClick);
      case "hero":
        scrollToRef(heroRef);
        return setIsHeroClick(!isHeroClick);
    }
  };

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHeroClick) scrollToRef(heroRef);
    if (isModeClick) scrollToRef(modeRef);
    if (isStyleClick) scrollToRef(styleRef);
    if (isTeamClick) scrollToRef(teamRef);
    if (isTierClick) scrollToRef(tierRef);
    if (isTimeClick) scrollToRef(timeRef);
  }, [
    isHeroClick,
    isModeClick,
    isStyleClick,
    isTeamClick,
    isTierClick,
    isTimeClick,
  ]);

  const handleProfileEditClick = async () => {
    if (nickname === "" || handle === "") {
      return confirm("닉네임과 아이디는 비워둘 수 없습니다.");
    }
    if (usersChange) {
      const updateData = {
        nickname: nickname !== profileUser.nickname ? nickname : undefined,
        handle: handle !== profileUser.handle ? `@${handle}` : undefined,
        file: file,
        userId: profileUser.id,
      };
      await profileUpdate(updateData);
    }

    const updateDetail = {
      userId: profileUser.id,
      bio: profile?.bio !== bio ? bio : undefined,
      playStyle: playStyle,
      mainChamps:
        profile?.main_champs !== playChamps.MainChamps
          ? playChamps.MainChamps
          : undefined,
      playChamps:
        profile?.play_champs !== playChamps.selectedChamps
          ? playChamps.selectedChamps
          : undefined,
      favoriteTeam:
        profile?.favorite_team !== favoriteTeam ? favoriteTeam : null,
      tier: profile?.tier !== tier ? tier : undefined,
      grade: profile?.tier_grade !== grade ? grade : undefined,
    };

    mutation.mutate(updateDetail);
  };

  const handleCloseModal = () => {
    putPlayStyle({
      mode: undefined,
      style: null,
      time: undefined,
    });
    setEditClick(false);
  };

  const handlePrivateClick = () => {
    setIsPrivate(!isPrivate);
  };

  if (isPending || !profile) {
    return (
      <div className="fixed inset-0 flex w-full h-screen justify-center items-center bg-black/35 z-50">
        <LogoLoading />
      </div>
    );
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        onClick={handleCloseModal}
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
        {mutation.isPending && <LogoLoading />}
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
              {/* 비공개 계정 설정 토글 버튼튼 */}
              <div className="flex items-center justify-end px-2">
                <p className="text-sm text-mainGray mr-2">계정 잠금</p>
                <button
                  onClick={handlePrivateClick}
                  className={`flex items-center w-14 h-6 px-1 py-1 rounded-full border ${
                    isPrivate ? "bg-carrot" : "border-mainGray"
                  }`}
                >
                  {!isPrivate ? (
                    <>
                      <div className="h-full aspect-square bg-mainGray rounded-full" />
                      <p className="text-sm font-semibold text-mainGray ml-auto mr-1">
                        off
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-white mr-auto ml-1">
                        on
                      </p>
                      <div className="h-full aspect-square bg-white rounded-full" />
                    </>
                  )}
                </button>
              </div>
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
              <p
                className={`${
                  handleCheck === "" && "hidden"
                } text-sm text-warning -mt-2 pl-2`}
              >
                {handleCheck}
              </p>
              <EditInput
                label="바이오"
                value={bio}
                onChange={handleBioChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="font-semibold">세부 프로필</p>
            <div className="flex flex-col gap-2" ref={modeRef}>
              <DetailTitle
                title="플레이 모드"
                type="mode"
                onClick={handleDetailEditClick}
              />
              {isModeClick && <GameMode mode={profile.play_mode} />}
            </div>
            <div className="flex flex-col gap-2" ref={timeRef}>
              <DetailTitle
                title="게임 시간대"
                type="time"
                onClick={handleDetailEditClick}
              />
              {isTimeClick && <GameTime time={profile.play_time} />}
            </div>
            <div className="flex flex-col gap-2" ref={styleRef}>
              <DetailTitle
                title="게임 스타일"
                type="style"
                onClick={handleDetailEditClick}
              />
              {isStyleClick && <GameStyle style={profile?.play_style} />}
            </div>
            <div className="flex flex-col gap-2" ref={tierRef}>
              <DetailTitle
                title="티어"
                type="tier"
                onClick={handleDetailEditClick}
              />
              {isTierClick && (
                <GameTier tier={profile.tier} grade={profile.tier_grade} />
              )}
            </div>
            <div className="flex flex-col gap-2" ref={heroRef}>
              <DetailTitle
                title="플레이 영웅"
                type="hero"
                onClick={handleDetailEditClick}
              />
              {isHeroClick && (
                <FavHero
                  main={profile.main_champs}
                  play={profile.play_champs}
                />
              )}
            </div>
            <div className="flex flex-col gap-2" ref={teamRef}>
              <DetailTitle
                title="응원하는 팀"
                type="team"
                onClick={handleDetailEditClick}
              />
              {isTeamClick && <FavTeam team={profile.favorite_team} />}
            </div>
          </div>
        </div>
        <div className="flex w-full h-fit pt-3 justify-center">
          <button
            onClick={handleProfileEditClick}
            className="px-12 py-3.5 text-white font-medium bg-black rounded-full"
          >
            변경사항 저장
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProfileEditModal;
