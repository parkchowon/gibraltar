import React from "react";

function TimeBox({ time }: { time: string[] }) {
  return (
    <div className="flex flex-col w-full h-full lg:py-4 py-2 border justify-between items-center text-center border-mainGray rounded-md bg-subGray">
      <p className="font-bold lg:text-sm text-xs">접속 시간</p>
      <div className="flex justify-center">
        <div
          className={`lg:w-[30px] lg:h-[30px] w-4 h-4 rounded-full ${
            time && time.includes("오전")
              ? "bg-[#F2BB16]"
              : "shadow-inner shadow-gray-200"
          }`}
        />
        <div
          className={`lg:w-[30px] lg:h-[30px] w-4 h-4 rounded-full ${
            time && time.includes("오후")
              ? "bg-[#F39D36]"
              : "shadow-inner shadow-gray-200"
          }`}
        />
        <div
          className={`lg:w-[30px] lg:h-[30px] w-4 h-4 rounded-full ${
            time && time.includes("저녁")
              ? "bg-[#F3732A]"
              : "shadow-inner shadow-gray-200"
          }`}
        />
        <div
          className={`lg:w-[30px] lg:h-[30px] w-4 h-4 rounded-full ${
            time && time.includes("새벽")
              ? "bg-[#D95525]"
              : "shadow-inner shadow-gray-200"
          }`}
        />
      </div>
      <p className="font-bold lg:text-sm text-xs">
        {time && time.length ? time.join(" ") : "없음"}
      </p>
    </div>
  );
}

export default TimeBox;
