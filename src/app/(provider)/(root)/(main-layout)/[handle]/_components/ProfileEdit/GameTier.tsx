import { PLAY_POSITION } from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import { useProfileStore } from "@/stores/profile.store";
import { Json } from "@/types/supabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function GameTier({ tier, grade }: { tier: Json; grade: Json }) {
  const selectedTier = tier as string[];
  const selectedGrade = grade as number[];

  const [position, setPosition] = useState<number>(0);
  const [tierGrade, setTierGrade] = useState<number[]>(
    selectedGrade.length === 3 ? selectedGrade : Array(3).fill(0)
  );
  const [userTier, setUserTier] = useState<string[]>(
    selectedTier.length === 3 ? selectedTier : Array(3).fill("")
  );

  const {
    tier: storeTier,
    grade: storeGrade,
    putTier,
    putGrade,
  } = useProfileStore();

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGrade = Number(e.currentTarget.value);
    setTierGrade(
      tierGrade.map((item, index) => (index === position ? newGrade : item))
    );
  };

  const handleTierClick = (tier: string) => {
    setUserTier(
      userTier.map((item, index) => (index === position ? tier : item))
    );
  };

  const handlePositionClick = (pos: number) => {
    setPosition(pos);
  };

  useEffect(() => {
    putTier(userTier);
  }, [userTier]);

  useEffect(() => {
    putGrade(
      tierGrade.map((item) => {
        if (item === 0) {
          return 0;
        }
        return 6 - item;
      })
    );
  }, [tierGrade]);

  return (
    <div className="flex flex-col w-full justify-center items-center gap-3">
      <div className="grid grid-cols-3 w-full h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <button
              key={pos.id}
              onClick={() => handlePositionClick(idx)}
              className={`${
                position === idx ? "bg-mint text-white" : "text-black"
              } ${idx === 0 && "rounded-l-xl"} ${
                idx === 2 && "rounded-r-xl"
              } lg:text-base text-xs`}
            >
              {pos.name}
            </button>
          );
        })}
      </div>
      <div className="flex w-full h-fit justify-center items-center lg:py-2 py-1 bg-mint text-white rounded-full">
        <p className="font-semibold text-xs lg:text-base">
          {userTier[position] ? userTier[position] : "설정 안함"}{" "}
          {tierGrade[position] && 6 - tierGrade[position]}
        </p>
      </div>
      <div className="flex w-full justify-center lg:py-2 py-1 lg:gap-2 gap-1">
        {OWTier.map((tier) => {
          return (
            <button
              onClick={() => handleTierClick(tier.tier)}
              key={tier.id}
              className={`relative w-7 h-7 min-w-7 min-h-7 lg:w-14 lg:h-14 border rounded-full ${
                userTier[position] === tier.tier ? "border-mint border-2" : ""
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
      <div className="w-[80%] lg:px-8 lg:py-4 px-4 py-1 bg-gray-50 rounded-lg">
        <div className="flex w-full justify-between">
          {[...Array(5)].map((_, idx) => (
            <p key={idx} className="lg:text-base text-xs">
              {5 - idx}
            </p>
          ))}
        </div>
        <input
          value={tierGrade[position]}
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
