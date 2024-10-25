import { useAuth } from "@/contexts/auth.context";
import { useLikeMutation, useRepostMutation } from "@/hooks/usePostMutation";
import { usePostStore } from "@/stores/post.store";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostTag from "../Tag/PostTag";

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

  const jsonString = JSON.stringify(post.images);
  const images = JSON.parse(jsonString) as string[];
  const isImageType = images && images[0].includes("image");

  // repost, like 낙관적 업데이트
  const { mutate: repostMutate } = useRepostMutation(post.id);
  const { mutate: likeMutate } = useLikeMutation();

  // 이미 내가 클릭한 repost, heart 표시
  useEffect(() => {
    if (isInitialized && user) {
      post.reposts?.map((repost) => {
        if (repost.reposted_by === user.id) {
          setRepostClick(true);
        }
      });
      post.likes?.map((like) => {
        if (like.user_id === user.id) {
          setHeartClick(true);
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
  };

  // 멘션 누를 시
  const handleCommentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
      if (!heartClick) {
        setHeartClick(true);
        return likeMutate({ postId, userId: user?.id });
      } else {
        setHeartClick(false);
        return likeMutate({ postId, state: false });
      }
    } else {
      // 재게시버튼 누를 시
      if (repostClick) {
        setRepostClick(false);
        return repostMutate();
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
    return <p>loading...</p>;
  }

  return (
    <div
      onClick={handlePostClick}
      className="flex w-full px-[50px] py-[15px] cursor-pointer hover:bg-gray-100"
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
      <div className="ml-6 w-full">
        <div className="flex items-center">
          <p className="font-semibold">{post.user.nickname}</p>
          <p className="ml-1.5 text-sm text-gray-500">{post.user.handle}</p>
        </div>
        <p className="mt-[9px] mb-[6px] leading-snug">{post.content}</p>
        {/* TODO: image나 video 컴포넌트로 관리해서 코드 가독성 높이기 */}
        {images && (
          // TODO: image 비율에 관해 물어보고 css 적용하기
          <div className="flex w-full h-[300px] overflow-hidden bg-[#6C6C6C] rounded-2xl">
            {isImageType
              ? images.map((image) => {
                  return (
                    <div
                      key={image}
                      className="relative w-full h-full max-h-full"
                    >
                      <Image
                        src={image}
                        alt="image"
                        fill
                        className="absolute object-contain inset-0"
                      />
                    </div>
                  );
                })
              : images.map((image) => {
                  return (
                    <div
                      key={image}
                      className="relative w-full h-full max-h-full"
                    >
                      <video controls className="w-full h-full">
                        <source src={image} type="video/mp4" />
                        해당 브라우저는 비디오를 지원하지 않습니다.
                      </video>
                    </div>
                  );
                })}
          </div>
        )}
        {tags && <PostTag tagList={tags} />}
        <div className="flex gap-6 mt-3 items-center">
          {/* TODO: map으로 컴포넌트 돌려서 코드 간결성 높이기 */}
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
                src={`/icons/post_heart_${heartClick ? "fill" : "line"}.svg`}
              />
            </button>
            <p className={`${heartClick ? "text-warning" : "text-black"}`}>
              {post.likes?.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
