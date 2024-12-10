import { PLAY_TIME } from "@/constants/profile";
import React from "react";

function GameTime() {
  return (
    <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
      {PLAY_TIME.map((time) => {
        return (
          <button key={time.id} className={``}>
            {time.name}
          </button>
        );
      })}
    </div>
  );
}

export default GameTime;
