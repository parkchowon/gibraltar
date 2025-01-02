import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  reqeust: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const supabase = createClient();
  const handle = params.userId;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, profile_url, nickname, handle, user_profiles(bio)")
      .like("handle", `%${handle}%`)
      .limit(5);

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
