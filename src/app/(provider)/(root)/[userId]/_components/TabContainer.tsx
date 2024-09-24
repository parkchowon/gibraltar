import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

const TAB = [
  { name: "포스트", path: "" },
  { name: "미디어", path: "?tab=media" },
  { name: "북마크", path: "?tab=bookmark" },
];

function TabContainer({ children }: PropsWithChildren) {
  const router = useRouter();
  const path = usePathname();
  const handleClickTab = (tab: string) => {
    router.push(`${path}${tab}`);
  };

  return (
    <div>
      <div className="flex justify-evenly border-y-[1px] border-gray-400">
        {TAB.map((tab) => {
          return (
            <button
              key={tab.name}
              className="py-3 flex-grow font-bold hover:bg-gray-200"
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
