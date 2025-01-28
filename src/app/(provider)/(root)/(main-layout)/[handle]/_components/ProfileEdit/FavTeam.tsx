import { OWCSTeam } from "@/constants/owcsTeam";
import { useProfileStore } from "@/stores/profile.store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function FavTeam({ team }: { team: string | null }) {
  const [favTeam, setFavTeam] = useState<string | null>(team);
  const { putFavoriteTeam } = useProfileStore();

  const handleTeamClick = (team: string) => {
    setFavTeam(team);
  };

  useEffect(() => {
    putFavoriteTeam(favTeam);
  }, [favTeam]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex w-full rounded-full px-6 py-2 justify-center bg-mint text-white font-bold">
        <p className="lg:text-base text-xs">{favTeam}</p>
      </div>
      <div className="flex w-full justify-center gap-2 py-4">
        {OWCSTeam.map((team) => {
          return (
            <button
              key={team.id}
              onClick={() => handleTeamClick(team.name)}
              className={`relative lg:w-14 lg:h-14 w-7 h-7 aspect-square rounded-full border-[1px] ${
                favTeam === team.name && "border-mint border-2"
              }`}
            >
              {team.id === 0 ? (
                <p className="lg:text-base text-xs">없음</p>
              ) : (
                <Image
                  alt="team logo"
                  src={team.logo}
                  fill
                  className="absolute object-contain rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FavTeam;
