import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { usePostStore } from "@/stores/post.store";
import BackArrowBtn from "@/components/BackArrowBtn";
import ProfileBtn from "@/components/ProfileBtn";
import { useAuth } from "@/contexts/auth.context";
import PostQuote from "./PostQuote";
import { MAX_POST_TEXT_LENGTH } from "@/constants/post";
import { useQuoteMutation } from "@/hooks/usePostMutation";

function QuoteModal() {
  const { userData } = useAuth();
  const { setIsModalOpen, quotedPost, isModalOpen } = usePostStore();
  const [quoteText, setQuoteText] = useState<string>("");
  const [quoteLoading, setQuoteLoading] = useState<boolean>(true);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const mutation = useQuoteMutation();

  // 글자 길이에 따른 댓글 높이 정하는 함수
  const handleInputChange = () => {
    const text = textRef.current;
    if (text) {
      text.style.height = "auto";
      text.style.height = `${text.scrollHeight}px`;
      setQuoteText(textRef.current.value);
    }
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus();
      handleInputChange();
    }
  }, []);

  // 모달이 열려있고 mutation이 성공적으로 끝날경우 모달 닫힘
  if (isModalOpen === "quote" && mutation.isSuccess) {
    setIsModalOpen("closed");
  }

  // post 올라가는 중 loading
  useEffect(() => {
    if (mutation.isPending) {
      const timer = setTimeout(() => {
        setQuoteLoading(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setQuoteLoading(false);
    }
  }, [mutation.isPending]);

  const handleQuoteSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userData && quotedPost) {
      const newPost = {
        content: quoteText,
        images: null, // TODO: 이미지 나중에 넣을 때
        parent_post_id: null,
        quoted_post_id: quotedPost.id,
        post_user_id: quotedPost.user?.id || "",
        user_id: userData.id,
      };
      setQuoteText("");
      mutation.mutate({ quote: newPost });
    }
  };

  if (userData)
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex justify-center">
        <div
          onClick={() => setIsModalOpen("closed")}
          className="absolute inset-0 bg-black opacity-30"
        />
        <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] px-6 py-6 bg-white rounded-2xl">
          <BackArrowBtn intent={"profileEditModal"} type="modal" />
          {quoteLoading && (
            <div className="absolute w-full h-full grid place-items-center">
              <p>loading...</p>
            </div>
          )}
          {/* 인용 적는 곳 */}
          <div className="flex px-4 py-6 gap-3">
            <ProfileBtn
              profileUrl={userData.profile_url}
              userId={userData.id}
              intent={"quote"}
              type="non-click"
            />
            <textarea
              ref={textRef}
              value={quoteText}
              maxLength={MAX_POST_TEXT_LENGTH}
              placeholder="내용을 입력하세요."
              className="w-full h-max-[300px] py-2 resize-none outline-none"
              onInput={handleInputChange}
            ></textarea>
          </div>
          {/* 인용하는 post */}
          <PostQuote />
          <div className="flex w-full pt-3">
            <button
              disabled={!quoteText.trim()}
              onClick={handleQuoteSubmit}
              className="px-5 py-3 rounded-full ml-auto bg-gray-300 disabled:brightness-75"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
}

export default QuoteModal;
