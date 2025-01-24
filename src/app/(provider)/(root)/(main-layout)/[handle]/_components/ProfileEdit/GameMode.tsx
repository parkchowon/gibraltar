import { PLAY_MODE } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { Json } from "@/types/supabase";
import React, { useEffect, useState } from "react";

function GameMode({ mode }: { mode: Json }) {
  const selectedMode = mode as string[];
  const { playStyle, putPlayStyle } = useProfileStore();
  const [gameMode, setGameMode] = useState<string[]>(
    playStyle.mode && playStyle.mode.length !== 0
      ? playStyle.mode
      : selectedMode
  );

  const handleModeClick = (mode: string) => {
    if (gameMode && gameMode.includes(mode)) {
      setGameMode(gameMode.filter((item) => item !== mode));
    } else {
      if (gameMode) {
        setGameMode([...gameMode, mode]);
      } else {
        setGameMode([mode]);
      }
    }
  };

  useEffect(() => {
    putPlayStyle({
      mode: gameMode,
      style: playStyle.style,
      time: playStyle.time,
    });
  }, [gameMode]);

  return (
    <div className="grid grid-cols-4 h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
      {PLAY_MODE.map((mode, idx) => {
        return (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode.name)}
            className={`${idx === 0 && "rounded-l-xl"} ${
              idx === 3 && "rounded-r-xl"
            } ${
              gameMode && gameMode.includes(mode.name) && "bg-mint text-white"
            } lg:text-base text-xs`}
          >
            {mode.name}
          </button>
        );
      })}
    </div>
  );
}

export default GameMode;
