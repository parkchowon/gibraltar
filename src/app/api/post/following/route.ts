import { POST_SIZE } from "@/constants/post";
import { createClient } from "@/supabase/server";
import { sortDataByTime } from "@/utils/sortData";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user_id") as string;
  const queryCursor = searchParams.get("cursor") as string;
  const cursor = queryCursor.split(" ").join("+");

  if (!userId) {
    return NextResponse.json({ message: "userId가 없음" }, { status: 400 });
  }

  try {
    // 팔로우 하고 있는 사람들의 목록을 불러옴
    const { data: followings, error: followingError } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    if (followingError)
      throw new Error("팔로잉 목록 불러오는 중 에러:" + followingError.message);

    const followingId = followings?.map((item) => item.following_id);
    const followerList = followingId ? [userId, ...followingId] : [userId];

    const { data: nicknames, error: nicknameError } = await supabase
      .from("users")
      .select("id, nickname")
      .in("id", followingId);
    if (nicknameError) throw new Error(nicknameError.message);

    // 팔로하고 있는 사람들(본인 포함)이 rt한 postId 목록
    let repostsQuery = supabase
      .from("reposts")
      .select("post_id, reposted_at, reposted_by, is_quoted")
      .in("reposted_by", followerList)
      .eq("is_quoted", false)
      .order("reposted_at", { ascending: false })
      .limit(POST_SIZE);

    // 팔로하고 있는 사람(본임 포함)들의 포스팅
    let postsQuery = supabase
      .from("posts")
      .select("id, created_at")
      .in("user_id", followerList)
      .is("parent_post_id", null)
      .order("created_at", { ascending: false })
      .limit(POST_SIZE);

    // 첫번째면 최신순으로 위에서 10개, cursor가 있으면 거기서 부터 10개
    if (cursor !== "null") {
      postsQuery = postsQuery.lt("created_at", cursor);
      repostsQuery = repostsQuery.lt("reposted_at", cursor);
    }

    const [postsResult, repostsResult] = await Promise.all([
      postsQuery,
      repostsQuery,
    ]);

    // post와 repost 불러오는데 에러처리
    if (postsResult.error || repostsResult.error) {
      throw new Error(
        postsResult.error?.message || repostsResult.error?.message
      );
    }

    // 시간순으로 정렬한 뒤 10개로 만든 배열
    const orderedPost = sortDataByTime({
      reposts: repostsResult.data || [],
      posts: postsResult.data || [],
    });

    // 최신순 post의 id값의 배열
    const orderedPostId = orderedPost.map((post) => post.id);

    // 최신순의 post와 repost id 배열
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select(
        "*, user:users (id, nickname, profile_url, handle, account_type), post_tags (tag: tags (tag_name)), reposts (reposted_by, is_quoted), likes (user_id)"
      )
      .in("id", orderedPostId)
      .is("parent_post_id", null)
      .is("is_deleted", false)
      .order("created_at", { ascending: false });

    if (postError)
      throw new Error(
        "최신 타임라인 포스팅 불러오는 중 에러: " + postError.message
      );

    const { data: comments, error: commentError } = await supabase
      .from("posts")
      .select("*")
      .in("parent_post_id", orderedPostId);

    if (commentError)
      throw new Error("댓글 갯수 불러오는 중 에러: " + commentError.message);

    const enrichedPosts = posts?.map((post) => {
      const repostedCheck = orderedPost.find((order) => order.id === post.id);
      let repostedUser = null;
      let repostedTime = post.created_at;
      if (repostedCheck?.isReposted) {
        repostedUser =
          nicknames.find((nick) => nick.id === repostedCheck.reposted_by)
            ?.nickname || userId;
        repostedTime = repostedCheck.created_at;
      }

      const postComments = comments?.filter(
        (comment) => comment.parent_post_id === post.id
      );

      return {
        ...post,
        isReposted: repostedCheck ? repostedCheck.isReposted : false,
        reposted_by: repostedUser,
        timeline_at: repostedTime,
        comments: postComments,
      };
    });

    enrichedPosts?.sort(
      (a, b) => Date.parse(b.timeline_at) - Date.parse(a.timeline_at)
    );

    return NextResponse.json(enrichedPosts || []);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
