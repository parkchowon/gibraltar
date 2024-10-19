import supabase from "@/supabase/client";

export const addFollow = async (userId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .insert({ follower_id: userId, following_id: followingId });
};

export const deleteFollow = async (userId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", userId)
    .eq("following_id", followingId);
};
