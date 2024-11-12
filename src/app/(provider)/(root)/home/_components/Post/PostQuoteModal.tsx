import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { usePostStore } from "@/stores/post.store";
import BackArrowBtn from "@/components/BackArrowBtn";
import ProfileBtn from "@/components/ProfileBtn";
import PostImage from "./PostImage";
import { useAuth } from "@/contexts/auth.context";

function PostQuoteModal() {
  const { userData } = useAuth();
  const { setIsModalOpen, quotedPost } = usePostStore();

  if (userData)
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex justify-center">
        <div
          onClick={() => setIsModalOpen("closed")}
          className="absolute inset-0 bg-black opacity-30"
        />
        <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] px-6 py-6 bg-white rounded-2xl">
          <BackArrowBtn intent={"profileEditModal"} type="modal" />
          {/* 인용 적는 곳 */}
          <div className="flex px-4 py-6 gap-3">
            <ProfileBtn
              profileUrl={userData.profile_url}
              userId={userData.id}
              intent={"quote"}
              type="non-click"
            />
            <textarea
              placeholder="내용을 입력하세요."
              className="w-full py-2 resize-none outline-none"
            ></textarea>
          </div>
          <div className="w-full h-fit px-6 py-4 border border-gray-300 rounded-3xl">
            {/* 인용하는 post */}
            {quotedPost && (
              <>
                <div className="flex w-full gap-1.5 items-center">
                  <ProfileBtn
                    profileUrl={
                      quotedPost.user ? quotedPost.user?.profile_url : ""
                    }
                    type="non-click"
                    intent="miniQuote"
                  />
                  <p className="font-semibold ml-2">
                    {quotedPost.user?.nickname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {quotedPost.user?.handle}
                  </p>
                </div>
                <div>
                  <p className="mt-[7px] mb-[6px] leading-snug">
                    {quotedPost.content}
                  </p>
                  {quotedPost.images && (
                    <div className="flex w-full h-[300px] overflow-hidden bg-[#6C6C6C] rounded-2xl">
                      <PostImage jsons={quotedPost.images} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex w-full pt-3">
            <button className="px-5 py-3 rounded-full ml-auto bg-gray-300">
              게시하기
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
}

export default PostQuoteModal;
