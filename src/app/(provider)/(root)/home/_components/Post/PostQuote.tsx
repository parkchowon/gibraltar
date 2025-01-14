import ProfileBtn from "@/components/ProfileBtn";
import React from "react";
import PostMedia from "./PostMedia";
import { usePostStore } from "@/stores/post.store";
import { useQuery } from "@tanstack/react-query";
import { fetchQuotePost } from "@/apis/post.api";
import { useRouter } from "next/navigation";
import { QuoteType } from "@/types/home.type";
import QuoteLoading from "@/components/Loading/QuoteLoading";

function PostQuote({ postId }: { postId?: string }) {
  const { quotedPost } = usePostStore();
  const router = useRouter();

  const { data, isPending } = useQuery<QuoteType>({
    queryKey: ["quotePost", postId],
    queryFn: () => {
      if (postId) {
        return fetchQuotePost(postId);
      }
      return null;
    },
  });

  const quote = data ? data : quotedPost;

  const handleQuoteClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (data && data.user && !quote?.is_deleted) {
      router.push(`/${data.user.handle}/post/${postId}`);
    }
  };

  if (!quote || isPending) return <QuoteLoading />;

  return (
    <div
      onClick={handleQuoteClick}
      className={`w-full h-fit px-6 py-4 border border-mainGray rounded-3xl bg-white ${
        data && "cursor-pointer"
      }`}
    >
      {quote.is_deleted ? (
        <p>이 포스트는 삭제되었습니다.</p>
      ) : (
        <>
          <div className="flex w-full gap-1.5 items-center">
            <ProfileBtn
              profileUrl={quote.user ? quote.user?.profile_url : ""}
              type="non-click"
              intent="miniQuote"
            />
            <p className="font-semibold ml-2">{quote.user?.nickname}</p>
            <p className="text-sm text-mainGray">{quote.user?.handle}</p>
          </div>
          <div>
            <p className="mt-[7px] mb-[6px] leading-snug">{quote.content}</p>
            {quote.images && (
              <div className="flex w-full h-[300px] overflow-hidden bg-subGray rounded-2xl">
                <PostMedia jsons={quote.images} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PostQuote;
