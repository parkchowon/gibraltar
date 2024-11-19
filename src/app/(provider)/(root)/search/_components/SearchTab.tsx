import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

function SearchTab() {
  const router = useRouter();
  const path = usePathname();

  const params = useSearchParams();
  const tabName = params.get("tab") ?? "";

  const TAB = [
    { name: "인기순", path: "popular" },
    { name: "최신순", path: "recent" },
    { name: "사용자", path: "user" },
  ];

  const handleClickTab = (tab: string) => {
    const current = new URLSearchParams(Array.from(params.entries()));
    current.set("tab", tab);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${path}${query}`);
  };
  return (
    <div className="flex justify-evenly border-y-[1px] border-gray-400">
      {TAB.map((tab) => {
        return (
          <button
            key={tab.name}
            className={`relative py-3 flex-grow text-xs font-bold ${
              tabName === tab.path
                ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[40px] after:h-[1px] after:bg-black"
                : null
            } hover:bg-gray-100`}
            onClick={() => handleClickTab(tab.path)}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}

export default SearchTab;
