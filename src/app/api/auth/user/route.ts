import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (reqeust: NextRequest) => {
  const supabase = createClient();
  const searchParams = reqeust.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;

  if (!userId)
    return NextResponse.json({ message: "userId가 없음" }, { status: 400 });
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
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
