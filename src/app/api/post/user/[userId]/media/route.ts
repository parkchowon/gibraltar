import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page"));
  const userId = params.userId;

  try {
    const start = (page - 1) * POST_SIZE;
    const end = page * POST_SIZE - 1;
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
      )
      .eq("user_id", userId)
      .not("images", "is", null)
      .is("parent_post_id", null)
      .range(start, end)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const postsId = data ? data.map((item) => item.id) : [];

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postsId);
    if (commentError) throw new Error(commentError.message);

    const enrichedPosts = data?.map((post) => {
      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: false,
        reposted_by: userId,
        timeline_at: post.created_at,
        comments: postComments,
      };
    });

    return NextResponse.json(enrichedPosts || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
