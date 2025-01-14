import React from "react";

function FollowItemLoading() {
  return (
    <div className="flex items-center w-full px-[25px] py-[15px] gap-6">
      <div className="relative w-[46px] h-[46px] rounded-full bg-mainGray/35 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>
      <div className="relative h-4 w-[113px] overflow-hidden bg-mainGray/50">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default FollowItemLoading;
