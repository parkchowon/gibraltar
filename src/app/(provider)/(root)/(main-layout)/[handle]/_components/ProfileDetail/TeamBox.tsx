import { OWCSTeam } from "@/constants/owcsTeam";
import Image from "next/image";
import React from "react";

function TeamBox({ team }: { team?: string }) {
  return (
    <div className="flex flex-col w-full h-full lg:py-4 py-2 justify-between border items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold lg:text-sm text-xs text-black">응원하는 팀</p>
      <div className="relative w-[80%] pb-[80%] aspect-square">
        <Image
          alt="team"
          src={OWCSTeam.find((fav) => fav.name === team)?.logo ?? ""}
          fill
          className="absolute object-contain rounded-full border border-mainGray"
        />
      </div>
      <p className="font-bold lg:text-sm text-xs text-black">
        {team ? team : "없음"}
      </p>
    </div>
  );
}

export default TeamBox;
