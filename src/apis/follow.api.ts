import supabase from "@/supabase/client";

// TODO: follow 로직이 갱신될때 그걸 알아차리는 notification 함수 로직을 전역으로 설계해야됨
// 아니라면 지역적으로 하나하나 추가해야됨..

export const addFollow = async (userId: string, followingId: string) => {
  const { data, error } = await supabase
    .from("followers")
    .insert({ follower_id: userId, following_id: followingId });

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
