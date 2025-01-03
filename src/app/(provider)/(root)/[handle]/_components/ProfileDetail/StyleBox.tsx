import React from "react";
import Joy from "@/assets/icons/game/style/joy.svg";
import Hard from "@/assets/icons/game/style/hard.svg";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function StyleBox({ style }: { style?: string }) {
  return (
    <div className="flex flex-col w-full h-full py-4 justify-between border items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold text-sm">플레이 성향</p>
      {style === "즐겁게" && <Joy width={92} height={92} />}
      {style === "빡세게" && <Hard width={122} height={92} />}
      {!style && (
        <div className="opacity-35">
          <Logo width={92} height={92} />
        </div>
      )}
      <p className="font-bold text-sm">{style ? style : "없음"}</p>
    </div>
  );
}

export default StyleBox;
