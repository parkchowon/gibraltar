import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { sortDataByTime } from "@/utils/sortData";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const queryCursor = searchParams.get("cursor") as string;
  const cursor = queryCursor.split(" ").join("+");
  const userId = params.userId;

  if (!cursor || !userId) {
    return NextResponse.json(
      { message: "cursor나 userId가 존재하지 않습니다." },
      { status: 400 }
    );
  }

  try {
    let repostsQuery = supabase
      .from("reposts")
      .select("post_id, reposted_at, reposted_by, is_quoted")
      .eq("reposted_by", userId)
      .eq("is_quoted", false)
      .order("reposted_at", { ascending: false })
      .limit(POST_SIZE);

    let postsQuery = supabase
      .from("posts")
      .select("id, created_at")
      .eq("user_id", userId)
      .is("parent_post_id", null)
      .order("created_at", { ascending: false })
      .limit(POST_SIZE);

    if (cursor !== "null") {
      postsQuery = postsQuery.lt("created_at", cursor);
      repostsQuery = repostsQuery.lt("reposted_at", cursor);
    }

    const [postsResult, repostsResult] = await Promise.all([
      postsQuery,
      repostsQuery,
    ]);

    if (postsResult.error || repostsResult.error) {
      throw new Error("post와 repost를 불러오는 도중 에러");
    }

    const orderedPost = sortDataByTime({
      reposts: repostsResult.data || [],
      posts: postsResult.data || [],
    });

    const orderedPostId = orderedPost.map((post) => post.id);

    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle, account_type), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
      )
      .is("is_deleted", false)
      .in("id", orderedPostId);

    if (error) throw new Error(error.message);

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", orderedPostId);
    if (commentError) throw new Error(commentError.message);

    const { data: userName, error: userError } = await supabase
      .from("users")
      .select("nickname")
      .eq("id", userId)
      .single();
    if (userError) throw new Error(userError.message);

    const enrichedPosts = data?.map((post) => {
      const postCreatedAt = orderedPost.find((order) => order.id === post.id);
      post.created_at = postCreatedAt
        ? postCreatedAt.created_at
        : post.created_at;
      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: postCreatedAt?.isReposted || false,
        reposted_by: userName.nickname,
        timeline_at: post.created_at,
        comments: postComments,
      };
    });

    enrichedPosts?.sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
    return NextResponse.json(enrichedPosts || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
