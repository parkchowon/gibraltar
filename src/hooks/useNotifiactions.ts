import { useAuth } from "@/contexts/auth.context";
import supabase from "@/supabase/client";
import { useEffect } from "react";

export const useNotifications = ()=>{
  const {user} = useAuth()
    useEffect(()=>{
      if(user){

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
    }, [user])
  }