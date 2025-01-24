import { useLikeMutation, useRepostMutation } from "@/hooks/usePostMutation";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Repost from "@/assets/icons/post_repeat.svg";
import Like from "@/assets/icons/post_heart.svg";

type PostReactionProps = {
  post: PostType;
  userId: string | undefined;
  reaction: {
    number: number;
    type: string;
    byMe: boolean;
  };
};
function PostReactButton({ post, userId, reaction }: PostReactionProps) {
  const { setIsModalOpen, setModal, setQuotedPost } = usePostStore();

  const [reactionClick, setReactionClick] = useState<boolean>(false);

  // repost, like 낙관적 업데이트
  const { mutate: repostMutate } = useRepostMutation();
  const { mutate: likeMutate } = useLikeMutation();

  useEffect(() => {
    if (reaction.byMe === true) {
      setReactionClick(true);
    }
  }, [reaction]);

  // 하트와 재게시 누를 시
  const handleReactClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string,
    tag: string
  ) => {
    e.stopPropagation();

    // 마음 누를 시 로직
    if (tag === "like") {
      if (!reactionClick) {
        setReactionClick(true);
        return likeMutate({ postId, userId: userId, postUserId: post.user_id });
      } else {
        setReactionClick(false);
        return likeMutate({
          postId,
          userId: userId,
          state: false,
          postUserId: post.user_id,
        });
      }
    } else {
      // 재게시버튼 누를 시
      if (reactionClick) {
        setReactionClick(false);
        return repostMutate({
          postId,
          userId: userId,
          postUserId: post.user_id,
        });
      }
      const currentBtn = e.currentTarget.getBoundingClientRect();
      setIsModalOpen("repost");
      setQuotedPost(post);
      setModal({
        postId: postId,
        postUserId: post.user_id,
        top: currentBtn.top,
        left: currentBtn.left,
      });
    }
  };

  const renderingIcon = () => {
    if (reaction.type === "repost") {
      if (reaction.byMe) {
        return <Repost width={18} height={18} style={{ color: "#FC7B3D" }} />;
      }
      return <Repost width={18} height={18} style={{ color: "#000000" }} />;
    } else {
      if (reaction.byMe) {
        return (
          <Like
            width={18}
            height={18}
            style={{ color: "#3E97B2", fill: "#3E97B2" }}
          />
        );
      }
      return <Like width={18} height={18} style={{ color: "#000000" }} />;
    }
  };

  return (
    <div className="relative flex">
      <button
        onClick={(e) => handleReactClick(e, post.id, reaction.type)}
        className="flex rounded-full p-1 hover:bg-mainGray/20"
      >
        {renderingIcon()}
      </button>
      <p
        className={`${
          reactionClick
            ? reaction.type === "repost"
              ? "text-carrot"
              : "text-mint"
            : "text-black"
        }`}
      >
        {reaction.number}
      </p>
    </div>
  );
}

export default PostReactButton;
