import { useAuth } from "@/contexts/auth.context";
import { useLikeMutation, useRepostMutation } from "@/hooks/usePostMutation";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostTag from "../Tag/PostTag";
import PostImage from "./PostImage";
import PostVideo from "./PostVideo";
import PostReactButton from "./PostReactButton";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  const router = useRouter();
  const { user, userData } = useAuth();

  // tag 배열
  const tags = post.post_tags ? post.post_tags : [];

  // post 날짜
  const postDate = post.created_at.split("T")[0];
  const postTime = post.created_at.split("T")[1].slice(0, 8);

  // post 배열
  const jsonString = JSON.stringify(post.images);
  const images = JSON.parse(jsonString) as string[];
  const isImageType = images && images[0].includes("image");

  const repostReaction = {
    number: post.reposts.length,
    type: "repost",
    byMe: post.isReposted || false,
  };

  const likeReaction = {
    number: post.likes.length,
    type: "like",
    byMe: post.likes.some((like) => like.user_id === user?.id),
  };

  // 포스트 클릭 시
  const handlePostClick = () => {
    router.push(`/${post.user_id}/post/${post.id}`);
  };

  // 프로필 클릭 시
  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    router.push(`/${post.user_id}`);
  };

  // 멘션 누를 시
  const handleCommentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  if (!user) {
    router.push("/login");
  }

  if (!post.user) {
    return <p>loading...</p>;
  }

  return (
    <div
      onClick={handlePostClick}
      className={`flex flex-col w-full px-6 ${
        post.isReposted ? "pt-1 pb-4" : "py-4"
      }  cursor-pointer bg-gray-200 hover:bg-gray-100`}
    >
      {post.isReposted && (
        <p className="text-sm ml-16 text-gray-400">
          {post.reposted_by === "" || post.reposted_by === userData?.nickname
            ? "재게시했습니다"
            : `${post.reposted_by} 님이 리트윗 함`}
        </p>
      )}
      <div className="flex">
        <div className="relative w-[46px] h-[46px] aspect-square rounded-full">
          <Image
            fill
            src={post.user.profile_url}
            alt="profile"
            objectFit="cover"
            className="absolute rounded-full max-h-[46px]"
            onClick={handleProfileClick}
          />
        </div>

        <div className="ml-6 w-full">
          <div className="flex items-center">
            <p className="font-semibold">{post.user.nickname}</p>
            <p className="ml-1.5 text-sm text-gray-500">{post.user.handle}</p>
            {/* <p>{postDate.split("-").join("/")}</p> */}
          </div>
          <p className="mt-[7px] mb-[6px] leading-snug">{post.content}</p>
          {/* 미디어 */}
          {images && (
            // TODO: image 비율에 관해 물어보고 css 적용하기
            <div className="flex w-full h-[300px] overflow-hidden bg-[#6C6C6C] rounded-2xl">
              {isImageType ? (
                <PostImage images={images} />
              ) : (
                <PostVideo images={images} />
              )}
            </div>
          )}
          {/* 태그 */}
          {tags.length !== 0 && <PostTag tagList={tags} />}
          <div className="flex gap-6 mt-[7px] items-center">
            {/* 댓글 */}
            <div className="flex">
              <button
                onClick={handleCommentClick}
                className="flex rounded-full p-1 hover:bg-gray-300"
              >
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
            <PostReactButton
              postId={post.id}
              userId={user?.id}
              reaction={repostReaction}
            />
            {/* 하트 */}
            <PostReactButton
              postId={post.id}
              userId={user?.id}
              reaction={likeReaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
