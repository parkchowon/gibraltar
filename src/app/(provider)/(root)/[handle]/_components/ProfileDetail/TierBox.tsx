import React from "react";

function TierBox({ pos }: { pos: string }) {
  return (
    <div className="flex flex-col border items-center border-gray-400 rounded-xl text-center">
      <p className="py-1">{pos}</p>
      <div className="w-full h-[1px] bg-gray-400" />
      <div className="w-10 h-10 my-2 rounded-full bg-gray-300"></div>
      <p className="px-1">마스터 3</p>
    </div>
  );
}

export default TierBox;
