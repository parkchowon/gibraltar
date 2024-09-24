import { PostType } from "@/types/home.type";
import Post from "../../home/_components/Post";

function UserPost({ posts }: { posts: PostType[] | undefined | null }) {
  return (
    <div className="flex flex-col h-fit divide-y-2 divide-gray-300">
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}

export default UserPost;
