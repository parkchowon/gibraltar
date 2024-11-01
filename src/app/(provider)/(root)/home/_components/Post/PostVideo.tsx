import React from "react";

function PostVideo({ images }: { images: string[] }) {
  return images.map((image) => {
    return (
      <div key={image} className="relative w-full h-full max-h-full">
        <video controls className="w-full h-full">
          <source src={image} type="video/mp4" />
          해당 브라우저는 비디오를 지원하지 않습니다.
        </video>
      </div>
    );
  });
}

export default PostVideo;
