"use client";
import { SIDE_BAR } from "@/constants/sidebar";
import { useAuth } from "@/contexts/auth.context";
import { useNotificationStore } from "@/stores/notification.store";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function SideBar() {
  const router = useRouter();
  const path = usePathname();
  const { userData } = useAuth();
  const { notiCount } = useNotificationStore();

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
            className="relative flex justify-left items-center w-full h-[58px] hover:bg-subGray hover:rounded-full"
          >
            <div className="relative w-6 h-6 ml-5 mr-10">
              {item.name === "알림" && notiCount && (
                <div className="absolute w-2 h-2 rounded-full bg-carrot right-0 z-10 border border-white"></div>
              )}
              <Image
                fill
                alt="icon"
                src={
                  path === item.path ||
                  (item.path === "/mypage" && path === `/${userData?.handle}`)
                    ? item.icon.fill
                    : item.icon.line
                }
                className="absolute"
              />
            </div>
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
