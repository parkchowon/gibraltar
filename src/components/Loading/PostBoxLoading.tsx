import React from "react";

function PostBoxLoading() {
  return (
    <div>
      <div className="relative flex flex-col w-[352px] h-[298px] bg-gray-300 rounded-[30px] py-9 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
      </div>
      <div className="relative mt-[30px] ml-auto w-[106px] h-12 rounded-full bg-gray-400 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export default PostBoxLoading;
