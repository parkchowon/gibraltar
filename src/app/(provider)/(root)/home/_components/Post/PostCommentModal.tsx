import { PostType } from "@/types/home.type";
import ArrowBtn from "@/assets/icons/arrow.svg";
import React, { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";
import Post from "./Post";
import CommentInput from "../../../[userId]/post/[postId]/_components/CommentInput";

function PostCommentModal({
  post,
  setCommentClick,
}: {
  post: PostType;
  setCommentClick: Dispatch<SetStateAction<boolean>>;
}) {
  const handleBackClick = () => {
    setCommentClick(false);
  };
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        onClick={() => setCommentClick(false)}
        className="absolute inset-0 bg-black opacity-30"
      />
      <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] bg-white rounded-2xl">
        <div className="flex w-full py-6 px-[25px] gap-8">
          <button onClick={handleBackClick}>
            <ArrowBtn width="15" height="19" />
          </button>
          <p>홈으로</p>
        </div>
        <Post post={post} />
        <CommentInput postId={post.id} />
      </div>
    </div>,
    document.body
  );
}

export default PostCommentModal;
