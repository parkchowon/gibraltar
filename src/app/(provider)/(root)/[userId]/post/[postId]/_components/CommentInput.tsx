import { useAuth } from "@/contexts/auth.context";
import { useCommentMutation } from "@/hooks/usePostMutation";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

function CommentInput({
  postId,
  setCommentClick,
}: {
  postId: string;
  setCommentClick?: Dispatch<SetStateAction<boolean>>;
}) {
  const { userData } = useAuth();
  const [comment, setComment] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(true);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const mutation = useCommentMutation();

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

  // 모달이고 mutation이 성공적으로 끝날 시에 모달 닫힘
  if (setCommentClick && mutation.isSuccess) {
    setCommentClick(false);
  }

  useEffect(() => {
    if (mutation.isPending) {
      const timer = setTimeout(() => {
        setCommentLoading(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCommentLoading(false);
    }
  }, [mutation.isPending]);

  // TODO: 댓글도 낙관적 업데이트 적용해서 빠른 업데이트 되게 하기
  // 댓글 작성 완료 버튼
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = textRef.current?.value || "";
    if (userData) {
      // comment 저장할 내용
      const newComment = {
        content: comment,
        parent_post_id: postId,
        user_id: userData.id,
        images: null, //나중에 사진 넣을때 여기에
      };
      setComment("");
      mutation.mutate({ comment: newComment });
    }
  };

  return (
    <form onSubmit={(e) => handleCommentSubmit(e)}>
      <div className="relative flex w-full gap-[25px] px-6 py-[14px]">
        {commentLoading && (
          <div className="absolute flex z-20 top-0 left-0 w-full h-full items-center justify-center bg-black opacity-30">
            <p className="text-white">loading...</p>
          </div>
        )}
        <div className="relative h-[46px] w-[46px]">
          <Image
            src={userData ? userData.profile_url : ""}
            alt="profile"
            fill
            className="absolute rounded-full object-cover"
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
      </div>
    </form>
  );
}

export default CommentInput;
