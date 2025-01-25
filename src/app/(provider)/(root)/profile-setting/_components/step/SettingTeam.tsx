"use client";
import { OWCSTeam } from "@/constants/owcsTeam";
import { useProfileStore } from "@/stores/profile.store";
import Image from "next/image";
import { useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

type TeamType = {
  id: number;
  name: string;
  logo: string;
};

function SettingTeam() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [team, setTeam] = useState<TeamType>();
  const { putFavoriteTeam } = useProfileStore();

  const handleClickToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClickTeam = (team: TeamType) => {
    setIsVisible(false);
    setTeam(team);
  };

  const handleSubmit = async () => {
    if (team) putFavoriteTeam(team.name);
  };

  return (
    <ProfileSettingContainer
      title="응원하는 팀을 알려주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="flex flex-col lg:w-[413px] w-[280px] lg:mt-[66px] mt-10 lg:mb-[75px] mb-10">
        <p className="font-bold lg:mb-6 mb-2 lg:text-base text-sm">
          응원하는 팀이 있다면 알려주시겠어요?
        </p>
        <div className="relative flex flex-col w-full">
          <label
            className={`w-full border-[1px] lg:py-5 py-2 lg:px-[55px] px-10 border-black ${
              isVisible ? "rounded-t-[15px] border-b-0" : "rounded-[15px]"
            } `}
          >
            <button
              className="w-full text-left text-sm lg:text-base"
              onClick={handleClickToggle}
            >
              {team ? team.name : "선택하세요"}
            </button>
          </label>
          {isVisible && (
            <ul className="absolute w-full lg:top-[65px] top-[41px] cursor-pointer border-[1px] border-t-0 border-black rounded-b-[15px] bg-white">
              {OWCSTeam.map((team, idx) => {
                return (
                  <li
                    key={team.id}
                    className={`flex px-[18px] lg:py-5 py-2 text-sm lg:text-base hover:bg-mint bg-white ${
                      idx === OWCSTeam.length - 1 ? "rounded-b-xl" : ""
                    }`}
                    onClick={() => handleClickTeam(team)}
                  >
                    <div
                      className={`relative w-[25px] h-[25px] aspect-square mr-3`}
                    >
                      <Image
                        src={team.logo}
                        fill
                        alt="logo"
                        className="absolute rounded-3xl object-contain"
                      />
                    </div>
                    {team.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-col w-full items-center justify-center lg:mt-[67px] mt-10">
          <div
            className={`relative lg:w-[190px] lg:h-[190px] w-32 h-32 rounded-full aspect-square -z-10 ${
              team ? "" : "border border-black"
            }`}
          >
            <Image
              src={team ? `${team.logo}` : ""}
              fill
              className="absolute object-contain rounded-full -z-10"
              alt="logo"
            />
          </div>
          <p className="lg:mt-4 mt-2 font-bold lg:text-base text-sm">
            {team ? team.name : "팀 이름"}
          </p>
        </div>
      </div>
      <NextStepButton isClickable={!!team} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingTeam;
