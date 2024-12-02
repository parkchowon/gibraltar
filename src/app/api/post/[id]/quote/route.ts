import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const postId = params.id;
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "user: users (id, nickname, handle, profile_url), content, images, created_at, is_deleted"
      )
      .eq("id", postId)
      .single();
    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
