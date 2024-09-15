import supabase from "@/supabase/client";

export const getUser = async(userId: string)=>{
  const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
  
          return data;
}