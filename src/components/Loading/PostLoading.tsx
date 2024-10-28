import React from "react";

function PostLoading() {
  return (
    <div className="flex w-full h-36 px-6 pt-3.5 gap-x-6 bg-gray-200">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="relative rounded-full w-[46px] h-[46px] overflow-hidden bg-gray-300">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
      </div>

      {/* 제목 및 내용 영역 */}
      <div className="flex flex-col gap-y-2">
        {/* 제목 스켈레톤 */}
        <div className="relative w-16 h-5 bg-gray-300 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
        </div>

        {/* 내용 스켈레톤 */}
        <div className="relative w-[570px] h-6 bg-gray-300 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default PostLoading;
