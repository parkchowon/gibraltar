import React from "react";

function PostBoxLoading() {
  return (
    <div>
      <div className="relative flex flex-col w-[352px] h-[298px] bg-mainGray/35 rounded-[30px] py-9 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>
      <div className="relative mt-[30px] ml-auto w-[106px] h-12 rounded-full bg-mainGray/35 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default PostBoxLoading;
