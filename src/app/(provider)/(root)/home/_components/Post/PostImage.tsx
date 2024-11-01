import Image from "next/image";
import React from "react";

function PostImage({ images }: { images: string[] }) {
  return images.map((image) => {
    return (
      <div key={image} className="relative w-full h-full max-h-full">
        <Image
          src={image}
          alt="image"
          fill
          className="absolute object-contain inset-0"
        />
      </div>
    );
  });
}

export default PostImage;
