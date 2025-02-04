import React from "react";
import Joy from "@/assets/icons/game/style/joy.svg";
import Hard from "@/assets/icons/game/style/hard.svg";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function StyleBox({ style }: { style?: string }) {
  return (
    <div className="flex flex-col w-full h-full lg:py-4 py-2 justify-between border items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold lg:text-sm text-xs text-black">플레이 성향</p>
      {style === "즐겁게" && (
        <Joy
          width={92}
          height={92}
          className="lg:w-[92px] lg:h-[92px] w-10 h-10"
        />
      )}
      {style === "빡세게" && (
        <Hard
          width={122}
          height={92}
          className="lg:w-[92px] lg:h-[92px] w-10 h-10"
        />
      )}
      {!style && (
        <div className="opacity-35">
          <Logo
            width={92}
            height={92}
            className="lg:w-[92px] lg:h-[92px] w-10 h-10"
          />
        </div>
      )}
      <p className="font-bold lg:text-sm text-xs text-black">
        {style ? style : "없음"}
      </p>
    </div>
  );
}

export default StyleBox;
