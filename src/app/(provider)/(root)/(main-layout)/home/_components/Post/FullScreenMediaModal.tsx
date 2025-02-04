import ReactDOM from "react-dom";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import XBtn from "@/assets/icons/cancel_x.svg";
import ArrowBtn from "@/assets/icons/arrow_head.svg";

function FullScreenMediaModal({
  imgIdx,
  images,
  setIsFullScreen,
}: {
  imgIdx: number;
  images: string[];
  setIsFullScreen: Dispatch<SetStateAction<boolean>>;
}) {
  const [idx, setIdx] = useState<number>(imgIdx);

  const handleBackClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      setIsFullScreen(false);
    }
  };

  const handleXClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullScreen(false);
  };

  return ReactDOM.createPortal(
    <div
      onClick={handleBackClick}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <button
        className="absolute left-8 top-8 w-9 h-9 cursor-pointer"
        onClick={handleXClick}
      >
        <XBtn width="32px" height="32px" />
      </button>
      {idx !== 0 && (
        <button
          onClick={() => setIdx(idx - 1)}
          className="absolute grid place-items-center left-8 w-10 h-10 rounded-full bg-gray-50/50 rotate-180 p-1 hover:brightness-75"
        >
          <ArrowBtn width="10px" height="20px" />
        </button>
      )}
      <div className="relative w-[80%] h-[90%]">
        <Image
          key={images[idx]}
          alt="full image"
          src={images[idx]}
          fill
          className="absolute object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      {images.length !== 1 && idx !== images.length - 1 && (
        <button
          onClick={() => setIdx(idx + 1)}
          className="absolute grid place-items-center right-8 w-10 h-10 rounded-full bg-gray-50/50 p-1 hover:brightness-75"
        >
          <ArrowBtn width="10px" height="20px" />
        </button>
      )}
    </div>,
    document.body
  );
}

export default FullScreenMediaModal;
