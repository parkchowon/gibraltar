import { getUserPost } from "@/apis/post.api";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Post from "../../home/_components/Post";

function UserPost() {
  const pathname = usePathname();
  const userId = pathname.replace("/", "");
  const { isPending, data: posts } = useQuery({
    queryKey: ["userPost", userId],
    queryFn: () => {
      return getUserPost(userId);
    },
  });

  if (isPending) return <p>loading...</p>;

  return (
    <div className="flex flex-col h-fit pt-[77px] divide-y-2 divide-gray-300">
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}

export default UserPost;
