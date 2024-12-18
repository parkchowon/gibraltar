"use client";
import { SIDE_BAR } from "@/constants/sidebar";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function SideBar() {
  const router = useRouter();
  const path = usePathname();
  const { userData } = useAuth();

  const handleClick = (path: string) => {
    if (path === "/mypage") {
      return router.push(`/${userData?.handle}`);
    }
    router.push(path);
  };

  return (
    <aside className="flex flex-col w-full h-fit items-start">
      {SIDE_BAR.map((item) => {
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.path)}
            className="flex justify-left items-center w-full h-[58px] hover:bg-gray-100 hover:rounded-full"
          >
            <Image
              width={24}
              height={24}
              alt="icon"
              src={
                path === item.path ||
                (item.path === "/mypage" && path === `/${userData?.handle}`)
                  ? item.icon.fill
                  : item.icon.line
              }
              className="ml-5 mr-10"
            />
            <p
              className={`${path === item.path ? "font-extrabold" : ""} ${
                item.path === "/mypage" && path === `/${userData?.handle}`
                  ? "font-extrabold"
                  : ""
              } text-sm text-left`}
            >
              {item.name}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
export default SideBar;
