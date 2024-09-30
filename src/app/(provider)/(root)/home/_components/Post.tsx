import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PostTag from "./PostTag";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  const { setIsModalOpen, setModal } = usePostStore();
  const router = useRouter();
  const [heartClick, setHeartClick] = useState<boolean>(false);
  const [repostClick, setRepostClick] = useState<boolean>(false);
  const tags = post.post_tags ? post.post_tags : [];

  // 포스트 클릭 시
  const handlePostClick = () => {
    router.push(`/${post.user_id}/post/${post.id}`);
  };

  // 프로필 클릭 시
  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    router.push(`/${post.user_id}`);
    console.log("프로필 클릭");
  };

  // 하트와 재게시 누를 시
  const handleReactClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string,
    tag: string
  ) => {
    e.stopPropagation();
    // 마음 누를 시 로직
    if (tag === "heart") {
      setHeartClick(!heartClick);
    } else {
      // 재게시버튼 누를 시
      setIsModalOpen();
      const currentBtn = e.currentTarget.getBoundingClientRect();
      setModal({
        postId: postId,
        top: currentBtn.top,
        left: currentBtn.left,
      });
    }
  };

  if (!post.user) {
    return (
      <div className="w-[736px] min-h-[209px] px-[25px] py-7 rounded-[30px]  bg-gray-200">
        <div className="w-[46px] h-[46px] rounded-full bg-white" />
        <div>
          <p className="w-25 bg-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handlePostClick}
      className="flex w-full px-[50px] py-[15px] cursor-pointer bg-gray-200 hover:brightness-[102%]"
    >
      <Image
        width={46}
        height={46}
        src={post.user.profile_url}
        alt="profile"
        objectFit="cover"
        className="rounded-full max-h-[46px]"
        onClick={handleProfileClick}
      />
      <div className="ml-6">
        <div className="flex items-center">
          <p className="font-semibold">{post.user.nickname}</p>
          <p className="ml-1.5 text-sm text-gray-500">{post.user.handle}</p>
        </div>
        <p className="mt-[9px] mb-[6px] leading-snug">{post.content}</p>
        {tags && <PostTag tagList={tags} />}
        <div className="flex gap-6 mt-3">
          {/* 댓글 */}
          <button className="flex rounded-full p-1 hover:bg-gray-300">
            <Image
              alt="icon"
              width={18}
              height={18}
              src={"/icons/post_chat.svg"}
            />
            <p>{}</p>
          </button>
          {/* 재게시 */}
          <div className="relative">
            <button
              onClick={(e) => handleReactClick(e, post.id, "repost")}
              className="flex rounded-full p-1 hover:bg-gray-300"
            >
              <Image
                alt="icon"
                width={18}
                height={18}
                src={`/icons/post_repeat${repostClick ? "_click" : ""}.svg`}
              />
              <p>{}</p>
            </button>
          </div>
          {/* 하트 */}
          <button
            className="flex rounded-full p-1 hover:bg-gray-300"
            onClick={(e) => handleReactClick(e, post.id, "heart")}
          >
            <Image
              alt="icon"
              width={18}
              height={18}
              src={
                heartClick
                  ? "/icons/post_heart_fill.svg"
                  : "/icons/post_heart_line.svg"
              }
            />
            <p>{}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
