import { PLAY_TIME } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { Json } from "@/types/supabase";
import React, { useEffect, useState } from "react";

function GameTime({ time }: { time: Json }) {
  const selectedTime = time as string[];
  const [gameTime, setGameTime] = useState<string[]>(selectedTime);
  const { playStyle, putPlayStyle } = useProfileStore();

  const handleTimeClick = (mode: string) => {
    if (gameTime.includes(mode)) {
      setGameTime(gameTime.filter((item) => item !== mode));
    } else {
      setGameTime([...gameTime, mode]);
    }
  };

  useEffect(() => {
    putPlayStyle({
      mode: playStyle.mode,
      style: playStyle.style,
      time: gameTime,
    });
  }, [gameTime]);

  return (
    <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
      {PLAY_TIME.map((time, idx) => {
        return (
          <button
            onClick={() => handleTimeClick(time.name)}
            key={time.id}
            className={`${idx === 0 && "rounded-l-xl"} ${
              idx === 3 && "rounded-r-xl"
            } ${gameTime.includes(time.name) && "bg-mint"}`}
          >
            {time.name}
          </button>
        );
      })}
    </div>
  );
}

export default GameTime;
