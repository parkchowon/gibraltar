import { fetchHero } from "@/apis/overwatch.api";
import { PLAY_POSITION } from "@/constants/profile";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

function FavHero() {
  const [position, setPosition] = useState<string>("tank");

  // 영웅 목록 불러오기
  const { isPending, data } = useQuery({
    queryKey: ["heroData"],
    queryFn: () => {
      return fetchHero();
    },
  });

  const handlePositionClick = (pos: string) => {
    setPosition(pos);
  };

  return (
    <div>
      <div className="grid grid-cols-3 w-full h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <button
              key={pos.id}
              onClick={() => handlePositionClick(pos.id)}
              className={`${position === pos.id ? "bg-mint" : ""} ${
                idx === 0 && "rounded-l-xl"
              } ${idx === 2 && "rounded-r-xl"}`}
            >
              {pos.name}
            </button>
          );
        })}
      </div>
      {!isPending && data && (
        <div className="flex flex-wrap w-full py-3 gap-2">
          {data.map((hero) => {
            if (hero.role === position)
              return (
                <button
                  key={hero.key}
                  className="relative w-14 h-14 rounded-full"
                >
                  <Image
                    src={hero.portrait}
                    alt="hero img"
                    fill
                    className="absolute rounded-full"
                  />
                </button>
              );
          })}
        </div>
      )}
    </div>
  );
}

export default FavHero;
