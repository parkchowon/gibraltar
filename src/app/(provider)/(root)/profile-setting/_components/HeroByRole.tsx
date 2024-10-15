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
      const removeSelect = selectedHeroes.filter((remove) => remove !== hero);
      setSelectedHeroes(removeSelect);
      return setMainHeroes(removeMain);
    }
    if (selectedHeroes.includes(hero)) {
      if (!mainHeroes.includes(hero)) {
        return setMainHeroes([...mainHeroes, hero]);
      }
    }
    return setSelectedHeroes([...selectedHeroes, hero]);
  };

  return (
    <div className="w-[665px] grid grid-cols-6 gap-x-3 gap-y-6">
      {heroList.map((hero) => {
        return (
          <button
            onClick={() => handleHeroClick(hero)}
            style={{
              border: mainHeroes.includes(hero)
                ? "2px solid yellow"
                : selectedHeroes.includes(hero)
                ? "2px solid red"
                : "",
            }}
            className="relative w-[100px] h-[120px]"
            key={hero.key}
          >
            <Image
              alt={hero.name}
              src={hero.portrait}
              fill
              className="absolute rounded-2xl"
            />
          </button>
        );
      })}
    </div>
  );
}

export default HeroByRole;
