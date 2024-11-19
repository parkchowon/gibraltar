"use client";
import MainLayout from "@/components/Layout/MainLayout";
import React from "react";
import SearchBar from "../home/_components/SearchBar";
import SearchTab from "./_components/SearchTab";
import { useSearchParams } from "next/navigation";

function SearchPage() {
  const params = useSearchParams();
  const searchText = params.get("word") ?? "";

  return (
    <MainLayout>
      <div className="w-full px-12 py-8">
        <SearchBar searchValue={searchText} />
      </div>
      <SearchTab />
    </MainLayout>
  );
}

export default SearchPage;
