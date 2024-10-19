import supabase from "@/supabase/client";
import { PostType, TagRow } from "@/types/database";
import { LikesFnType } from "@/types/home.type";

// post를 생성하기
export const createPost = async(post:PostType, tags?: TagRow[]) =>{
  const {data, error} = await supabase.from('posts').upsert([post]).select().single()
  if(error){
    console.error('포스팅 저장 실패: ',error.message)
  }
  console.log("포스팅 저장 성공",data)
  if(tags && data){
    const postTagTableRow = tags.map((tag)=>({
      post_id: data.id,
      tag_id: tag.id
    }))
    const {data: tagData, error: tagError} = await supabase.from('post_tags').insert(postTagTableRow)
    if(tagError){
      console.error(tagError)
    }
  }

}

// 가져올 포스트 수
const POST_SIZE = 10;

// user가 팔로하고 있는 모든 유저의 게시글 불러오기
export const getPost = async(userId: string, page: number)=> {
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;

  // 팔로우 하고 있는 사람들의 목록을 불러옴
  const {data:followings, error:followingError} = await supabase.from('followers').select('following_id').eq('follower_id', userId);
  const followingId = followings?.map(item=>item.following_id);
  const followerList = followingId ? [userId, ...followingId]: [userId];
  
  // 팔로하고 있는 사람들이 쓴 포스트를 start부터 end까지 불러옴
  const {data:posts, error:myError} =  await supabase.from('posts').select('*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))').in('user_id', followerList).is('parent_post_id', null).range(start, end).order('created_at', {ascending: false});
  const postsId = posts ? posts.map(item=>item.id) : [];
  
  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase.from('reposts').select('post_id, comment, reposted_by, reposted_at').in('post_id', postsId),
    supabase.from('likes').select('post_id, user_id').in('post_id', postsId),
    supabase.from('posts').select('*').in('parent_post_id', postsId)
  ])
  const {data:reposts, error:reactsError} =  repostsResult;
  const {data:likes, error:likesError} =  likesResult;
  const {data:comments, error:commentError} =commentsResult;

  
    const enrichedPosts = posts?.map(post => {
      const postReposts = reposts?.filter(repost => repost.post_id === post.id);
      const postLikes = likes?.filter(like => like.post_id === post.id);
      const postComments = comments?.filter(comment => comment.parent_post_id === post.id);
    
      return {
        ...post,
        reposts: postReposts,
        likes: postLikes,
        comments: postComments
      };
    });
  

  if(myError){
    console.error('로그인 유저의 포스팅 불러오는 중 에러: ',myError)
  }
  if(followingError){
    console.error('팔로잉 목록 불러오는 중 에러:',followingError);
  }

  return enrichedPosts;
}

// user의 포스팅만 불러오기
export const getUserPost = async(userId: string, page: number)=>{
  const start = (page - 1) * POST_SIZE;
  const end = page * POST_SIZE - 1;
  const { data, error }= await supabase.from("posts").select("*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))").eq("user_id", userId).is('parent_post_id', null).range(start, end).order('created_at', {ascending: false});
  const postsId = data ? data.map(item=>item.id) : [];

  const [repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase.from('reposts').select('post_id, comment, reposted_by, reposted_at').in('post_id', postsId),
    supabase.from('likes').select('post_id, user_id').in('post_id', postsId),
    supabase.from('posts').select('*').in('parent_post_id', postsId)
  ])
  const {data:reposts, error:reactsError} =  repostsResult;
  const {data:likes, error:likesError} =  likesResult;
  const {data:comments, error:commentError} =commentsResult;

  const enrichedPosts = data?.map(post => {
    const postReposts = reposts?.filter(repost => repost.post_id === post.id);
    const postLikes = likes?.filter(like => like.post_id === post.id);
    const postComments = comments?.filter(comment => comment.parent_post_id === post.id);
  
    return {
      ...post,
      reposts: postReposts,
      likes: postLikes, 
      comments: postComments
    };
  });

  if(error){
    console.error('post 불러오는 중 오류')
  }
  return enrichedPosts;
}

// 클릭한 post 정보 하나 불러오기 
export const fetchPostDetail = async(postId: string)=>{
  
  const [postResult, repostsResult, likesResult, commentsResult] = await Promise.all([
    supabase.from('posts').select("*, user:users (nickname, profile_url, handle), post_tags (tag: tags (tag_name))").eq("id", postId).single(),
    supabase.from('reposts').select('post_id, comment, reposted_by, reposted_at').eq('post_id', postId),
    supabase.from('likes').select('post_id, user_id').eq('post_id', postId),
    supabase.from('posts').select('*').eq('parent_post_id', postId)
  ])

  const {data, error} = postResult;
  const {data:reposts, error:reactsError} =  repostsResult;
  const {data:likes, error:likesError} =  likesResult;
  const {data:comments, error:commentError} =commentsResult;
  
  const post = Array.isArray(data) ? data[0] : data;

  return {
    ...post,
    reposts: reposts || undefined,
    likes: likes || undefined, 
    comments : comments || undefined
  }
}

// tag 리스트 불러오기
export const getTagList = async()=>{
  const {data, error} = await supabase.from('tags').select('*');
  return data;
}

/** repost 관련 실행, 취소 */
export const insertRepost = async(postId: string, userId: string|undefined, comment?: string) =>{
  if(userId){
    const {data, error} = await supabase.from('reposts').insert({post_id:postId, reposted_by: userId, comment: comment })
    if(error){
      throw new Error(error.message)
    }
  }
}

export const deleteRepost = async(postId: string)=>{
  const {data, error} = await supabase.from('reposts').delete().eq('post_id', postId)
  if(error){
    throw new Error(error.message)
  }
  if(data)
  return data;
}

/** like 관련 실행, 취소 */
export const clickLike = async({postId, userId, state}: LikesFnType)=>{
  if(state && userId){
    const {data, error} = await supabase.from('likes').insert({post_id:postId, user_id: userId});
    if(error){
      throw new Error(error.message)
    }
  }else{
    const {data, error} = await supabase.from('likes').delete().eq('post_id', postId)
    if(error){
      throw new Error(error.message)
    }
  }
}

/** comments 관련 함수 */
export const fetchCommentInPost = async(postId: string) => {
  //가장 상단에 있는 post에 대한 comment 리스트들
  const { data: comments, error} = await supabase.from('posts').select("*, user:users (nickname, profile_url, handle)").eq('parent_post_id', postId);
  const commentsId = comments ? comments.map(item=>item.id) : [];
  

  const [repostsResult, likesResult, childCommentsResult] = await Promise.all([
    supabase.from('reposts').select('post_id, comment, reposted_by, reposted_at').in('post_id', commentsId),
    supabase.from('likes').select('post_id, user_id').in('post_id', commentsId),
    supabase.from('posts').select('*').in('parent_post_id', commentsId)
  ])

  const {data:reposts, error:reactsError} =  repostsResult;
  const {data:likes, error:likesError} =  likesResult;
  const {data:childComments, error:childCommentsError} =childCommentsResult;

  const enrichedComments = comments?.map(comment => {
    const commentReposts = reposts?.filter(repost => repost.post_id === comment.id);
    const commentLikes = likes?.filter(like => like.post_id === comment.id);
    const commentchildComments = childComments?.filter(childComment => childComment.parent_post_id === comment.id);
  
    return {
      ...comment,
      reposts: commentReposts,
      likes: commentLikes,
      comments: commentchildComments
    };
  });

  return enrichedComments;

}