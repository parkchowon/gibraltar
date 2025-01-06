import { useRouter } from "next/navigation";
import React from "react";

function PostTextHighlighted({ text }: { text: string }) {
  const parts = text.split(/(@\w+)/g);
  const router = useRouter();

  const handleClickHandle = (
    handle: string,
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    router.push(`/${handle}`);
  };

  return (
    <p className="mt-[7px] mb-[6px] leading-snug">
      {parts.map((content, idx) =>
        content.startsWith("@") ? (
          <span
            key={idx}
            onClick={(e) => handleClickHandle(content, e)}
            className="text-carrot hover:underline hover:underline-offset-2"
          >
            {content}
          </span>
        ) : (
          <span key={idx}>{content}</span>
        )
      )}
    </p>
  );
}

export default PostTextHighlighted;
