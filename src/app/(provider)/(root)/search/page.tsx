"use client";
import MainLayout from "@/components/Layout/MainLayout";
import React from "react";
import SearchBar from "../home/_components/SearchBar";
import SearchTab from "./_components/SearchTab";

function SearchPage() {
  return (
    <MainLayout>
      <div className="w-full px-8 py-8">
        <SearchBar />
      </div>
      <SearchTab />
    </MainLayout>
  );
}

export default SearchPage;
