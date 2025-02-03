import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const searchParams = request.nextUrl.searchParams;

  const supabase = createClient();
  const userId = params.userId;
  const pageParams = Number(searchParams.get("page-params") as string);
  const { searchText } = await request.json();

  try {
    const start = (pageParams - 1) * POST_SIZE;
    const end = pageParams * POST_SIZE - 1;

    let query = supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      );

    // tag 검색 서치
    const { data: tagId, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("tag_name", searchText)
      .single();
    if (tagError && tagError.code !== "PGRST116") {
      throw new Error(tagError.message);
    }

    if (tagId) {
      const { data: postTagData, error: postTagError } = await supabase
        .from("post_tags")
        .select("post_id")
        .eq("tag_id", tagId.id);
      if (postTagError && postTagError.code !== "PGRST116") {
        throw new Error(postTagError.message);
      }

      if (postTagData) {
        const postId = postTagData.map((post) => post.post_id);
        query.or(`content.ilike.%${searchText}%,id.in.(${postId.join(",")})`);
      }
    } else {
      query.ilike("content", `%${searchText}%`);
    }

    const { data, error } = await query
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const postIds = data ? data.map((post) => post.id) : [];
    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postIds);
    if (commentError) throw new Error(commentError.message);

    const post = data.map((post) => {
      const repostedCheck = post.reposts.find(
        (repost) => repost.reposted_by === userId
      );

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );
      return {
        ...post,
        isReposted: !!repostedCheck,
        reposted_by: null,
        timeline_at: post.created_at,
        comments: postComments,
      };
    });
    return NextResponse.json(post, {
      headers: {
        "Access-Control-Allow-Origin":
          process.env.NEXT_PUBLIC_BASE_URL || "https://gibraltar.vercel.app",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
