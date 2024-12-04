import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest) => {
  const supabase = createClient();
  const data = await request.formData();
  const profileURL = data.get("profile_url") as File;
  const userId = data.get("user_id") as string;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("profile_url")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // profile이 이미 있으면, 원래있던 storage에 있는 image를 삭제
    if (data) {
      const isExist = data.profile_url.includes(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string
      );
      if (isExist) {
        const oldProfile = data.profile_url.split("/").pop();
        await supabase.storage
          .from("profile-images")
          .remove([`${userId}/${oldProfile}`]);
      }
    }

    const filePath = `${userId}/${Date.now()}_${profileURL.name}`;
    const { data: saveStorageData, error: saveStorageError } =
      await supabase.storage
        .from("profile-images")
        .upload(filePath, profileURL);
    if (saveStorageError) {
      throw new Error(saveStorageError.message);
    }
    const profileUrl = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath).data.publicUrl;
    return NextResponse.json({
      message: "storage에 프로필 업데이트 성공",
      urls: profileUrl,
    });
  } catch (error) {
    return NextResponse.json({ message: "실패" }, { status: 500 });
  }
};
