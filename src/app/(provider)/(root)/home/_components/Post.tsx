import { PostType } from "@/types/home.type";
import Image from "next/image";

type PostProps = {
  post: PostType;
  key?: string;
};

function Post({ post }: PostProps) {
  if (!post.user) {
    return (
      <div className="w-[736px] min-h-[209px] px-[25px] py-7 rounded-[30px] bg-gray-300">
        <div className="w-[46px] h-[46px] rounded-full bg-white" />
        <div>
          <p className="w-25 bg-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[736px] min-h-[209px] px-[25px] py-7 rounded-[30px] bg-gray-300">
      <Image
        width={46}
        height={46}
        src={post.user.profile_url}
        alt="profile"
        objectFit="cover"
        className="rounded-full max-h-[46px]"
      />
      <div className="ml-6">
        <p className="font-semibold">{post.user.nickname}</p>
        <p className="my-[5px]">{post.content}</p>
      </div>
    </div>
  );
}

export default Post;
