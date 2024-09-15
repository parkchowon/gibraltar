"use client";

import { getPost } from "@/apis/post.api";
import { PostsType, UserDataProps } from "@/types/home.type";
import { useEffect, useState } from "react";
import Post from "./Post";

function TimeLine({ userData }: UserDataProps) {
  const [posts, setPosts] = useState<PostsType>([]);
  const getMyPost = async () => {
    if (userData) {
      const post = await getPost(userData.id);
      setPosts(post);
    }
  };

  useEffect(() => {
    getMyPost();
  }, [userData]);

  return (
    <div className="flex flex-col gap-y-10">
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}

export default TimeLine;
