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
    <aside className="flex flex-col w-full h-fit items-center">
      {SIDE_BAR.map((item) => {
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.path)}
            className="relative flex justify-center lg:justify-start items-center w-[58px] lg:w-full h-[58px] hover:bg-subGray hover:rounded-full"
          >
            <div
              className={`relative w-6 h-6 lg:ml-5 lg:mr-10 ${
                item.name === "더보기" &&
                "border-2 border-black rounded-full rotate-90"
              }`}
            >
              {item.name === "알림" && notiCount && (
                <div className="absolute w-2 h-2 rounded-full aspect-square bg-carrot right-0 z-10 border border-white"></div>
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
                className={`absolute ${item.name === "더보기" && "p-[2px]"}`}
              />
            </div>
            <p
              className={`${path === item.path ? "font-extrabold" : ""} ${
                item.path === "/mypage" && path === `/${userData?.handle}`
                  ? "font-extrabold"
                  : ""
              } text-sm text-left hidden lg:block`}
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
