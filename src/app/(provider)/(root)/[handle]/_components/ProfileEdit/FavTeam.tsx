import { OWCSTeam } from "@/constants/owcsTeam";
import Image from "next/image";
import React from "react";

function FavTeam() {
  return (
    <div className="relative flex justify-center w-full pb-5 gap-2 bg-white">
      {OWCSTeam.map((team) => {
        return (
          <button
            key={team.id}
            className="relative w-14 h-14 rounded-full border-[1px]"
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
  );
}

export default FavTeam;
