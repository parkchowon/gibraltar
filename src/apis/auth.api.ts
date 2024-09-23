import supabase from "@/supabase/client";

export const getUser = async(userId: string)=>{
  const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
  
          return data;
}

export const getFollower = async(userId: string)=>{
  const { data } = await supabase.from("followers").select("*").or(`following_id.eq.${userId}, follower_id.eq.${userId}`)
  
  return data;
}