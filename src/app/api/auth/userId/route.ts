import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get("handle") as string;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("handle", handle)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json(data.id);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
