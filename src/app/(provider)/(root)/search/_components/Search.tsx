import MainLayout from "@/components/Layout/MainLayout";
import { useSearchParams } from "next/navigation";
import React from "react";
import SearchBar from "../../home/_components/SearchBar";
import SearchTab from "./SearchTab";

function Search() {
  const params = useSearchParams();
  const searchText = params.get("word") ?? "";
  const tab = params.get("tab") ?? "";

  return (
    <MainLayout>
      <div className="w-full px-12 py-8 border-mainGray border-b-[1px]">
        <SearchBar searchValue={searchText} tab={tab} />
      </div>
      {searchText ? (
        <SearchTab />
      ) : (
        <p className="w-full py-40 text-center">
          원하는 정보나 유저를 찾아보세요!
        </p>
      )}
    </MainLayout>
  );
}

export default Search;
