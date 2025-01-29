import apiClient from "./apiClient.api";
import { SearchPostType, SearchUserType } from "@/types/search.type";

// TODO: 어떻게 타협할건지..
export const fetchPopularSearch = async (
  searchText: string,
  userId: string,
  pageParams: number
): Promise<SearchPostType> => {
  try {
    const response = await apiClient.get(
      `api/search/${userId}/recent?text=${searchText}&page-params=${pageParams}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRecentSearch = async (
  searchText: string,
  userId: string,
  pageParams: number
): Promise<SearchPostType> => {
  try {
    const response = await apiClient.post(
      `api/search/${userId}/recent?page-params=${pageParams}`,
      {
        searchText: searchText,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchUserSearch = async (
  searchText: string,
  pageParams: number
): Promise<SearchUserType> => {
  try {
    const response = await apiClient.post(
      `api/search/user?page-params=${pageParams}`,
      {
        searchText: searchText,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchUserHandle = async (
  handle: string
): Promise<SearchUserType> => {
  try {
    const response = await apiClient.get(`api/search/${handle}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
