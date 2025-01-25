import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { usePostStore } from "@/stores/post.store";
import BackArrowBtn from "@/components/BackArrowBtn";
import ProfileBtn from "@/components/ProfileBtn";
import { useAuth } from "@/contexts/auth.context";
import PostQuote from "./PostQuote";
import {
  IMAGE_MAX_SIZE,
  MAX_POST_TEXT_LENGTH,
  VIDEO_MAX_SIZE,
} from "@/constants/post";
import { useQuoteMutation } from "@/hooks/usePostMutation";
import LogoLoading from "@/components/Loading/LogoLoading";
import Photo from "@/assets/icons/photo.svg";
import SelectMedia from "../PostBox/SelectMedia";

function QuoteModal() {
  const { userData } = useAuth();
  const { setIsModalOpen, quotedPost, isModalOpen } = usePostStore();
  const [quoteText, setQuoteText] = useState<string>("");
  const [quoteLoading, setQuoteLoading] = useState<boolean>(true);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const mutation = useQuoteMutation();

  // 포스트 사진 첨부
  const [postImg, setPostImg] = useState<string[]>([]);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  // 포스트 사진, 동영상 파일
  const [postFile, setPostFile] = useState<File[]>([]);

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

  useEffect(() => {
    // 모달이 열려있고 mutation이 성공적으로 끝날경우 모달 닫힘
    if (isModalOpen === "quote" && mutation.isSuccess) {
      setIsModalOpen("closed");
    }
  }, [mutation.isSuccess]);

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
        images: postFile,
        parent_post_id: null,
        quoted_post_id: quotedPost.id,
        post_user_id: quotedPost.user?.id || "",
        user_id: userData.id,
      };
      setQuoteText("");
      mutation.mutate({ quote: newPost });
    }
  };

  // 이미지 아이콘 클릭 시
  const handleMediaClick = () => {
    document.getElementById("quote-media-input")?.click();
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

  if (userData)
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex justify-center">
        <div
          onClick={() => setIsModalOpen("closed")}
          className="absolute inset-0 bg-black opacity-30"
        />
        <div className="relative top-[6.9%] w-[38.3%] h-fit pb-6 px-6 bg-white rounded-2xl">
          {quoteLoading && (
            <div className="absolute top-0 left-0 w-full h-full grid place-items-center rounded-2xl bg-black/30 z-50">
              <LogoLoading />
            </div>
          )}
          <BackArrowBtn intent={"profileEditModal"} type="modal" />
          {/* 인용 적는 곳 */}
          <div className="flex px-4 py-6 gap-3 mt-[73px]">
            <ProfileBtn
              profileUrl={userData.profile_url}
              handle={userData.handle ?? undefined}
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
          {/* 선택한 media가 표시되는 곳 */}
          <div className="px-5 pb-3" hidden={!postFile.length}>
            <SelectMedia
              postFile={postFile}
              postImg={postImg}
              postVideo={postVideo}
              setPostFile={setPostFile}
              setPostImg={setPostImg}
              setPostVideo={setPostVideo}
            />
          </div>
          {/* 인용하는 post */}
          <PostQuote />
          <div className="flex items-center w-full pt-3 pl-4">
            <div className="cursor-pointer" onClick={handleMediaClick}>
              <Photo width={17} height={17} />
              {/** 컴퓨터에서 사진 받는 input */}
              <input
                type="file"
                accept="image/*, video/*"
                hidden
                multiple
                id="quote-media-input"
                onChange={handleMediaChange}
              />
            </div>
            <button
              disabled={!quoteText.trim()}
              onClick={handleQuoteSubmit}
              className="px-5 py-3 rounded-full ml-auto bg-black text-white disabled:bg-mainGray"
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
