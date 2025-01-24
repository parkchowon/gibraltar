import { useSearchParams } from "next/navigation";
import React from "react";
import SearchTab from "./SearchTab";
import SearchBar from "../../home/_components/SearchBar";

function Search() {
  const params = useSearchParams();
  const searchText = params.get("word") ?? "";
  const tab = params.get("tab") ?? "";

  return (
    <>
      <div className="w-full px-4 lg:px-12 py-4 lg:py-8 border-mainGray border-b-[1px]">
        <SearchBar searchValue={searchText} tab={tab} />
      </div>
      {searchText ? (
        <SearchTab />
      ) : (
        <p className="w-full py-40 text-center lg:text-base text-sm">
          원하는 정보나 유저를 찾아보세요!
        </p>
      )}
    </>
  );
}

export default Search;
