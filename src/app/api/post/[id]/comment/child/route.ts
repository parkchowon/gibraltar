import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const postId = params.id;

  try {
    //가장 상단에 있는 post에 대한 comment 리스트들
    const { data: comments, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (post_id, user_id)"
      )
      .eq("parent_post_id", postId);

    if (error) {
      throw new Error(error.message);
    }
    const commentsId = comments ? comments.map((item) => item.id) : [];

    const { data: childComments, error: childCommentsError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", commentsId);

    if (childCommentsError) {
      throw new Error(childCommentsError.message);
    }

    const enrichedComments = comments?.map((comment) => {
      const commentchildComments = childComments?.filter(
        (childComment) => childComment.parent_post_id === comment.id
      );

      return {
        ...comment,
        isReposted: false,
        reposted_by: null,
        timeline_at: comment.created_at,
        comments: commentchildComments || [],
      };
    });

    return NextResponse.json(enrichedComments || []);
  } catch (error) {
    return NextResponse.json(
      { "server 오류로 인한 실패": error },
      { status: 500 }
    );
  }
};
