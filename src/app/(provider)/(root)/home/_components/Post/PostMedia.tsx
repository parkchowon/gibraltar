import { Json } from "@/types/supabase";
import Image from "next/image";
import React, { useState } from "react";
import PostVideo from "./PostVideo";
import FullScreenMediaModal from "./FullScreenMediaModal";

function PostMedia({
  jsons,
}: {
  jsons:
    | string
    | number
    | true
    | {
        [key: string]: Json | undefined;
      }
    | Json[];
}) {
  // post media 배열
  const jsonString = JSON.stringify(jsons);
  const images = JSON.parse(jsonString) as string[];
  const isImageType = images && images[0].includes("image");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [imgIdx, setImgIdx] = useState<number>(0);

  const handleMediaClick = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsFullScreen(true);
    setImgIdx(index);
  };

  return (
    <div
      className={`flex w-full h-[300px] ${
        images.length !== 1 && "grid grid-cols-2"
      } overflow-hidden rounded-2xl gap-1`}
      onClick={(e) => e.stopPropagation()}
    >
      {isFullScreen && (
        <FullScreenMediaModal
          imgIdx={imgIdx}
          images={images}
          setIsFullScreen={setIsFullScreen}
        />
      )}
      {isImageType ? (
        images.map((image, index) => {
          return (
            <div
              key={image}
              className={`relative w-full h-full max-h-full} ${
                images.length === 1 ? "col-span-2 row-span-2" : ""
              }
              ${images.length === 2 ? "col-span-1 row-span-2" : ""}
              ${
                images.length === 3 && index === 0
                  ? "col-span-1 row-span-2"
                  : ""
              }
              ${images.length === 3 && index > 0 ? "col-span-1 row-span-1" : ""}
              `}
              onClick={(e) => handleMediaClick(index, e)}
            >
              <Image
                src={image}
                alt="image"
                fill
                className={`absolute object-cover inset-0`}
              />
            </div>
          );
        })
      ) : (
        <PostVideo images={images} />
      )}
    </div>
  );
}

export default PostMedia;
