import { fetchPopularSearch, fetchUserSearch } from "@/apis/search.api";

export type SearchUserType = Awaited<ReturnType<typeof fetchUserSearch>>;

export type SearchPostType = Awaited<ReturnType<typeof fetchPopularSearch>>;
