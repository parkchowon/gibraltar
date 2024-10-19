"use client";

import { getPost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import { useEffect, useRef } from "react";

function TimeLine() {
  const { userData } = useAuth();
  const loadMoreRef = useRef(null)

  const { isPending, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: userData ? ["timelineData", userData.id] : ["timelineData"],
    queryFn: ({ pageParam = 1 }) => {
      if (userData) {
        return getPost(userData.id, pageParam);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if(!lastPage || lastPage.length === 0){
        return undefined;
      }

      return allPages.length+1;
    },
    refetchInterval: 10000,
    initialPageParam: 1,
  }
  );

  // observer로 스크롤 감지
  useEffect(()=>{
    const observer = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && hasNextPage && !isFetchingNextPage){
        fetchNextPage()
      }
    },{threshold: 1.0});
    
    if(loadMoreRef.current){
      observer.observe(loadMoreRef.current);
    }

    return ()=>{
      if(loadMoreRef.current){
        observer.unobserve(loadMoreRef.current)
      }
    }
  },[fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="flex flex-col h-fit pt-[77px] divide-y-2 divide-gray-300 bg-gray-200">
      {data &&
        data.pages.map((page) => (
          page?.map((post)=>{
            return <Post key={post.id} post={post}/>
          })
        ))}
                {isPending && <p>loading...</p>}
        <div ref={loadMoreRef} style={{height: '20px'}} />
    </div>
  );
}

export default TimeLine;
