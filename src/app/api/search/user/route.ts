import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const pageParams = Number(searchParams.get("page-params") as string);
  const searchText = searchParams.get("text") as string;

  try {
    const start = (pageParams - 1) * POST_SIZE;
    const end = pageParams * POST_SIZE - 1;

    const { data, error } = await supabase
      .from("users")
      .select("id, profile_url, nickname, handle, user_profiles(bio)")
      .range(start, end)
      .or(`nickname.ilike.%${searchText}%, handle.ilike.%${searchText}%`);

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
