"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox/PostBox";
import SideProfile from "@/app/(provider)/(root)/home/_components/SideProfile";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";
import RepostModal from "@/app/(provider)/(root)/home/_components/Post/RepostModal";
import PostQuoteModal from "@/app/(provider)/(root)/home/_components/Post/PostQuoteModal";
import { usePostStore } from "@/stores/post.store";

function MainLayout({ children }: PropsWithChildren) {
  const { isModalOpen } = usePostStore();

  const modalRendering = () => {
    switch (isModalOpen) {
      case "repost":
        return <RepostModal />;
      case "quote":
        return <PostQuoteModal />;
      case "closed":
        return;
      default:
        return;
    }
  };

  return (
    <>
      {modalRendering()}
      <div className="relative w-screen w-m-[1920px] h-screen overflow-auto">
        {/* 사이드 바 */}
        <section className="fixed left-[15.5%] top-[11.7%] w-[10.3%]">
          <SideBar />
        </section>
        {/* 가운데 */}
        <section className="absolute left-1/2 transform -translate-x-1/2 w-[40.8%] min-h-screen h-auto overflow-auto bg-gray-200">
          {children}
        </section>
        {/* 오른쪽 프로필 */}
        <section className="fixed w-[18.3%] left-[75.1%] top-[7.12%]">
          <SearchBar />
          <SideProfile />
          <PostBox />
        </section>
      </div>
    </>
  );
}

export default MainLayout;
