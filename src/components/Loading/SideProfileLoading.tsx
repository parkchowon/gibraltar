import React from "react";

function SideProfileLoading() {
  return (
    <div className="flex w-full mt-[37px] mb-[60px] py-4 px-5 rounded-2xl bg-white">
      <div className="relative w-[50px] h-[50px] mr-[30px] rounded-full bg-gray-300 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
      </div>
      <div className="relative h-4 w-[113px] overflow-hidden bg-gray-300">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default SideProfileLoading;
