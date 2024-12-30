import React, { useState } from "react";
import ArrowHead from "@/assets/icons/arrow_head.svg";

function HeroBox() {
  const [position, setPosition] = useState<string>("탱");
  return (
    <div className="flex flex-col w-[50%] px-5 py-4 items-center border border-mainGray rounded-md bg-subGray">
      <button className="flex items-center mr-auto gap-2">
        <p className="font-bold text-sm">{position}</p>
        <div className="relative rotate-90 w-4 h-4 p-1">
          <ArrowHead />
        </div>
      </button>
    </div>
  );
}

export default HeroBox;
