import React, { useEffect, useState } from "react";
import ArrowHead from "@/assets/icons/arrow_head.svg";
import { HeroType } from "@/types/hero.type";
import { PLAY_POSITION } from "@/constants/profile";
import Image from "next/image";
import styles from "@/styles/postbox.module.css";
import Logo from "@/assets/logo/gibraltar_logo.svg";

type PositionType = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

function HeroBox({ main, play }: { main?: HeroType[]; play?: HeroType[] }) {
  const [position, setPosition] = useState<PositionType>(PLAY_POSITION[0]);
  const [posClick, setPosClick] = useState<boolean>(false);
  const [mainByRole, setMainByRole] = useState<HeroType[]>([]);
  const [playByRole, setPlayByRole] = useState<HeroType[]>([]);

  const handleClickPosition = (pos: PositionType) => {
    setPosition(pos);
    setPosClick(false);
  };

  useEffect(() => {
    setMainByRole(main?.filter((main) => main.role === position.id) ?? []);
    setPlayByRole(play?.filter((play) => play.role === position.id) ?? []);
  }, [position]);

  return (
    <div className="relative flex flex-col w-[50%] max-h-[270px] flex-grow lg:px-5 px-3 lg:py-4 py-2 items-center border border-mainGray rounded-md bg-subGray">
      <button
        onClick={() => setPosClick(!posClick)}
        className="flex flex-shrink-0 items-center mr-auto gap-2 h-6"
      >
        <Image src={position.icon} alt={position.name} width={10} height={10} />
        <p className="font-bold text-xs lg:text-sm">{position.name}</p>
        <div className="relative rotate-90 w-4 h-4 p-1">
          <ArrowHead />
        </div>
      </button>
      {posClick && (
        <div className="absolute flex flex-col border lg:left-4 lg:top-10 top-8 left-2 border-mainGray bg-white rounded-lg z-10">
          {PLAY_POSITION.filter((pos) => pos.name !== position.name).map(
            (filteredPos, idx) => (
              <button
                key={filteredPos.id}
                className={`flex w-full text-center items-center gap-2 text-xs lg:text-sm lg:px-3 py-1 px-2 ${
                  idx === 0 ? "rounded-t-lg" : "rounded-b-lg"
                } hover:bg-subGray`}
                onClick={() => handleClickPosition(filteredPos)}
              >
                <Image
                  src={filteredPos.icon}
                  alt={filteredPos.name}
                  width={10}
                  height={10}
                />
                <p>{filteredPos.name}</p>
              </button>
            )
          )}
        </div>
      )}
      {mainByRole.length + playByRole.length === 0 ? (
        <div className="flex flex-col flex-grow w-full h-full items-center justify-center gap-2 opacity-35 z-0">
          <Logo
            width={50}
            height={50}
            className="lg:w-[50px] lg:h-[50px] w-10 h-10"
          />
          <p className="text-[10px] lg:text-xs">없음</p>
        </div>
      ) : (
        <div
          className={`flex w-full h-full items-center gap-3 overflow-x-auto py-3 ${styles.customScrollbar}`}
        >
          {mainByRole.length + playByRole.length > 0 && (
            <div className="flex items-center justify-center w-[110px] h-[110px] min-w-[110px] min-h-[110px]">
              <Image
                src={
                  mainByRole && mainByRole.length !== 0
                    ? mainByRole[0].portrait
                    : playByRole && playByRole.length !== 0
                    ? playByRole[0].portrait
                    : ""
                }
                width={110}
                height={110}
                alt="캐릭터"
                className={`rounded-full border-2 w-[110px] h-[110px] ${
                  mainByRole.length !== 0
                    ? "border-carrot bg-carrot"
                    : "border-mint bg-mint"
                }`}
              />
            </div>
          )}
          <div className="flex flex-grow">
            <div className="grid grid-rows-2 w-full grid-flow-col gap-3 items-center">
              {mainByRole &&
                mainByRole.map((main, idx) => {
                  return (
                    <div
                      key={main.key}
                      className={`flex items-center justify-center ${
                        idx === 0 ? "hidden" : "w-[52px] h-[52px]"
                      }`}
                    >
                      <Image
                        src={main.portrait}
                        alt={main.key}
                        width={52}
                        height={52}
                        className={`rounded-full border-2 border-carrot bg-carrot ${
                          idx === 0 ? "hidden" : "w-[52px] h-[52px]"
                        }`}
                      />
                    </div>
                  );
                })}
              {playByRole &&
                playByRole.map((play, idx) => {
                  return (
                    <div
                      key={play.key}
                      className={`flex items-center justify-center w-[52px] h-[52px] ${
                        mainByRole.length === 0 && idx === 0 && "hidden"
                      }`}
                    >
                      <Image
                        key={play.key}
                        src={play.portrait}
                        alt={play.key}
                        width={52}
                        height={52}
                        className="rounded-full border-2 border-mint bg-mint "
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroBox;
