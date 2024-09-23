"use client";

import { createPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { ChangeEvent, FormEvent, useState } from "react";

function PostBox() {
  const { userData } = useAuth();
  const [text, setText] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData && text) {
      const post = {
        content: text,
        user_id: userData.id,
        tags: null,
        images: null,
      };
      await createPost(post);
    }
    setText("");
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
      <div className="flex flex-col px-8 bg-gray-300 rounded-[30px] py-9">
        <textarea
          className="h-[243px] bg-transparent focus:outline-none resize-none"
          placeholder="여기에 오버워치 얘기를 적어보세요"
          onChange={handleTextChange}
          value={text}
        />
        <button className="w-full px-1 py-3.5 border-y-[1px] text-left font-semibold  border-[#B2B2B2]">
          태그 추가하기
        </button>
        <div>{}</div>
      </div>
      <button
        className={`mt-[30px] ml-auto px-6 py-3 rounded-full bg-gray-300 ${
          text ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        게시하기
      </button>
    </form>
  );
}

export default PostBox;
