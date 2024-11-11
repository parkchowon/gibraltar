import React from "react";
import PostLoading from "./PostLoading";

function TimeLineLoading() {
  // TODO: 여기 프로필이 찌그러짐
  return (
    <div className="flex flex-col divide-y-[1px] divide-gray-300 px-6 bg-gray-200">
      <PostLoading />
      <PostLoading />
      <PostLoading />
      <PostLoading />
      <PostLoading />
      <PostLoading />
      <div className="flex-grow bg-[#EAEAEA]" />
    </div>
  );
}

export default TimeLineLoading;
