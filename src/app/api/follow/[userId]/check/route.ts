import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const followerId = params.userId as string;
  const followingId = request.nextUrl.searchParams.get(
    "following-id"
  ) as string;
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return NextResponse.json(!!data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
