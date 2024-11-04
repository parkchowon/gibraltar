"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox/PostBox";
import SideProfile from "@/app/(provider)/(root)/home/_components/SideProfile";
import RepostModal from "@/app/(provider)/(root)/home/_components/Post/RepostModal";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { usePostStore } from "@/stores/post.store";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";

function MainLayout({ children }: PropsWithChildren) {
  const { isModalOpen, modal } = usePostStore();
  return (
    <div className="relative w-screen w-m-[1920px] h-screen overflow-auto">
      {isModalOpen && <RepostModal postUserId={modal.postUserId} />}
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
  );
}

export default MainLayout;
