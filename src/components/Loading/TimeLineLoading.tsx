import React from "react";
import PostLoading from "./PostLoading";

function TimeLineLoading() {
  return (
    <div className="flex flex-col divide-y-[1px] divide-mainGray bg-subGray">
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
