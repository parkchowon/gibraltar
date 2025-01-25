import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const postId = params.id;
  const userId = searchParams.get("user_id") as string;
  const repostId = searchParams.get("repost_id") as string;
  const stringIsQuoted = searchParams.get("is_quoted");
  const isQuoted = stringIsQuoted === "true" ? true : false;

  if (!postId || !userId) {
    return NextResponse.json(
      { message: `${postId ? "user id" : "post id"}가 존재하지 않음` },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.from("reposts").insert({
      post_id: postId,
      reposted_by: userId,
      reposted_post_id: repostId || null,
      is_quoted: isQuoted,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "repost 저장 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "repost 저장 중 오류", error },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;

  const postId = params.id;
  const userId = searchParams.get("user_id") as string;

  if (!postId || !userId) {
    return NextResponse.json(
      { message: `${postId ? "user id" : "post id"}가 존재하지 않음` },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("reposts")
      .delete()
      .eq("post_id", postId)
      .eq("reposted_by", userId);

    if (error) {
      return NextResponse.json(
        { message: "repost 삭제 중 오류" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "repost 저장 성공" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "repost 삭제 중 오류", error },
      { status: 500 }
    );
  }
};
