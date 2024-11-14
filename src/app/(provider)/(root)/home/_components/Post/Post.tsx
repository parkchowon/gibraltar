import { useAuth } from "@/contexts/auth.context";
import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PostTag from "../Tag/PostTag";
import PostMedia from "./PostMedia";
import PostReactButton from "./PostReactButton";
import PostLoading from "@/components/Loading/PostLoading";
import { useState } from "react";
import PostCommentModal from "./PostCommentModal";
import ProfileBtn from "@/components/ProfileBtn";
import { formatToPostDate } from "@/utils/dateFormatter";
import PostQuote from "./PostQuote";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  const router = useRouter();
  const { user, userData } = useAuth();

  // comment modal 여닫기
  const [commentClick, setCommentClick] = useState<boolean>(false);

  // tag 배열
  const tags = post.post_tags ? post.post_tags : [];

  // post 날짜
  const postTime = formatToPostDate(post.created_at);

  const repostedByMe = post.reposts.find(
    (post) => post.reposted_by === user?.id
  );
  const isQuotedByMe = repostedByMe?.is_quoted;

  // repost 클릭 data
  const repostReaction = {
    number: post.reposts.length,
    type: "repost",
    byMe:
      (post.isReposted && post.reposted_by === "") ||
      (!!repostedByMe && !isQuotedByMe) ||
      false,
  };

  // like 클릭 data
  const likeReaction = {
    number: post.likes.length,
    type: "like",
    byMe: post.likes.some((like) => like.user_id === user?.id),
  };

  // 포스트 클릭 시
  const handlePostClick = () => {
    router.push(`/${post.user_id}/post/${post.id}`);
  };

  // 멘션 누를 시
  const handleCommentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCommentClick(true);
  };

  if (!user) {
    router.push("/login");
  }

  if (!post.user) {
    return <PostLoading />;
  }

  return (
    <>
      {commentClick && (
        <PostCommentModal post={post} setCommentClick={setCommentClick} />
      )}
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
              : `${post.reposted_by} 님이 재게시 함`}
          </p>
        )}
        <div className="flex">
          <ProfileBtn
            profileUrl={post.user.profile_url}
            userId={post.user.id}
          />
          <div className="ml-6 w-full">
            <div className="flex items-center">
              <p className="font-semibold">{post.user.nickname}</p>
              <p className="ml-1.5 text-sm text-gray-500">{post.user.handle}</p>
              <p className="text-sm text-gray-500 ml-1.5">{postTime}</p>
            </div>
            <p className="mt-[7px] mb-[6px] leading-snug">{post.content}</p>
            {/* 미디어 */}
            {post.images && (
              // TODO: image (아직 화면이 없음)
              <div className="flex w-full h-[300px] overflow-hidden bg-[#6C6C6C] rounded-2xl">
                <PostMedia jsons={post.images} />
              </div>
            )}
            {/* 인용한 트윗 */}
            {post.quoted_post_id && <PostQuote postId={post.quoted_post_id} />}
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
                post={post}
                userId={user?.id}
                reaction={repostReaction}
              />
              {/* 하트 */}
              <PostReactButton
                post={post}
                userId={user?.id}
                reaction={likeReaction}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
