import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { handle: string } }
) => {
  const supabase = createClient();
  const handle = params.handle;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("handle", handle)
      .single();
    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }
    return NextResponse.json(data?.id);
  } catch (error) {
    return NextResponse.json(
      { message: "서버로 인한 오류", error },
      { status: 500 }
    );
  }
};
