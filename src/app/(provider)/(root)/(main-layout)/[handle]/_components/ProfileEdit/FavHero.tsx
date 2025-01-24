import { fetchHero } from "@/apis/overwatch.api";
import LogoLoading from "@/components/Loading/LogoLoading";
import { PLAY_POSITION } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { HeroType } from "@/types/hero.type";
import { Json } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function FavHero({ main, play }: { main: Json; play: Json }) {
  const selectedMain = (main as HeroType[]).map((main) => main.name);
  const selectedPlay = (play as HeroType[]).map((play) => play.name);

  const [position, setPosition] = useState<string>("tank");
  const [mainChamp, setMainChamp] = useState<string[]>(selectedMain);
  const [playChamp, setPlayChamp] = useState<string[]>(selectedPlay);

  const { playChamps, putPlayChamps } = useProfileStore();

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

  useEffect(() => {
    if (data) {
      const selectedMains = mainChamp.map((selected) => {
        return data.find((item) => item.name === selected) as HeroType;
      });

      const selectedChamps = playChamp.map((selected) => {
        return data.find((item) => item.name === selected) as HeroType;
      });

      putPlayChamps({
        MainChamps: selectedMains,
        selectedChamps: selectedChamps,
      });
    }
  }, [mainChamp, playChamp]);

  return (
    <div>
      <div className="grid grid-cols-3 w-full h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_POSITION.map((pos, idx) => {
          return (
            <button
              key={pos.id}
              onClick={() => handlePositionClick(pos.id)}
              className={`${
                position === pos.id ? "bg-mint text-white" : "text-black"
              } ${idx === 0 && "rounded-l-xl"} ${
                idx === 2 && "rounded-r-xl"
              } lg:text-base text-xs`}
            >
              {pos.name}
            </button>
          );
        })}
      </div>
      {isPending && (
        <div className="w-full py-4">
          <LogoLoading />
        </div>
      )}
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
                      ? "border-2 border-carrot bg-carrot"
                      : playChamp.includes(hero.name)
                      ? "border-2 border-mint bg-mint"
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
