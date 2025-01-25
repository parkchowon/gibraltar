import React from "react";
import Image from "next/image";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function ModeBox({ mode }: { mode: string[] }) {
  const renderingGrid = () => {
    if (mode && mode.length > 1) {
      return (
        <>
          <div className="relative rounded-s-md flex items-center justify-center">
            {mode.find((game) => game === "빠른대전") && (
              <Image
                alt="quick"
                src={"/mode/quick.png"}
                fill
                className="absolute"
              />
            )}
          </div>
          <div className="relative rounded-s-md flex items-center justify-center">
            {mode.find((game) => game === "경쟁전") && (
              <Image
                alt="rank"
                src={"/mode/rank.png"}
                fill
                className="absolute"
              />
            )}
          </div>
          <div className="relative rounded-s-md flex items-center justify-center">
            {mode.find((game) => game === "아케이드") && (
              <Image
                alt="arcade"
                src={"/mode/arcade.png"}
                fill
                className="absolute"
              />
            )}
          </div>
          <div className="relative rounded-s-md flex items-center justify-center">
            {mode.find((game) => game === "사설방") && (
              <Image
                alt="user made"
                src={"/mode/user_made.png"}
                fill
                className="absolute"
              />
            )}
          </div>
        </>
      );
    } else {
      if (mode) {
        switch (mode[0]) {
          case "경쟁전":
            return (
              <Image
                alt="rank"
                src={"/mode/rank.png"}
                fill
                className="absolute"
              />
            );
          case "빠른대전":
            return (
              <Image
                alt="quick"
                src={"/mode/quick.png"}
                fill
                className="absolute"
              />
            );
          case "아케이드":
            return (
              <Image
                alt="arcade"
                src={"/mode/arcade.png"}
                fill
                className="absolute"
              />
            );
          case "사설방":
            return (
              <Image
                alt="user made"
                src={"/mode/user_made.png"}
                fill
                className="absolute"
              />
            );
        }
      }
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full lg:py-4 py-2 justify-between border items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold lg:text-sm text-xs z-20 bg-white px-1">
        게임모드
      </p>
      {mode && mode.length === 0 && (
        <div className="opacity-35">
          <Logo width={92} height={92} />
        </div>
      )}
      {!mode ||
        (mode.length === 0 && (
          <p className="font-bold lg:text-sm text-xs z-20 bg-white px-1">
            없음
          </p>
        ))}
      {mode && mode.length === 1 && (
        <p className="font-bold lg:text-sm text-xs z-20 bg-white px-1">
          {mode[0]}
        </p>
      )}
      {mode && mode.length > 1 && (
        <div className="flex flex-col items-center z-20 gap-[1px]">
          <p className="font-bold lg:text-sm text-xs bg-white px-1">
            {mode[0]} {mode[1]}
          </p>
          {mode && mode.length === 3 ? (
            <p className="font-bold w-fit lg:text-sm text-xs bg-white px-1">
              {mode[2]}
            </p>
          ) : (
            <p className="font-bold lg:text-sm text-xs bg-white px-1">
              {mode[2]} {mode[3]}
            </p>
          )}
        </div>
      )}

      <div
        className={`absolute inset-0 z-10 ${
          mode && mode.length > 1 && "grid grid-cols-2 grid-rows-2"
        }`}
      >
        {renderingGrid()}
      </div>
    </div>
  );
}

export default ModeBox;
