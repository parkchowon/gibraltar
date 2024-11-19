import React from "react";

type ItemProps = {
  text: string;
  postId?: string;
  userId?: string;
};

function OptionItem({ text }: ItemProps) {
  // TODO: 트윗 삭제, 유저 팔,언팔 하는 로직 넣기
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
