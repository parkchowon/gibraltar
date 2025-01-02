import { OWCSTeam } from "@/constants/owcsTeam";
import { useProfileStore } from "@/stores/profile.store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function FavTeam({ team }: { team: string }) {
  const [favTeam, setFavTeam] = useState<string>(team);
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
        <p>{favTeam}</p>
      </div>
      <div className="flex w-full justify-center gap-2 py-4">
        {OWCSTeam.map((team) => {
          return (
            <button
              key={team.id}
              onClick={() => handleTeamClick(team.name)}
              className={`relative w-14 h-14 rounded-full border-[1px] ${
                favTeam === team.name && "border-mint border-2"
              }`}
            >
              {team.id === 0 ? (
                <p>없음</p>
              ) : (
                <Image
                  alt="team logo"
                  src={team.logo}
                  fill
                  className="absolute object-cover rounded-full"
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
