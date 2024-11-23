import { PostType } from "@/types/home.type";
import React, { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";
import Post from "./Post";
import CommentInput from "../../../[userId]/post/[postId]/_components/CommentInput";
import BackArrowBtn from "@/components/BackArrowBtn";

function PostCommentModal({
  post,
  setCommentClick,
}: {
  post: PostType;
  setCommentClick: Dispatch<SetStateAction<boolean>>;
}) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        onClick={() => setCommentClick(false)}
        className="absolute inset-0 bg-black opacity-30"
      />
      <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] bg-white rounded-2xl">
        <BackArrowBtn
          intent={"commentModal"}
          setModalClick={setCommentClick}
          type="modal"
        />
        <Post post={post} />
        <CommentInput
          postId={post.id}
          postUserId={post.user?.id}
          setCommentClick={setCommentClick}
        />
      </div>
    </div>,
    document.body
  );
}

export default PostCommentModal;
