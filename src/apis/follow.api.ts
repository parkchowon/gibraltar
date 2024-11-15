import supabase from "@/supabase/client";

export const addFollow = async (userId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .insert({ follower_id: userId, following_id: followingId });

  if (data) {
    console.log("follow 성공");
  }
  if (error) return console.error(error.message);

  const { data: notiData, error: notiError } = await supabase
    .from("notifications")
    .insert({
      reacted_user_id: userId,
      user_id: followingId,
      type: "follow",
      is_read: false,
    });
};

export const deleteFollow = async (userId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", userId)
    .eq("following_id", followingId);

  const { data: notiData, error: notiError } = await supabase
    .from("notifications")
    .delete()
    .eq("type", "follow")
    .eq("reacted_user_id", userId)
    .eq("user_id", followingId);
};

export const checkFollow = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();
  if (error) console.error(error.message);

  return !!data;
};
