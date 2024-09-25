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

export const findDuplicateHandle = async(handle: string)=>{
  const {data, error} = await supabase.from('users').select('*').eq('handle', `@${handle}`).single();
  if(error){
    console.error(error)
  }
 return !!data;
}

type profileProps= {
nickname?: string;
handle: string;
file?: File;
userId: string;
}

export const profileUpdate = async ({nickname, handle, file, userId}: profileProps) =>{
  let profileUrl = null;

  if(file){
    const fileName = `${Date.now()}_${file.name}`;
    const {data, error} = await supabase.storage.from('profile-images').upload(fileName, file);
    if(error){
      console.error(error)
      return;
    }
    profileUrl = supabase.storage.from('profile-images').getPublicUrl(fileName).data.publicUrl;
  }

  const {data, error} = await supabase.from('users').update({
    profile_url: profileUrl || undefined,
    nickname: nickname || undefined,
    handle: handle
  }).eq('id',userId)

  if(error){
    console.error(error)
  }
}