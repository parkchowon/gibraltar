"use client";

import { createPost, getTagList } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useTagStore } from "@/stores/tag.store";
import { TagRow } from "@/types/database";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SelectTag from "./SelectTag";
import TagBox from "./TagBox";
import PhotoBtn from "@/assets/icons/photo.svg";
import Cancel from "@/assets/icons/cancel_x.svg";
import { error } from "console";

const IMAGE_MAX_SIZE = 3 * 1024 * 1024; // 2mb
const VIDEO_MAX_SIZE = 300 * 1024 * 1024; // 300mb

function PostBox() {
  const { userData } = useAuth();
  // 포스트 글
  const [text, setText] = useState<string>("");
  // 포스트 사진 첨부
  const [postImg, setPostImg] = useState<string[]>([]);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [imgClick, setImgClick] = useState<boolean>(false);
  // 태그
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const { selectedTag, resetTag } = useTagStore();
  // 태그 위치 구하기
  const postBoxRef = useRef<HTMLDivElement>(null);
  const tagBoxRef = useRef<HTMLDivElement>(null);
  const [tagTop, setTagTop] = useState<number>(0);

  useEffect(() => {
    const getTag = async () => {
      const tags = await getTagList();
      if (tags) {
        setTagList(tags);
      }
    };
    getTag();
  }, []);

  useEffect(() => {
    if (postImg.length > 3) {
      setImgClick(true);
    } else {
      setImgClick(false);
    }
  }, [postImg]);

  // post supabase에 저장
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData && text) {
      const post = {
        content: text,
        user_id: userData.id,
        images: null, // 나중에 이미지 넣을 때 여기에
        parent_post_id: null, // post 생성시에는 null
      };
      resetTag();
      await createPost(post, selectedTag);
    }
    setText("");
  };

  // post 글
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setText(e.target.value);
  };

  // post 이미지(사진, 동영상)
  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const video = Array.from(files).filter((file) =>
      file.type.startsWith("video/")
    ).length;

    // 동영상 일 시
    if (video) {
      if (video > 1) {
        return alert("동영상은 하나씩만 올릴 수 있습니다.");
      } else if (postImg.length > 0 || files.length > 1) {
        return alert("사진과 동영상을 같이 올릴 수 없습니다.");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPostVideo(reader.result as string);
        };
        reader.onerror = () => {
          alert("동영상 게시 중에 오류가 발생했습니다. 다시 시도해주세요.");
        };
        return reader.readAsDataURL(files[0]);
      }
    }

    // 이미지 일 시
    if (postImg.length + files.length > 4) {
      return alert("사진은 최대 4개 까지 게시 가능합니다.");
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      if (file.size > IMAGE_MAX_SIZE) {
        return alert("이미지의 용량이 너무 큽니다.");
      }
      reader.onloadend = () => {
        return setPostImg((prevImages) => [
          ...prevImages,
          reader.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 아이콘 클릭 시
  const handleMediaClick = () => {
    document.getElementById("post-media-input")?.click();
  };

  // 사진 배열에서 지우기
  const handleDeleteImage = (idx: number) => {
    const deletedList = postImg.filter((img, index) => {
      return index !== idx;
    });
    setPostImg(deletedList);
  };

  // 선택한 tag list
  const handleTagAddClick = () => {
    setTagOpen(!tagOpen);
    if (postBoxRef.current && tagBoxRef.current) {
      const postBox = postBoxRef.current.getBoundingClientRect();
      const tagBox = tagBoxRef.current.getBoundingClientRect();
      const relativeTop = tagBox.top - postBox.top;
      setTagTop(relativeTop);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
      <div
        ref={postBoxRef}
        className="relative flex flex-col px-8 bg-gray-300 rounded-[30px] py-9"
      >
        <textarea
          className="h-[134px] bg-transparent focus:outline-none resize-none"
          placeholder="여기에 오버워치 얘기를 적어보세요"
          onChange={handleTextChange}
          value={text}
        />
        <div className="flex w-full py-2 overflow-x-hidden gap-x-3">
          {postImg.length !== 0 &&
            postImg.map((image, idx) => {
              return (
                <div
                  key={idx}
                  className="relative rounded-lg w-[100px] h-[100px] aspect-square"
                >
                  <button
                    className="absolute top-1 right-1 z-20"
                    onClick={() => handleDeleteImage(idx)}
                  >
                    <Cancel width={15} height={15} />
                  </button>
                  <Image
                    src={image}
                    fill
                    className="rounded-lg object-cover"
                    alt="image or video"
                  />
                </div>
              );
            })}
          {postVideo && (
            <video className="w-full" controls>
              <source src={postVideo} type="video/mp4" />
              해당 브라우저가 video를 보여줄 수 없습니다.
            </video>
          )}
        </div>
        <div
          ref={tagBoxRef}
          className={`flex px-1.5 items-center w-full ${
            tagOpen ? "" : "border-b-[1px] border-[#B2B2B2]"
          } z-20`}
        >
          <button
            onClick={handleTagAddClick}
            className={`flex w-fit px-1 ${
              tagOpen ? "pt-7" : "py-3.5"
            } text-left font-semibold`}
          >
            {tagOpen ? "태그 목록" : "태그 추가하기"}
            <Image
              alt="icon"
              width={24}
              height={24}
              src={"/icons/drop-down.svg"}
              className="ml-6"
            />
          </button>
          {/* image 버튼 */}
          {!tagOpen && (
            <button
              onClick={handleMediaClick}
              disabled={imgClick}
              className="ml-auto"
            >
              <PhotoBtn width={15} height={15} />
            </button>
          )}
          {/** 컴퓨터에서 사진 받는 input */}
          <input
            type="file"
            accept="image/*, video/*"
            hidden
            multiple
            id="post-media-input"
            onChange={handleMediaChange}
          />
        </div>
        {/* tag 컴포넌트 */}
        {tagOpen && <TagBox top={tagTop} tagList={tagList} />}
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
