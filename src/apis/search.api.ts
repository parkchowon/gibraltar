import supabase from "@/supabase/client";
import { orderedPopular } from "@/utils/orderedPopular";

export const fetchPopularSearch = async (
  searchText: string,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .ilike("content", `%${searchText}%`);
    if (error) throw new Error(error.message);

    const postIds = data ? data.map((post) => post.id) : [];
    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postIds);
    if (commentError) throw new Error(commentError.message);

    const post = data.map((post) => {
      const repostedCheck = post.reposts.find(
        (repost) => repost.reposted_by === userId
      );

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );
      return {
        ...post,
        isReposted: !!repostedCheck,
        reposted_by: null,
        timeline_at: post.created_at,
        comments: postComments,
      };
    });

    // 인기순으로 정렬하는 함수
    const orderedPost = orderedPopular(post);
    return orderedPost;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRecentSearch = async (searchText: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .ilike("content", `%${searchText}%`)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    const postIds = data ? data.map((post) => post.id) : [];
    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", postIds);
    if (commentError) throw new Error(commentError.message);

    const post = data.map((post) => {
      const repostedCheck = post.reposts.find(
        (repost) => repost.reposted_by === userId
      );

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );
      return {
        ...post,
        isReposted: !!repostedCheck,
        reposted_by: null,
        timeline_at: post.created_at,
        comments: postComments,
      };
    });
    return post;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchUserSearch = async (searchText: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, profile_url, nickname, handle, user_profiles(bio)")
      .or(`nickname.ilike.%${searchText}%, handle.ilike.%${searchText}%`);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
