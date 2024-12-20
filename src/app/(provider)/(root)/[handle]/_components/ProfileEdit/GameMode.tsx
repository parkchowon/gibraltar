import { PLAY_MODE } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { Json } from "@/types/supabase";
import React, { useEffect, useState } from "react";

function GameMode({ mode }: { mode: Json }) {
  const selectedMode = mode as string[];
  const [gameMode, setGameMode] = useState<string[]>(selectedMode);
  const { playStyle, putPlayStyle } = useProfileStore();

  const handleModeClick = (mode: string) => {
    if (gameMode.includes(mode)) {
      setGameMode(gameMode.filter((item) => item !== mode));
    } else {
      setGameMode([...gameMode, mode]);
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
    <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
      {PLAY_MODE.map((mode, idx) => {
        return (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode.name)}
            className={`${idx === 0 && "rounded-l-xl"} ${
              idx === 3 && "rounded-r-xl"
            } ${gameMode.includes(mode.name) && "bg-mint"}`}
          >
            {mode.name}
          </button>
        );
      })}
    </div>
  );
}

export default GameMode;
