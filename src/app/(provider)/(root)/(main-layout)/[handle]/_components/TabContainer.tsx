import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

const TAB = [
  { name: "포스트", path: "" },
  { name: "미디어", path: "media" },
  { name: "북마크", path: "bookmark" },
];

function TabContainer({ children }: PropsWithChildren) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const tabName = params.get("tab") ?? "";

  const handleClickTab = (tab: string) => {
    const queryString = tab ? `?tab=${tab}` : "";
    router.push(`${path}${queryString}`);
  };

  return (
    <div>
      <div className="flex justify-evenly border-y-[1px] border-gray-400">
        {TAB.map((tab) => {
          return (
            <button
              key={tab.name}
              className={`relative py-3 flex-grow text-xs text-black font-bold ${
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
      {children}
    </div>
  );
}

export default TabContainer;
