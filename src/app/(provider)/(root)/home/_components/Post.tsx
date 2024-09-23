import { PostType } from "@/types/home.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  const router = useRouter();
  const [heartClick, setHeartClick] = useState<boolean>(false);

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

  // 하트 누를 시
  const handleHeartClick = () => {
    setHeartClick(!heartClick);
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
        <p className="font-semibold">{post.user.nickname}</p>
        <p className="mt-[9px] mb-[6px] leading-snug">{post.content}</p>
        <div className="flex gap-6 mt-3">
          <button className="flex rounded-full p-1 hover:bg-gray-300">
            <Image
              alt="icon"
              width={18}
              height={18}
              src={"/icons/post_chat.svg"}
            />
            <p>{}</p>
          </button>
          <button className="flex rounded-full p-1 hover:bg-gray-300">
            <Image
              alt="icon"
              width={18}
              height={18}
              src={"/icons/post_repeat.svg"}
            />
            <p>{}</p>
          </button>
          <button
            className="flex rounded-full p-1 hover:bg-gray-300"
            onClick={handleHeartClick}
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
