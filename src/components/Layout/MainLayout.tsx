"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox/PostBox";
import SideProfile from "@/app/(provider)/(root)/home/_components/SideProfile";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";
import RepostModal from "@/app/(provider)/(root)/home/_components/Post/RepostModal";
import QuoteModal from "@/app/(provider)/(root)/home/_components/Post/QuoteModal";
import { usePostStore } from "@/stores/post.store";
import { usePathname, useRouter } from "next/navigation";
import BackArrowBtn from "../BackArrowBtn";
import Gibraltar from "@/assets/logo/gibraltar_letter.svg";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function MainLayout({ children }: PropsWithChildren) {
  const { isModalOpen } = usePostStore();
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

  const handleLogoClick = () => {
    router.push("/home");
  };

  return (
    <>
      {modalRendering()}
      <div className="relative w-screen w-m-[1920px] h-screen overflow-auto">
        {/* 사이드 바 */}
        <section className="fixed left-[15.5%] top-[5%] w-[10.3%]">
          <button
            onClick={handleLogoClick}
            className="flex flex-col items-center w-full pb-10 gap-1"
          >
            {/* <Logo width={30} /> */}
            <Gibraltar width="90%" />
          </button>
          <SideBar />
        </section>
        {/* 가운데 */}
        <section className="absolute left-1/2 transform -translate-x-1/2 w-[40.8%] min-h-screen h-auto bg-gray-200">
          {path != "/search" && <BackArrowBtn type="page" />}
          {children}
        </section>
        {/* 오른쪽 프로필 */}
        <section className="fixed w-[18.3%] left-[75.1%] top-[7.12%]">
          {path !== "/search" ? <SearchBar /> : null}
          <SideProfile />
          <PostBox />
        </section>
      </div>
    </>
  );
}

export default MainLayout;
