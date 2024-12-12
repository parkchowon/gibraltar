import { PLAY_POSITION } from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import Image from "next/image";
import React, { useState } from "react";

function GameTier() {
  const [position, setPosition] = useState<string>("돌격");
  const [grade, setGrade] = useState<number>(0);
  const [userTier, setUserTier] = useState<string>("");

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(Number(e.currentTarget.value));
  };

  const handleTierClick = (tier: string) => {
    setUserTier(tier);
  };

  const handlePositionClick = (pos: string) => {
    setPosition(pos);
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-3">
      <div className="grid grid-cols-3 w-full h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <button
              key={pos.id}
              onClick={() => handlePositionClick(pos.name)}
              className={`${position === pos.name ? "bg-mint" : ""} ${
                idx === 0 && "rounded-l-xl"
              } ${idx === 2 && "rounded-r-xl"}`}
            >
              {pos.name}
            </button>
          );
        })}
      </div>
      <div className="flex w-full h-fit justify-center items-center py-2 bg-mint rounded-full">
        <p className="font-bold">
          {userTier ? userTier : "설정 안함"} {grade !== 0 && 6 - grade}
        </p>
      </div>
      <div className="flex w-full justify-center py-2 gap-2">
        {OWTier.map((tier) => {
          return (
            <button
              onClick={() => handleTierClick(tier.tier)}
              key={tier.id}
              className={`relative w-14 h-14 border rounded-full ${
                userTier === tier.tier ? "border-mint border-2" : ""
              }`}
            >
              <Image
                alt={tier.tier}
                src={tier.img}
                fill
                className="absolute rounded-full"
              />
            </button>
          );
        })}
      </div>
      <div className="w-[80%] px-8 py-4 bg-gray-50 rounded-lg">
        <div className="flex w-full justify-between">
          {[...Array(5)].map((_, idx) => (
            <p key={idx}>{5 - idx}</p>
          ))}
        </div>
        <input
          value={grade}
          onChange={handleNumberChange}
          type="range"
          min={1}
          max={5}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default GameTier;
