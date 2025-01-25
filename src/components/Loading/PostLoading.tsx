import React from "react";

function PostLoading() {
  return (
    <div className="flex w-full lg:h-36 h-20 lg:px-6 px-2 pt-3.5 gap-x-6 bg-subGray">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="relative rounded-full lg:w-[46px] lg:h-[46px] w-10 h-10 overflow-hidden bg-mainGray/35">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
      </div>

      {/* 제목 및 내용 영역 */}
      <div className="flex flex-col gap-y-2">
        {/* 제목 스켈레톤 */}
        <div className="relative lg:w-16 w-10 lg:h-5 h-3 bg-mainGray/35 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
        </div>

        {/* 내용 스켈레톤 */}
        <div className="relative lg:w-[570px] w-20 lg:h-6 h-3 bg-mainGray/35 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-subGray/50 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default PostLoading;
