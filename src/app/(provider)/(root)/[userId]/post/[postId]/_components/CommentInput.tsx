import { createPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function CommentInput({ postId }: { postId: string }) {
  const { userData } = useAuth();
  const [comment, setComment] = useState<string>("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  // 글자 길이에 따른 댓글 높이 정하는 함수
  const handleInputChange = () => {
    const text = textRef.current;
    if (text) {
      text.style.height = "auto";
      text.style.height = `${text.scrollHeight}px`;
      setComment(textRef.current.value);
    }
  };

  useEffect(() => {
    const textarea = textRef.current;
    if (textarea) {
      handleInputChange();
    }
  }, []);

  // 댓글 작성 완료 버튼
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = textRef.current?.value || "";
    if (userData) {
      const newComment = {
        content: comment,
        parent_post_id: postId,
        user_id: userData.id,
        images: null, //나중에 사진 넣을때 여기에
      };
      try {
        await createPost(newComment);
        setComment("");
      } catch (error) {
        console.error("댓글 insert중 error:", error);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => handleCommentSubmit(e)}
      className="flex gap-[25px] px-6 py-[14px]"
    >
      <div className="relative">
        <Image
          src={userData ? userData.profile_url : ""}
          alt="profile"
          width={46}
          height={46}
          className="rounded-full"
        />
      </div>
      <div className="flex-grow">
        <textarea
          ref={textRef}
          value={comment}
          className="w-full h-auto overflow-hidden resize-none bg-transparent outline-none"
          placeholder="댓글을 입력해주세요."
          onInput={handleInputChange}
        ></textarea>
      </div>
      <button
        disabled={!comment.trim()}
        className={`h-fit mt-auto px-6 py-2.5 bg-gray-400 rounded-full disabled:brightness-75`}
      >
        게시하기
      </button>
    </form>
  );
}

export default CommentInput;
