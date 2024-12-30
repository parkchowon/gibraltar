import { PLAY_POSITION } from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import Image from "next/image";
import React from "react";

function TierBox({ tier, grade }: { tier: string[]; grade: number[] }) {
  return (
    <div className="flex flex-col w-[50%] px-2 py-4 items-center text-center border border-mainGray rounded-md bg-subGray">
      <p className="font-bold text-sm mb-7">티어</p>
      <div className="flex w-full justify-evenly mb-3">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <div
              key={pos.id}
              className="flex flex-col h-fit items-center rounded-xl text-center gap-3"
            >
              <div className="relative w-5 h-5 mb-3">
                <Image
                  src={pos.icon}
                  alt="icon"
                  fill
                  className="absolute object-cover"
                />
              </div>

              <Image
                src={OWTier.find((item) => item.tier === tier[idx])?.img || ""}
                alt="tier"
                height={60}
                width={60}
              />
              <p className="font-bold text-xs text-[#6a6a6a]">
                {tier[idx]}
                {grade[idx]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TierBox;
