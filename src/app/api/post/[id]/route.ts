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
  try {
    const { data: imgData, error: imgError } = await supabase
      .from("posts")
      .select("images")
      .eq("id", postId)
      .single();
    if (imgError) throw new Error(imgError.message);

    if (imgData && imgData.images) {
      const paths = (imgData.images as string[]).map(
        (path) => path.split("/posts/")[1]
      );
      const results = await Promise.all(
        paths.map(async (path) => {
          const { error } = await supabase.storage.from("posts").remove([path]);
          if (error) throw new Error("스토리지에 사진 삭제 중 오류");
        })
      );
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId);

    const { error: quoteError } = await supabase
      .from("reposts")
      .delete()
      .eq("reposted_by", userId)
      .eq("reposted_post_id", postId)
      .eq("is_quoted", true);

    if (quoteError) {
      return NextResponse.json(
        { message: "삭제 업데이트 중 서버 오류", quoteError },
        { status: 500 }
      );
    }
    if (error && error.code === "23503") {
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

      return NextResponse.json(
        { message: "삭제 업데이트 성공", data },
        { status: 200 }
      );
    }

    if (error && error.code !== "23503") {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "post 삭제 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
