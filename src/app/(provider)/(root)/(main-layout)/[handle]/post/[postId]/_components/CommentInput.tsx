import LogoLoading from "@/components/Loading/LogoLoading";
import {
  IMAGE_MAX_SIZE,
  MAX_POST_TEXT_LENGTH,
  VIDEO_MAX_SIZE,
} from "@/constants/post";
import { useAuth } from "@/contexts/auth.context";
import { useCommentMutation } from "@/hooks/usePostMutation";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Photo from "@/assets/icons/photo.svg";
import SelectMedia from "@/app/(provider)/(root)/(main-layout)/home/_components/PostBox/SelectMedia";

function CommentInput({
  postId,
  postUserId,
  setCommentClick,
}: {
  postId: string;
  postUserId?: string;
  setCommentClick?: Dispatch<SetStateAction<boolean>>;
}) {
  const { userData } = useAuth();
  const [comment, setComment] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(true);

  // 포스트 사진 첨부
  const [postImg, setPostImg] = useState<string[]>([]);
  const [postVideo, setPostVideo] = useState<string | null>(null);
  const [imgClick, setImgClick] = useState<boolean>(false);
  // 포스트 사진, 동영상 파일
  const [postFile, setPostFile] = useState<File[]>([]);

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

  useEffect(() => {
    // 모달이고 mutation이 성공적으로 끝날 시에 모달 닫힘
    if (setCommentClick && mutation.isSuccess) {
      setCommentClick(false);
    }
  }, [mutation.isSuccess]);

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

  // 댓글 작성 완료 버튼
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = textRef.current?.value || "";
    if (userData) {
      // comment 저장할 내용
      const newComment = {
        content: comment,
        parent_post_id: postId,
        parent_user_id: postUserId,
        user_id: userData.id,
        images: postFile,
      };
      setComment("");
      // 낙관적 업데이트
      mutation.mutate({ comment: newComment });
    }
  };

  // 이미지 아이콘 클릭 시
  const handleMediaClick = () => {
    document.getElementById("comment-media-input")?.click();
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

  return (
    <form onSubmit={(e) => handleCommentSubmit(e)}>
      <div className="relative flex w-full gap-[25px] px-6 py-[14px]">
        {commentLoading && (
          <div className="absolute flex z-20 top-0 left-0 w-full h-full items-center justify-center bg-black/30">
            <LogoLoading />
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
        <div className="flex flex-col flex-grow">
          <textarea
            ref={textRef}
            value={comment}
            maxLength={MAX_POST_TEXT_LENGTH}
            className="w-full h-auto overflow-hidden resize-none bg-transparent outline-none placeholder:text-mainGray"
            placeholder="댓글을 입력해주세요."
            onInput={handleInputChange}
          ></textarea>
          {/* 선택한 media가 표시되는 곳 */}
          <SelectMedia
            postFile={postFile}
            postImg={postImg}
            postVideo={postVideo}
            setPostFile={setPostFile}
            setPostImg={setPostImg}
            setPostVideo={setPostVideo}
          />
          <div className="cursor-pointer" onClick={handleMediaClick}>
            <Photo width={15} height={15} />
            {/** 컴퓨터에서 사진 받는 input */}
            <input
              type="file"
              accept="image/*, video/*"
              hidden
              multiple
              id="comment-media-input"
              onChange={handleMediaChange}
            />
          </div>
        </div>
        <button
          disabled={!comment.trim()}
          className={`h-fit mt-auto px-6 py-2.5 bg-black text-white rounded-full disabled:bg-mainGray`}
        >
          게시하기
        </button>
      </div>
    </form>
  );
}

export default CommentInput;
