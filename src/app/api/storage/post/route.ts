import { createClient } from "@/supabase/server";
import { generateFilePathWithUnicode } from "@/utils/formatChange";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const data = await request.formData();
  const files = data.getAll("images") as File[];
  const userId = data.get("user_id");

  try {
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "no files" }, { status: 400 });
    }

    let postMediaURLs = [];

    for (const file of files) {
      const type = file.type.startsWith("video/") ? "video" : "image";
      const fileName = generateFilePathWithUnicode(file.name);
      const filePath = `${userId}/${type}/${Date.now()}_${fileName}`;

      const { data, error } = await supabase.storage
        .from("posts")
        .upload(filePath, file);

      if (error) {
        throw new Error(error.name + error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath);

      postMediaURLs.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      urls: postMediaURLs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" + error },
      { status: 500 }
    );
  }
};
