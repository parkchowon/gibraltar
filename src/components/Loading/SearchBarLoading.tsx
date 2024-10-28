import React from "react";

function SearchBarLoading() {
  return (
    <div className="relative w-full h-[58px] px-8 py-[15px] rounded-full bg-gray-300 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200 to-transparent animate-shimmer" />
    </div>
  );
}

export default SearchBarLoading;
