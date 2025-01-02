import { PLAY_STYLE } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import React, { useEffect, useState } from "react";

function GameStyle({ style }: { style: string }) {
  const { playStyle, putPlayStyle } = useProfileStore();
  const [gameStyle, setGameStyle] = useState<string>(
    playStyle.style ? playStyle.style : style
  );

  const handleStyleClick = (style: string) => {
    setGameStyle(style);
  };

  useEffect(() => {
    putPlayStyle({
      mode: playStyle.mode,
      style: gameStyle,
      time: playStyle.time,
    });
  }, [gameStyle]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
        {PLAY_STYLE.map((style, idx) => {
          return (
            <button
              onClick={() => handleStyleClick(style.name)}
              key={style.id}
              className={`${idx === 0 ? "rounded-l-xl" : "rounded-r-xl"} ${
                gameStyle === style.name && "bg-mint text-white"
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
