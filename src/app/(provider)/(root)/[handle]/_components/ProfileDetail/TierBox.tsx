import React from "react";

function TierBox({ pos }: { pos: string }) {
  return (
    <div className="flex flex-col h-20 items-center rounded-xl text-center">
      <div className="w-10 h-10 my-2 rounded-full bg-gray-300"></div>
      <p>3</p>
      <p className="py-1">{pos}</p>
    </div>
  );
}

export default TierBox;
