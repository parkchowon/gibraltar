import supabase from "@/supabase/client";
import { PostType } from "@/types/database";

export const createPost = async(post:PostType) =>{
  const {data, error} = await supabase.from('posts').upsert([post]).select()
  if(error){
    console.error('포스팅 저장 실패: ',error.message)
  }
  console.log("포스팅 저장 성공",data)
}

export const getPost = async(userId: string)=> {
  const {data:followings, error:followingError} = await supabase.from('followers').select('following_id').eq('follower_id', userId);
  const followingId = followings?.map(item=>item.following_id);
  const followerList = followingId ? [userId, ...followingId]: [userId];
  const {data:posts, error:myError} = await supabase.from('posts').select('*, user:users (nickname, profile_url)').in('user_id', followerList);
  if(myError){
    console.error('로그인 유저의 포스팅 불러오는 중 에러: ',myError)
  }
  if(followingError){
    console.error('팔로잉 목록 불러오는 중 에러:',followingError);
  }

  return posts;
}

export const getUserPost = async(userId: string)=>{
  const { data, error }= await supabase.from("posts").select("*, user:users (nickname, profile_url)").eq("user_id", userId)
  if(error){
    console.error('post 불러오는 중 오류')
  }
  return data;
}