import { usePostDeleteMutation } from "@/hooks/usePostMutation";
import { deletePostType } from "@/types/home.type";
import React from "react";

type ItemProps = {
  text: string;
  post: deletePostType;
};

function OptionItem({ text, post }: ItemProps) {
  // TODO: 트윗 삭제, 유저 팔,언팔 하는 로직 넣기

  const mutation = usePostDeleteMutation();

  const handleOptionClick = (text: string) => {
    switch (text) {
      case "삭제하기":
        return mutation.mutate({
          postId: post.postId,
          userId: post.userId,
        });
    }
  };

  return (
    <button
      onClick={() => handleOptionClick(text)}
      className={`w-full text-center py-3 text-xs font-semibold ${
        text === "삭제하기" && "text-warning"
      }`}
    >
      {text}
    </button>
  );
}

export default OptionItem;
