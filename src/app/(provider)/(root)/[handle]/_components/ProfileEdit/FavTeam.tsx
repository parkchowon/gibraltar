import { OWCSTeam } from "@/constants/owcsTeam";
import Image from "next/image";
import React from "react";

function FavTeam() {
  return (
    <div className="relative flex justify-center w-full gap-3">
      {OWCSTeam.map((team) => {
        return (
          <button
            key={team.id}
            className="relative w-10 h-10 rounded-full border-[1px]"
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
