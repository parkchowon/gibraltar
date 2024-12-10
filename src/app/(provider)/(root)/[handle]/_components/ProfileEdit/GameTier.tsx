import { OWTier } from "@/constants/tier";
import Image from "next/image";
import React from "react";

function GameTier() {
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex w-full h-fit justify-center pb-3">
        <p>브론즈 3</p>
      </div>
      <div className="flex w-full justify-center gap-2">
        {OWTier.map((tier) => {
          return (
            <button
              key={tier.id}
              className="relative w-14 h-14 border rounded-full"
            >
              <Image
                alt={tier.tier}
                src={tier.img}
                fill
                className="absolute rounded-full"
              />
            </button>
          );
        })}
      </div>
      <input type="range" min={1} max={5} className="w-[80%] my-5" />
    </div>
  );
}

export default GameTier;
