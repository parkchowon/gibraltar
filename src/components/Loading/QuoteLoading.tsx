import React from "react";

function QuoteLoading() {
  return (
    <div className="flex w-full h-fit px-6 py-6 gap-1.5 border border-gray-300 rounded-3xl bg-gray-200">
      {/* 프로필 이미지 스켈레톤 */}
      <div className="relative rounded-full w-[46px] h-[46px] overflow-hidden bg-gray-300">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
      </div>

      {/* 제목 및 내용 영역 */}
      <div className="flex flex-grow flex-col gap-y-2">
        {/* 제목 스켈레톤 */}
        <div className="relative w-16 h-5 bg-gray-300 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
        </div>

        {/* 내용 스켈레톤 */}
        <div className="relative w-full h-6 bg-gray-300 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default QuoteLoading;
