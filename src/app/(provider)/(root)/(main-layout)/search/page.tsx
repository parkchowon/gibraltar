"use client";
import React, { Suspense } from "react";
import Search from "./_components/Search";
import LogoLoading from "@/components/Loading/LogoLoading";

function SearchPage() {
  return (
    <Suspense fallback={<LogoLoading />}>
      <Search />
    </Suspense>
  );
}

export default SearchPage;
