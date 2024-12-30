import React from "react";
import Joy from "@/assets/icons/game/style/joy.svg";
import Hard from "@/assets/icons/game/style/hard.svg";

function StyleBox({ style }: { style?: string }) {
  return (
    <div className="flex flex-col w-full h-full py-4 justify-between border items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold text-sm">플레이 성향</p>
      {style === "즐겁게" ? (
        <Joy width={92} height={92} />
      ) : (
        <Hard width={122} height={92} />
      )}
      <p className="font-bold text-sm">{style}</p>
    </div>
  );
}

export default StyleBox;
