import { useAuth } from "@/contexts/auth.context";
import { useNotificationStore } from "@/stores/notification.store";
import supabase from "@/supabase/client";
import { useEffect } from "react";

export const useNotifications = () => {
  const { user } = useAuth();
  const { putNotiCount } = useNotificationStore();

  useEffect(() => {
    const isNotiExist = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user?.id)
          .eq("is_read", false)
          .single();
        if (data) {
          console.log(data);
          putNotiCount(true);
        }
      }
    };

    isNotiExist();
  }, [user]);

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel(`${user.id}'s notification`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            putNotiCount(true);
            console.log(`${user.id}에게 반응함 : `, payload.new);
          }
        )
        .subscribe((state) => {
          // console.log("구독상태: ", state);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
};
