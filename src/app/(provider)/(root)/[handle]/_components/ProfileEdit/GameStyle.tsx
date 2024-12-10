import { PLAY_STYLE } from "@/constants/profile";
import React from "react";

function GameStyle() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_STYLE.map((style) => {
          return (
            <button key={style.id} className={``}>
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameStyle;
