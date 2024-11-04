import supabase from "@/supabase/client";

export const getNotification = (userId: string) => {
  const channel = supabase
    .channel("notification")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("내 글에 반응함 : ", payload);
      }
    )
    .subscribe((state) => {
      // console.log("구독상태: ", state);
    });
  return () => {
    supabase.removeChannel(channel);
  };
};

const getLikeNoti = () => {};
