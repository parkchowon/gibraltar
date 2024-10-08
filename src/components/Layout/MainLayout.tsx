"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox";
import Profile from "@/app/(provider)/(root)/home/_components/Profile";
import RepostModal from "@/app/(provider)/(root)/home/_components/RepostModal";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { usePostStore } from "@/stores/post.store";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";

function MainLayout({ children }: PropsWithChildren) {
  const { isModalOpen } = usePostStore();
  return (
    <>
      <div className="relative h-screen overflow-auto">
        {isModalOpen && <RepostModal />}
        {/* 사이드 바 */}
        <section className="absolute left-[15.6%] top-[11.7%] w-[198px]">
          <SideBar />
        </section>
        {/* 가운데 */}
        <section className="absolute left-1/2 transform -translate-x-1/2 w-[784px] min-h-screen h-auto overflow-auto bg-gray-300">
          {children}
        </section>
        {/* 오른쪽 프로필 */}
        <section className="absolute right-[6.3%] top-[7.1%] w-[352px]">
          <SearchBar />
          <Profile />
          <PostBox />
        </section>
      </div>
    </>
  );
}

export default MainLayout;
