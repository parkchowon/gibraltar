import React from "react";
import ReactDOM from "react-dom";
import { PostType } from "@/types/home.type";
import { usePostStore } from "@/stores/post.store";
import BackArrowBtn from "@/components/BackArrowBtn";
import ProfileBtn from "@/components/ProfileBtn";
import { UserRow } from "@/types/database";

function PostQuoteModal({
  userData,
  post,
}: {
  userData: UserRow;
  post: PostType;
}) {
  const { setIsModalOpen } = usePostStore();

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex justify-center">
      <div
        onClick={() => setIsModalOpen("closed")}
        className="absolute inset-0 bg-black bg-opacity-10"
      />
      <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] px-6 py-6 bg-white rounded-2xl">
        <BackArrowBtn intent={"profileEditModal"} type="modal" />
        <div className="flex px-4 py-6 gap-3">
          <ProfileBtn
            profileUrl={userData.profile_url}
            userId={userData.id}
            intent={"quote"}
          />
          <textarea
            placeholder="내용을 입력하세요."
            className="w-full py-2 resize-none outline-none"
          ></textarea>
        </div>
        <div className="w-full h-[300px] border border-gray-300 rounded-3xl">
          {/** TODO: post 컴포넌트를 넣으면 오류생김(아마 modal rendering 때문인듯) */}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PostQuoteModal;
