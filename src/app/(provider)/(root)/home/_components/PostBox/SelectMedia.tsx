import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";
import Cancel from "@/assets/icons/cancel_x.svg";
import NextBtn from "@/assets/icons/arrow_head.svg";

type SelectMediaProps = {
  postImg: string[] | null;
  postFile: File[] | null;
  postVideo: string | null;
  setPostFile: Dispatch<SetStateAction<File[]>>;
  setPostImg: Dispatch<SetStateAction<string[]>>;
  setPostVideo: Dispatch<SetStateAction<string | null>>;
};

function SelectMedia({
  postImg,
  postFile,
  postVideo,
  setPostFile,
  setPostImg,
  setPostVideo,
}: SelectMediaProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // 사진 배열에서 지우기
  const handleDeleteImage = (idx?: number) => {
    if (idx?.toString) {
      const deletedList = postImg
        ? postImg.filter((img, index) => {
            return index !== idx;
          })
        : [];
      const deletedFiles = postFile
        ? postFile.filter((file, index) => {
            return index !== idx;
          })
        : [];

      setPostFile(deletedFiles);
      setPostImg(deletedList);
    } else {
      setPostFile([]);
      setPostVideo(null);
    }
  };

  const handleNextClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    next?: boolean
  ) => {
    e.preventDefault();
    if (!next) {
      if (postImg?.length === 4) {
        return setCurrentIdx(currentIdx - 2);
      }
      return setCurrentIdx(currentIdx - 1);
    }
    if (postImg?.length === 4) {
      return setCurrentIdx(currentIdx + 2);
    }
    setCurrentIdx(currentIdx + 1);
  };

  return (
    <div className="relative flex w-full py-2 gap-x-3 items-center">
      {postImg && postImg.length !== 0 && (
        <>
          <button
            onClick={handleNextClick}
            className={`absolute grid place-items-center -left-3 w-7 h-7 rounded-full bg-gray-400/55 z-40 rotate-180 ${
              currentIdx === 0 && "hidden"
            }`}
          >
            <NextBtn width={20} height={15} />
          </button>
          <div className="relative rounded-lg w-[50%] h-[100px]">
            <button
              type="button"
              className="absolute top-1 right-1 z-20"
              onClick={() => handleDeleteImage(currentIdx)}
            >
              <Cancel width={15} height={15} />
            </button>
            <Image
              src={postImg[currentIdx]}
              fill
              className="rounded-lg object-cover"
              alt="image"
            />
          </div>
          {postImg[currentIdx + 1] && (
            <div className="relative rounded-lg w-[50%] h-[100px]">
              <button
                type="button"
                className="absolute top-1 right-1 z-20"
                onClick={() => handleDeleteImage(currentIdx + 1)}
              >
                <Cancel width={15} height={15} />
              </button>
              <Image
                src={postImg[currentIdx + 1]}
                fill
                className="rounded-lg object-cover"
                alt="image"
              />
            </div>
          )}
          <button
            onClick={(e) => handleNextClick(e, true)}
            className={`absolute grid place-items-center -right-3 w-7 h-7 rounded-full bg-gray-400/55 z-40 ${
              postImg.length < 3 || currentIdx + 2 === postImg.length
                ? "hidden"
                : "block"
            }`}
          >
            <NextBtn width={20} height={15} />
          </button>
        </>
      )}
      {postVideo && (
        <div className="relative">
          <button
            type="button"
            className="absolute top-2 right-2 z-20"
            onClick={() => handleDeleteImage()}
          >
            <Cancel width={20} height={20} />
          </button>
          <video className="w-full rounded-lg" controls>
            <source src={postVideo} type="video/mp4" />
            해당 브라우저가 video를 보여줄 수 없습니다.
          </video>
        </div>
      )}
    </div>
  );
}
export default SelectMedia;
