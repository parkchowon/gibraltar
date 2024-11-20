"use client";
import React, { Suspense } from "react";
import Search from "./_components/Search";

function SearchPage() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Search />
    </Suspense>
  );
}

export default SearchPage;
