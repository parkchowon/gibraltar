import React, { useEffect, useState } from "react";
import ArrowHead from "@/assets/icons/arrow_head.svg";
import { HeroType } from "@/types/hero.type";
import { PLAY_POSITION } from "@/constants/profile";
import Image from "next/image";
import styles from "@/styles/postbox.module.css";

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
    <div className="relative flex flex-col w-[50%] max-h-[270px] px-5 py-4 items-center border border-mainGray rounded-md bg-subGray">
      <button
        onClick={() => setPosClick(!posClick)}
        className="flex items-center mr-auto gap-2"
      >
        <Image src={position.icon} alt={position.name} width={10} height={10} />
        <p className="font-bold text-sm">{position.name}</p>
        <div className="relative rotate-90 w-4 h-4 p-1">
          <ArrowHead />
        </div>
      </button>
      {posClick && (
        <div className="absolute flex flex-col border border-mainGray bg-white rounded-lg">
          {PLAY_POSITION.filter((pos) => pos.name !== position.name).map(
            (filteredPos, idx) => (
              <button
                key={filteredPos.id}
                className={`flex w-full text-center items-center gap-2 text-sm px-3 py-1 ${
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
      {mainByRole.length + playByRole.length === 0 && (
        <div className="grid w-full h-full place-items-center">
          <p className="text-sm">없음</p>
        </div>
      )}
      <div
        className={`flex w-full h-full items-center gap-3 overflow-x-auto py-3 ${styles.customScrollbar}`}
      >
        {mainByRole.length + playByRole.length > 0 && (
          <div className="flex items-center justify-center w-[110px] h-[110px]">
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
        <div className="grid grid-rows-2 grid-flow-col gap-3 items-center">
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
  );
}

export default HeroBox;
