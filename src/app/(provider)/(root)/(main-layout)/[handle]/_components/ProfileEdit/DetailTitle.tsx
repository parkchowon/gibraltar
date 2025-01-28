import React from "react";
import ArrowHead from "@/assets/icons/arrow_head.svg";

function DetailTitle({
  title,
  type,
  onClick,
}: {
  title: string;
  type: string;
  onClick: (type: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(type)}
      className="flex justify-between items-center w-full bg-subGray border border-mainGray rounded-full lg:px-6 lg:py-3 px-4 py-2"
    >
      <p className="lg:text-base text-xs">{title}</p>
      <div className="w-fit h-fit rotate-90">
        <ArrowHead width={15} height={10} />
      </div>
    </button>
  );
}

export default DetailTitle;
