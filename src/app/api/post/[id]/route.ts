import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// [id]의 post 가져오기
export const GET = async (
  reqeust: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const postId = params.id;

  if (!postId) {
    return NextResponse.json(
      { message: "post id가 존재하지 않음" },
      { status: 400 }
    );
  }

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

// [id]의 post 삭제
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const postId = params.id;
  const userId = request.nextUrl.searchParams.get("userId");

  if (!postId || !userId) {
    return NextResponse.json(
      { message: "post id나 user id가 존재하지 않음" },
      { status: 400 }
    );
  }

  // // TODO: 외부키로 참조되고 있는 post id의 오류를 어떻게 해결할 것인가
  // const { data, error: parentsError } = await supabase
  //   .from("posts")
  //   .select("*")
  //   .eq("parent_post_id", postId);

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId);

  if (error?.code === "23503") {
    console.log(postId, "인 포스터를 소프트 삭제");
    const { data, error: updateError } = await supabase
      .from("posts")
      .update({ is_deleted: true })
      .eq("id", postId);

    if (updateError) {
      return NextResponse.json(
        { message: "삭제 업데이트 중 서버 오류", updateError },
        { status: 500 }
      );
    }

    console.log(data);
    return NextResponse.json(
      { message: "삭제 업데이트 성공", data },
      { status: 200 }
    );
  }

  if (error && error.code !== "23503") {
    return NextResponse.json(
      { message: "삭제하는 도중 서버 오류", error },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "post 삭제 성공" }, { status: 200 });
};
