import { createClient } from "@/supabase/server";
import { TagRow } from "@/types/database";
import { NextRequest, NextResponse } from "next/server";

/** post 하나 */

// 생성
export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const { content, images, user_id, parent_post_id, quoted_post_id, tags } =
    await request.json();
  try {
    // posts 테이블에 저장
    const { data, error } = await supabase
      .from("posts")
      .insert({
        content,
        images: images || null,
        user_id,
        parent_post_id,
        quoted_post_id,
      })
      .select()
      .single();

    if (error) throw new Error("post 저장 중 오류 : " + error.message);

    // 태그가 있을 시 post_tags 테이블에 저장
    if (tags.length !== 0 && data) {
      const postTagTableRow = (tags as TagRow[]).map((tag) => ({
        post_id: data.id,
        tag_id: tag.id,
      }));
      const { data: tagData, error: tagError } = await supabase
        .from("post_tags")
        .insert(postTagTableRow);
      if (tagError) throw new Error("tag 저장 중 오류 : " + tagError.message);
    }

    return NextResponse.json({ message: "post 저장 성공", postId: data.id });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
