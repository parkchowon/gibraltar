import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const postId = params.id;
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;

  if (!postId || !userId) {
    return NextResponse.json(
      { message: `${postId ? "user id" : "post id"}가 존재하지 않음` },
      { status: 400 }
    );
  }

  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId });

    if (error) {
      throw new Error(error?.message);
    }
    return NextResponse.json(
      { message: "likes 테이블에 저장 성공" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const postId = params.id;
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;

  try {
    const { data, error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error?.message);
    }
    return NextResponse.json(
      { message: "likes 테이블에 저장 성공" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
