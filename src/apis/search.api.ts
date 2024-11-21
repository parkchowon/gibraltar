import supabase from "@/supabase/client";
import { orderedPopular } from "@/utils/sortData";

const POST_SIZE = 10;

// TODO: 어떻게 타협할건지..
export const fetchPopularSearch = async (
  searchText: string,
  userId: string,
  pageParams: string | number
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

export const fetchRecentSearch = async (
  searchText: string,
  userId: string,
  pageParams: number
) => {
  try {
    const start = (pageParams - 1) * POST_SIZE;
    const end = pageParams * POST_SIZE - 1;

    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .ilike("content", `%${searchText}%`)
      .range(start, end)
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

export const fetchUserSearch = async (
  searchText: string,
  pageParams: number
) => {
  try {
    const start = (pageParams - 1) * POST_SIZE;
    const end = pageParams * POST_SIZE - 1;

    const { data, error } = await supabase
      .from("users")
      .select("id, profile_url, nickname, handle, user_profiles(bio)")
      .range(start, end)
      .or(`nickname.ilike.%${searchText}%, handle.ilike.%${searchText}%`);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
