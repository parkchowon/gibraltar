"use client";

import { createPost, getTagList } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useTagStore } from "@/stores/tag.store";
import { TagRow } from "@/types/database";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SelectTag from "./SelectTag";
import TagBox from "./TagBox";

function PostBox() {
  const { userData } = useAuth();
  const [text, setText] = useState<string>("");
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const { selectedTag, resetTag } = useTagStore();

  useEffect(() => {
    const getTag = async () => {
      const tags = await getTagList();
      if (tags) {
        setTagList(tags);
      }
    };
    getTag();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData && text) {
      const post = {
        content: text,
        user_id: userData.id,
        images: null,
      };
      resetTag();
      await createPost(post, selectedTag);
    }
    setText("");
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleTagAddClick = () => {
    setTagOpen(!tagOpen);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
      <div className="relative flex flex-col px-8 bg-gray-300 rounded-[30px] py-9">
        <textarea
          className="h-[243px] bg-transparent focus:outline-none resize-none"
          placeholder="여기에 오버워치 얘기를 적어보세요"
          onChange={handleTextChange}
          value={text}
        />
        <button
          onClick={handleTagAddClick}
          className={`flex justify-between w-full px-1 ${
            tagOpen ? "pt-7" : "py-3.5 border-b-[1px]"
          } text-left font-semibold  border-[#B2B2B2] z-20`}
        >
          {tagOpen ? "태그 목록" : "태그 추가하기"}
          <Image
            alt="icon"
            width={24}
            height={24}
            src={"/icons/drop-down.svg"}
          />
        </button>
        {tagOpen && <TagBox tagList={tagList} />}
        <SelectTag />
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
