"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox/PostBox";
import SideProfile from "@/app/(provider)/(root)/home/_components/SideProfile";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { PropsWithChildren, useEffect, useState } from "react";
import SideBar from "../SideBar";
import RepostModal from "@/app/(provider)/(root)/home/_components/Post/RepostModal";
import QuoteModal from "@/app/(provider)/(root)/home/_components/Post/QuoteModal";
import { usePostStore } from "@/stores/post.store";
import { usePathname, useRouter } from "next/navigation";
import BackArrowBtn from "../BackArrowBtn";
import GibraltarLetter from "@/assets/logo/gibraltar_letter.svg";
import GibraltarLogo from "@/assets/logo/gibraltar_logo.svg";
import GroupCheckBox from "@/app/(provider)/(root)/group/_components/GroupCheck/GroupCheckBox";

function MainLayout({ children }: PropsWithChildren) {
  const { isModalOpen } = usePostStore();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const modalRendering = () => {
    switch (isModalOpen) {
      case "repost":
        return <RepostModal />;
      case "quote":
        return <QuoteModal />;
      case "closed":
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    handleResize(); // 초기 크기 체크
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {modalRendering()}
      <div className="relative flex w-screen w-m-[1920px] h-screen overflow-auto">
        {/* 사이드 바 */}
        <section className="left-2 mt-[5%] lg:mt-0 lg:absolute lg:left-[15.5%] lg:top-[5%] lg:w-[10.3%]">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center w-full pb-10 gap-1 outline-none"
          >
            {isSmallScreen ? (
              <GibraltarLogo width={24} height={24} />
            ) : (
              <GibraltarLetter width="90%" />
            )}
          </button>
          <SideBar />
        </section>
        {/* 가운데 */}
        <section className="flex-grow lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[40.8%] min-h-screen h-auto bg-white">
          {path != "/search" && <BackArrowBtn type="page" />}
          {children}
        </section>
        {/* 오른쪽 프로필 */}
        <section className="fixed hidden lg:block w-[18.3%] left-[75.1%] top-[7.12%]">
          {path !== "/search" ? <SearchBar /> : null}
          <SideProfile />
          {path === "/home" && <PostBox />}
          {path === "/group" && <GroupCheckBox />}
        </section>
      </div>
    </>
  );
}

export default MainLayout;
