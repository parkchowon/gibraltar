import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// [id]의 post 가져오기
export const GET = async (
  reqeust: NextRequest,
  { params }: { params: { id: string } }
) => {
  const postId = params.id;
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .eq("id", postId)
      .single();

    if (error) throw new Error(error.message);

    const { data: commentData, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .eq("parent_post_id", postId);

    if (commentError) throw new Error(commentError.message);

    const result = {
      ...data,
      isReposted: false,
      reposted_by: "",
      timeline_at: data ? data.created_at : "",
      comments: commentData || [],
    };

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { message: "post가 존재하지 않음" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "post 불러오는 중 서버 오류", error },
      { status: 500 }
    );
  }
};
