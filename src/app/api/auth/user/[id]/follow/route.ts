import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const supabase = createClient();
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ message: "userId가 없음" }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from("followers")
      .select("*")
      .or(`following_id.eq.${userId}, follower_id.eq.${userId}`);

    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
