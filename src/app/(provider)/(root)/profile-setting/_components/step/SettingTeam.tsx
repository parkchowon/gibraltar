"use client";
import { OWCSTeam } from "@/constants/owcsTeam";
import Image from "next/image";
import { useState } from "react";
import ProfileSettingContainer from "../ProfileSettingContainer";

type TeamType = {
  id: number;
  name: string;
  logo: string;
};

function SettingTeam() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [team, setTeam] = useState<TeamType>();

  const handleClickToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClickTeam = (team: TeamType) => {
    setIsVisible(false);
    setTeam(team);
    console.log(team.name);
  };

  return (
    <ProfileSettingContainer
      title="즐겨하는 영웅을 선택해주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="flex flex-col w-[413px] mt-[66px] mb-[75px]">
        <p className="font-bold mb-5">응원하는 팀이 있다면 알려주시겠어요?</p>
        <div className="relative flex flex-col w-full">
          <label
            className={`w-full border-[1px] py-5 px-[55px] border-black ${
              isVisible ? "rounded-t-[15px] border-b-0" : "rounded-[15px]"
            } `}
          >
            <button className="" onClick={handleClickToggle}>
              선택하세요
            </button>
          </label>
          {isVisible && (
            <ul className="absolute w-full top-[65px] cursor-pointer border-[1px] border-t-0 border-black rounded-b-[15px] bg-white">
              {OWCSTeam.map((team) => {
                return (
                  <li
                    key={team.id}
                    className="flex px-[18px] py-5 hover:bg-mint"
                    onClick={() => handleClickTeam(team)}
                  >
                    <div className="relative w-[25px] h-[25px] mr-3">
                      <Image
                        src={team.logo}
                        fill
                        alt="logo"
                        className="absolute rounded-3xl"
                      />
                    </div>
                    {team.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-col w-full items-center justify-center mt-[67px]">
          <div className="relative w-[190px] h-[190px]">
            <Image
              src={team ? `${team.logo}` : ""}
              fill
              className="absolute aspect-square rounded-full"
              alt="logo"
            />
          </div>
          <p className="mt-4 font-bold">{team?.name}</p>
        </div>
      </div>
    </ProfileSettingContainer>
  );
}

export default SettingTeam;
