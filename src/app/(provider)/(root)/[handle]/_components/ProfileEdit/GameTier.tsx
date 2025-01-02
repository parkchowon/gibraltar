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
  const [tierGrade, setTierGrade] = useState<number[]>(selectedGrade);
  const [userTier, setUserTier] = useState<string[]>(selectedTier);

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
    putTier(
      userTier.map((item, index) =>
        index === position ? userTier[position] : item
      )
    );
  }, [userTier]);

  useEffect(() => {
    putGrade(
      tierGrade.map((item, index) =>
        index === position ? tierGrade[position] : item
      )
    );
  }, [tierGrade]);

  return (
    <div className="flex flex-col w-full justify-center items-center gap-3">
      <div className="grid grid-cols-3 w-full h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <button
              key={pos.id}
              onClick={() => handlePositionClick(idx)}
              className={`${
                position === idx ? "bg-mint text-white" : "text-black"
              } ${idx === 0 && "rounded-l-xl"} ${idx === 2 && "rounded-r-xl"}`}
            >
              {pos.name}
            </button>
          );
        })}
      </div>
      <div className="flex w-full h-fit justify-center items-center py-2 bg-mint text-white rounded-full">
        <p className="font-semibold">
          {userTier[position] ? userTier[position] : "설정 안함"}{" "}
          {tierGrade[position] && 6 - tierGrade[position]}
        </p>
      </div>
      <div className="flex w-full justify-center py-2 gap-2">
        {OWTier.map((tier) => {
          return (
            <button
              onClick={() => handleTierClick(tier.tier)}
              key={tier.id}
              className={`relative w-14 h-14 border rounded-full ${
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
      <div className="w-[80%] px-8 py-4 bg-gray-50 rounded-lg">
        <div className="flex w-full justify-between">
          {[...Array(5)].map((_, idx) => (
            <p key={idx}>{5 - idx}</p>
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
