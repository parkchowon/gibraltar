import supabase from "@/supabase/client";

export const getNotification = async (userId: string | undefined) => {
  try {
    if (!userId) return [];
    // const { data: notiData, error: notiError } = await supabase
    //   .from("notifications")
    //   .select(
    //     `*,
    //     reacted_user:users!reacted_user_id(nickname, profile_url),
    //     related_post:posts!related_post_id(content)`
    //   )
    //   .eq("user_id", userId);

    // if (notiError) throw new Error(notiError.message);
    // return notiData;
    const { data, error } = await supabase.rpc(
      "get_notifications_with_details",
      {
        p_user_id: userId,
      }
    );

    console.log(data);
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
