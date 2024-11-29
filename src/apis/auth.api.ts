import supabase from "@/supabase/client";

export const getUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId) // 이부분 handle로
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getFollower = async (userId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .select("*")
    .or(`following_id.eq.${userId}, follower_id.eq.${userId}`);
  if (error) {
    return console.error(error);
  }
  return data;
};

export const getPostCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) {
    return console.error(error);
  }
  return count || 0;
};

export const findDuplicateHandle = async (handle: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("handle", `@${handle}`)
    .single();
  if (error) {
    console.error(error);
  }
  return !!data;
};

type profileProps = {
  nickname?: string;
  handle: string;
  file?: File;
  userId: string;
};

export const profileUpdate = async ({
  nickname,
  handle,
  file,
  userId,
}: profileProps) => {
  let profileUrl = null;

  const { data, error } = await supabase
    .from("users")
    .select("profile_url")
    .eq("id", userId)
    .single();
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

  if (file) {
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const { data: saveStorageData, error: saveStorageError } =
      await supabase.storage.from("profile-images").upload(filePath, file);
    if (saveStorageError) {
      console.error(saveStorageError);
      return;
    }
    profileUrl = supabase.storage.from("profile-images").getPublicUrl(filePath)
      .data.publicUrl;
  }

  const { data: updateData, error: updateError } = await supabase
    .from("users")
    .update({
      profile_url: profileUrl || undefined,
      nickname: nickname || undefined,
      handle: handle,
    })
    .eq("id", userId);

  if (updateError) {
    console.error(updateError);
  }
};

export const userStatusUpdate = async (userId: string, status: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({ status: status })
    .eq("id", userId);
  if (error) {
    console.error(error);
  }
};
