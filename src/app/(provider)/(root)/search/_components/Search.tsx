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
      <div className="w-full px-12 py-8">
        <SearchBar searchValue={searchText} tab={tab} />
      </div>
      <SearchTab />
    </MainLayout>
  );
}

export default Search;
