"use client";

import { getTagList } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useTagStore } from "@/stores/tag.store";
import { TagRow } from "@/types/database";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import PhotoBtn from "@/assets/icons/photo.svg";
import TagBox from "./TagBox";
import SelectTag from "./SelectTag";
import PostBoxLoading from "@/components/Loading/PostBoxLoading";
import {
  IMAGE_MAX_SIZE,
  MAX_POST_TEXT_LENGTH,
  VIDEO_MAX_SIZE,
} from "@/constants/post";
import SelectMedia from "./SelectMedia";
import { usePostCreateMutation } from "@/hooks/usePostMutation";
import LogoLoading from "@/components/Loading/LogoLoading";
import UserTag from "./UserTag";
import { handleSearchInvalidCheck } from "@/utils/invalidCheck";
import { useUserTagStore } from "@/stores/userTag.store";
import { highlightHandle } from "@/utils/highlightHandle";

function PostBox() {
  const { userData, isPending } = useAuth();
  // 포스트 글
  const [text, setText] = useState<string>("");
  // 포스트 사진 첨부
  const [postImg, setPostImg] = useState<string[]>([]);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [imgClick, setImgClick] = useState<boolean>(false);
  // 포스트 사진, 동영상 파일
  const [postFile, setPostFile] = useState<File[]>([]);
  // 태그
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const { selectedTag, resetTag } = useTagStore();
  // 태그 위치 구하기
  const postBoxRef = useRef<HTMLDivElement>(null);
  const tagBoxRef = useRef<HTMLDivElement>(null);
  const [tagTop, setTagTop] = useState<number>(0);

  // 유저 태그 바
  const [isActiveUserTag, setIsActiveUserTag] = useState<boolean>(false); // user handle 검색되면 나오는 모달
  const [userTag, setUserTag] = useState<string>(""); // 선택한 한 명의 유저의 handle
  const [taggedUser, setTaggedUser] = useState<string[]>([]); // text안에 입력된 handle array
  const { selectedHandle, setSelectedUser } = useUserTagStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divHighLightRef = useRef<HTMLDivElement>(null);

  // useMutation으로 post 생성
  const mutation = usePostCreateMutation();

  // 태그
  useEffect(() => {
    const getTag = async () => {
      const tags = await getTagList();
      if (tags) {
        setTagList(tags);
      }
    };
    getTag();
  }, []);

  // textarea와 div의 스크롤 동기화

  useEffect(() => {
    const handleScroll = () => {
      if (divHighLightRef.current && textareaRef.current) {
        divHighLightRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("scroll", handleScroll);
      return () => {
        textarea.removeEventListener("scroll", handleScroll);
      };
    }
  }, [text]);

  // post에 image 갯수 제한을 위한 상태로직
  useEffect(() => {
    if (postImg.length > 3) {
      setImgClick(true);
    } else {
      setImgClick(false);
    }
  }, [postImg]);

  // handle이 선택될 때
  useEffect(() => {
    if (selectedHandle === "") return;
    setUserTag("");
    setTaggedUser([...taggedUser, `@${selectedHandle}`]);
    const tagLength = userTag.length;
    setText(text.slice(0, -tagLength) + selectedHandle + " ");
    setIsActiveUserTag(false);
  }, [selectedHandle]);

  // post supabase에 저장
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData && text) {
      const post = {
        content: text,
        user_id: userData.id,
        images: postFile.length === 0 ? null : postFile,
        parent_post_id: null, // post 생성시에는 null
      };
      resetTag();

      const tags = selectedTag.length === 0 ? undefined : selectedTag;
      mutation.mutate({ post: post, tags: tags, handles: taggedUser });
    }
    setText("");
    setPostVideo(null);
    setPostImg([]);
    setPostFile([]);
  };

  // post 글
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const textarea = textareaRef.current;
    if (textarea && divHighLightRef.current) {
      if (textarea.scrollHeight > textarea.clientHeight) {
        divHighLightRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }

    const lastWord = e.currentTarget.value.trim().split(" ").pop();
    const lastChar = e.currentTarget.value.slice(-1);

    // text의 맨 끝에 @이가 오면
    if (lastChar === "@" || (lastWord?.charAt(0) === "@" && lastChar !== " ")) {
      // 1.userTag리스트를 보여주는 tag의 top 위치를 정함
      if (postBoxRef.current && tagBoxRef.current) {
        const postBox = postBoxRef.current.getBoundingClientRect();
        const tagBox = tagBoxRef.current.getBoundingClientRect();
        const relativeTop = tagBox.top - postBox.top;
        setTagTop(relativeTop);
      }
      // 2.userTag 컴포넌트를 활성화
      setIsActiveUserTag(true);
    }
    // userTag를 검색할 때
    if (isActiveUserTag) {
      if (handleSearchInvalidCheck(lastChar)) {
        setUserTag(lastWord?.substring(1) || "");
      } else {
        setIsActiveUserTag(false);
        setUserTag("");
        setSelectedUser(0);
      }
    }

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
        if (files[0].size > VIDEO_MAX_SIZE) {
          return alert("동영상 크기가 너무 큽니다. 50mb이하로 올려주세요");
        }
        setPostFile([...Array.from(files)]);
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
      setPostFile([...postFile, ...Array.from(files)]);
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

  if (isPending) return <PostBoxLoading />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-fit">
      <div
        ref={postBoxRef}
        className="relative flex flex-col px-8 bg-subGray lg:border lg:rounded-[30px] py-9 border-b border-mainGray"
      >
        {mutation.isPending && (
          <div className="absolute top-0 left-0 flex w-full h-full justify-center items-center rounded-[30px] bg-black/20">
            <LogoLoading />
          </div>
        )}
        <div className="relative w-full h-[134px]">
          <textarea
            ref={textareaRef}
            className="absolute top-0 left-0 w-full h-full bg-transparent focus:outline-none resize-none text-base leading-[normal] whitespace-pre-wrap break-words overflow-y-auto text-transparent caret-black z-20 placeholder:text-mainGray"
            placeholder="여기에 오버워치 얘기를 적어보세요"
            onChange={handleTextChange}
            maxLength={MAX_POST_TEXT_LENGTH}
            spellCheck="false"
            autoComplete="false"
            value={text}
          />
          <div
            ref={divHighLightRef}
            className="absolute w-full text-bla h-full top-0 left-0 z-10 text-base leading-[normal] whitespace-pre-wrap break-words overflow-y-auto pointer-events-none"
            dangerouslySetInnerHTML={{
              __html: highlightHandle(text, [
                ...taggedUser,
                `@${selectedHandle}`,
              ]),
            }}
          />
        </div>
        {/* 선택한 media가 표시되는 곳 */}
        <SelectMedia
          postFile={postFile}
          postImg={postImg}
          postVideo={postVideo}
          setPostFile={setPostFile}
          setPostImg={setPostImg}
          setPostVideo={setPostVideo}
        />
        <div
          ref={tagBoxRef}
          className={`flex px-1.5 items-center w-full ${
            tagOpen ? "" : "border-b-[1px] border-[#B2B2B2]"
          } z-20`}
        >
          <button
            type="button"
            onClick={handleTagAddClick}
            className={`flex w-fit px-1 ${
              tagOpen ? "pt-7" : "py-3.5"
            } text-left font-semibold whitespace-nowrap truncate`}
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
              type="button"
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
        {/* userTag 컴포넌트 */}
        {isActiveUserTag && <UserTag top={tagTop} handle={userTag} />}
        {/* tag 컴포넌트 */}
        {tagOpen && <TagBox top={tagTop} tagList={tagList} />}
        <SelectTag />
      </div>
      <button
        type="submit"
        disabled={!text.trim()}
        className={`mt-[30px] ml-auto px-6 py-3 rounded-full bg-black text-white disabled:bg-mainGray`}
      >
        게시하기
      </button>
    </form>
  );
}

export default PostBox;
