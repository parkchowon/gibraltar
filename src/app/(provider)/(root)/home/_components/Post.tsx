import { deleteRepost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostTag from "./PostTag";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  const { setIsModalOpen, setModal } = usePostStore();
  const router = useRouter();
  const { isInitialized, user } = useAuth();
  const [heartClick, setHeartClick] = useState<boolean>(false);
  const [repostClick, setRepostClick] = useState<boolean>(false);
  const tags = post.post_tags ? post.post_tags : [];

  useEffect(() => {
    if (isInitialized && user) {
      post.reposts?.map((repost) => {
        if (repost.reposted_by === user.id) {
          setRepostClick(true);
        }
      });
    }
  }, [post]);

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
      if (repostClick) {
        setRepostClick(false);
        return deleteRepost(post.id);
      }
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
        <div className="flex gap-6 mt-3 items-center">
          {/* 댓글 */}
          <div className="flex">
            <button className="flex rounded-full p-1 hover:bg-gray-300">
              <Image
                alt="icon"
                width={18}
                height={18}
                src={"/icons/post_chat.svg"}
              />
            </button>
            <p>{post.comments?.length}</p>
          </div>
          {/* 재게시 */}
          <div className="relative flex">
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
            </button>
            <p className={`${repostClick ? "text-mint" : "text-black"}`}>
              {post.reposts?.length}
            </p>
          </div>
          {/* 하트 */}
          <div className="flex">
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
            </button>
            <p>{post.likes?.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
