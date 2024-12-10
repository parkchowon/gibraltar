import { PLAY_MODE } from "@/constants/profile";
import React from "react";

function GameMode() {
  return (
    <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
      {PLAY_MODE.map((mode) => {
        return (
          <button key={mode.id} className={``}>
            {mode.name}
          </button>
        );
      })}
    </div>
  );
}

export default GameMode;
