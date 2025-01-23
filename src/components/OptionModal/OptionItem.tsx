import { usePostDeleteMutation } from "@/hooks/usePostMutation";
import { deletePostType } from "@/types/home.type";
import React, { Dispatch, SetStateAction, useState } from "react";

type ItemProps = {
  text: string;
  post: deletePostType;
  onClick?: () => void;
};

function OptionItem({ text, post, onClick }: ItemProps) {
  const mutation = usePostDeleteMutation();

  const handleOptionClick = (
    text: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    switch (text) {
      case "삭제하기":
        return mutation.mutate({
          postId: post.postId,
          userId: post.userId,
        });
    }
    if (onClick) onClick();
  };

  return (
    <button
      onClick={(e) => handleOptionClick(text, e)}
      className={`w-full text-center py-3 text-xs font-semibold hover:bg-subGray ${
        text === "삭제하기" && "text-warning"
      }`}
    >
      {text}
    </button>
  );
}

export default OptionItem;
