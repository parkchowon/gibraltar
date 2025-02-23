import React from "react";

function ProfileLoading() {
  return (
    <div className="flex w-full h-fit pt-[50px] pb-[5.5%] px-[95px] bg-white">
      <div className="relative w-[21.1%] h-[21.1%] mr-[95px] aspect-square rounded-full bg-mainGray/35">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col gap-4">
          <div className="relative w-28 h-6 bg-mainGray/35">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
          </div>
          <div className="relative w-28 h-4 mb-1 bg-mainGray/35">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="relative flex gap-14 w-28 h-4 bg-mainGray/35">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default ProfileLoading;
