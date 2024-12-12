import { PLAY_STYLE } from "@/constants/profile";
import React, { useState } from "react";

function GameStyle() {
  const [gameStyle, setGameStyle] = useState<string>("");

  const handleStyleClick = (style: string) => {
    setGameStyle(style);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_STYLE.map((style, idx) => {
          return (
            <button
              onClick={() => handleStyleClick(style.name)}
              key={style.id}
              className={`${idx === 0 ? "rounded-l-xl" : "rounded-r-xl"} ${
                gameStyle === style.name && "bg-mint"
              }`}
            >
              {style.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default GameStyle;
