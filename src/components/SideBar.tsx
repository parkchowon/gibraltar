"use client";
import { SIDE_BAR } from "@/constants/sidebar";
import { useAuth } from "@/contexts/auth.context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function SideBar() {
  const router = useRouter();
  const path = usePathname();
  const { user } = useAuth();

  const handleClick = (path: string) => {
    if (path === "/mypage") {
      return router.replace(`/${user?.id}`);
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
            className="flex justify-center items-center h-[58px]"
          >
            <Image
              width={24}
              height={24}
              alt="icon"
              src={path === item.path ? item.icon.fill : item.icon.line}
              className="mx-10"
            />
            <p className={`${path === item.path ? "font-extrabold" : ""}`}>
              {item.name}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
export default SideBar;
