import { PLAY_POSITION } from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import Image from "next/image";
import React from "react";

function TierBox({ tier, grade }: { tier: string[]; grade: number[] }) {
  return (
    <div className="flex flex-col w-[50%] px-2 lg:py-4 py-2 items-center text-center border border-mainGray rounded-md bg-subGray">
      <p className="font-bold text-xs lg:text-sm lg:mb-7 mb-3 text-black">
        티어
      </p>
      <div className="flex w-full justify-evenly mb-3">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <div
              key={pos.id}
              className="flex flex-col h-fit items-center rounded-xl text-center lg:gap-3 gap-1"
            >
              <div className="relative lg:w-5 lg:h-5 w-3 h-3 lg:mb-3 mb-1">
                <Image
                  src={pos.icon}
                  alt="icon"
                  fill
                  className="absolute object-cover"
                />
              </div>
              {tier && tier.length === 0 ? (
                <p className="text-xs lg:text-sm text-black">설정 안함</p>
              ) : (
                <>
                  <Image
                    src={
                      OWTier.find((item) => item.tier === tier[idx])?.img || ""
                    }
                    alt="tier"
                    height={60}
                    width={60}
                    className="lg:w-[60px] lg:h-[60px] w-8 h-8"
                  />
                  <p className="font-bold text-[10px] lg:text-xs text-[#6a6a6a]">
                    {tier[idx]}
                    {grade[idx]}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TierBox;
