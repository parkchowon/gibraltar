import { useProfileStore } from "@/stores/profile.store";
import { HeroType } from "@/types/hero.type";
import Image from "next/image";
import { useEffect, useState } from "react";

type HeroByRoleProps = {
  heroes: HeroType[] | undefined;
  position: string;
};

function HeroByRole({ heroes, position }: HeroByRoleProps) {
  const [heroList, setHeroList] = useState<HeroType[]>([]);
  const [selectedHeroes, setSelectedHeroes] = useState<HeroType[]>([]);
  const [mainHeroes, setMainHeroes] = useState<HeroType[]>([]);
  const { putPlayChamps } = useProfileStore();

  useEffect(() => {
    if (heroes) {
      const heroesByRole = heroes.filter((hero) => {
        return hero.role === position;
      });
      setHeroList(() => heroesByRole);
    }
  }, [position]);

  useEffect(() => {
    putPlayChamps({
      MainChamps: mainHeroes,
      selectedChamps: selectedHeroes,
    });
  }, [selectedHeroes, mainHeroes]);

  const handleHeroClick = (hero: HeroType) => {
    if (mainHeroes.includes(hero)) {
      const removeMain = mainHeroes.filter((remove) => remove !== hero);
      return setMainHeroes(removeMain);
    } else if (selectedHeroes.includes(hero)) {
      const removeSelect = selectedHeroes.filter((remove) => remove !== hero);
      setSelectedHeroes(removeSelect);
      return setMainHeroes([...mainHeroes, hero]);
    }
    return setSelectedHeroes([...selectedHeroes, hero]);
  };

  return (
    <div className="lg:w-[665px] w-fit grid grid-cols-6 lg:gap-x-3 gap-x-2 gap-y-3 lg:gap-y-4">
      {heroList.map((hero) => {
        return (
          <div key={hero.key} className="relative w-10 h-12 lg:w-24 lg:h-28">
            <button
              onClick={() => handleHeroClick(hero)}
              className={`relative w-full h-full border ${
                mainHeroes.includes(hero)
                  ? "bg-carrot border-carrot"
                  : selectedHeroes.includes(hero)
                  ? "bg-mint border-mint"
                  : "bg-white"
              } lg:rounded-2xl rounded-md`}
            >
              <Image
                alt={hero.name}
                src={hero.portrait}
                fill
                className="absolute lg:rounded-2xl rounded-md object-cover z-10"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default HeroByRole;
