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

  const {data, error} = await supabase.from("users").select("profile_url").eq("id", userId).single();
  if(data){
    const isExist = data.profile_url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL as string) 
    if(isExist){
      const oldProfile = data.profile_url.split('/').pop()
      await supabase.storage.from('profile-images').remove([`${userId}/${oldProfile}`])
    }
  }

  if(file){
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const {data:saveStorageData, error:saveStorageError} = await supabase.storage.from('profile-images').upload(filePath, file);
    if(saveStorageError){
      console.error(saveStorageError)
      return;
    }
    profileUrl = supabase.storage.from('profile-images').getPublicUrl(filePath).data.publicUrl;
  }

  const {data: updateData, error: updateError} = await supabase.from('users').update({
    profile_url: profileUrl || undefined,
    nickname: nickname || undefined,
    handle: handle
  }).eq('id',userId)

  if(updateError){
    console.error(updateError)
  }
}