import { Json } from "@/types/supabase";
import Image from "next/image";
import React from "react";
import PostVideo from "./PostVideo";

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

  // image 배열일 시
  if (isImageType) {
    return images.map((image) => {
      return (
        <div key={image} className="relative w-full h-full max-h-full">
          <Image
            src={image}
            alt="image"
            fill
            className="absolute object-cover inset-0"
          />
        </div>
      );
    });
    // 비디오 일시
  } else {
    return <PostVideo images={images} />;
  }
}

export default PostMedia;
