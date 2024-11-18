import React from "react";

type ItemProps = {
  text: string;
  postId?: string;
  userId?: string;
};

function OptionItem({ text }: ItemProps) {
  return (
    <button
      className={`w-full text-center py-3 text-xs font-semibold ${
        text === "삭제하기" && "text-warning"
      }`}
    >
      {text}
    </button>
  );
}

export default OptionItem;
