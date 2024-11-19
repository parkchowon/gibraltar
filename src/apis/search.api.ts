import supabase from "@/supabase/client";

export const fetchPopularSearch = async (
  searchText: string,
  userId: string | undefined
) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
        )
        .textSearch("content", searchText);
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
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchRecentSearch = async (
  searchText: string,
  userId: string | undefined
) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
        )
        .textSearch("content", searchText)
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
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchUserSearch = async (
  searchText: string,
  userId: string | undefined
) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, user:users (id, nickname, profile_url, handle), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
        )
        .textSearch("content", searchText);
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
    }
  } catch (error) {
    console.error(error);
  }
};
