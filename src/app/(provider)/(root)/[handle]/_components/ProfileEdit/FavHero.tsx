import { fetchHero } from "@/apis/overwatch.api";
import { PLAY_POSITION } from "@/constants/profile";
import { Json } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";

type heroType = {
  key: string;
  name: string;
  portrait: string;
  role: string;
};
function FavHero({ main, play }: { main: Json; play: Json }) {
  const selectedMain = (main as heroType[]).map((main) => main.name);
  const selectedPlay = (play as heroType[]).map((play) => play.name);

  const [position, setPosition] = useState<string>("tank");
  const [mainChamp, setMainChamp] = useState<string[]>(selectedMain);
  const [playChamp, setPlayChamp] = useState<string[]>(selectedPlay);

  // 영웅 목록 불러오기
  const { isPending, data } = useQuery({
    queryKey: ["heroData"],
    queryFn: () => {
      return fetchHero();
    },
  });

  const handleHeroClick = (hero: string) => {
    if (mainChamp.includes(hero)) {
      const removeChamp = mainChamp.filter((main) => main !== hero);
      return setMainChamp(removeChamp);
    } else if (playChamp.includes(hero)) {
      const removeChamp = playChamp.filter((play) => play !== hero);
      setPlayChamp(removeChamp);
      return setMainChamp([...mainChamp, hero]);
    }
    return setPlayChamp([...playChamp, hero]);
  };

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
      {isPending && <p>loading...</p>}
      {!isPending && data && (
        <div className="flex flex-wrap w-full py-3 gap-2">
          {data.map((hero) => {
            if (hero.role === position)
              return (
                <button
                  key={hero.key}
                  onClick={() => handleHeroClick(hero.name)}
                  className={`relative w-14 h-14 rounded-full ${
                    mainChamp.includes(hero.name)
                      ? "border-2 border-warning"
                      : playChamp.includes(hero.name)
                      ? "border-2 border-mint"
                      : ""
                  }`}
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
