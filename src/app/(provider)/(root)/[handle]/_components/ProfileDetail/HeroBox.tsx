import React from "react";

function HeroBox({ pos }: { pos: string }) {
  return (
    <div className="flex w-full h-16 border items-center border-gray-400 rounded-lg">
      <p className="px-2">{pos}</p>
      <div className="w-[1px] h-full bg-gray-400" />
      <div>
        <div className="w-10 h-10 rounded-full"></div>
      </div>
    </div>
  );
}

export default HeroBox;
