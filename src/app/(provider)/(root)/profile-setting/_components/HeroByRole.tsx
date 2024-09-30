import { HeroType } from "@/types/hero.type";
import Image from "next/image";
import { useEffect, useState } from "react";

type HeroByRoleProps = {
  heroes: HeroType[] | undefined;
  position: string;
};

function HeroByRole({ heroes, position }: HeroByRoleProps) {
  const [heroList, setHeroList] = useState<HeroType[]>([]);

  useEffect(() => {
    if (heroes) {
      const heroesByRole = heroes.filter((hero) => {
        return hero.role === position;
      });
      setHeroList(() => heroesByRole);
    }
  }, [position]);

  return (
    <div className="w-[665px] my-5 grid grid-cols-6 gap-x-3 gap-y-6">
      {heroList.map((hero) => {
        return (
          <button className="relative w-[100px] h-[120px]" key={hero.key}>
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
