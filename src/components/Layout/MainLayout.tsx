"use client";
import PostBox from "@/app/(provider)/(root)/(main-layout)/home/_components/PostBox/PostBox";
import SideProfile from "@/app/(provider)/(root)/(main-layout)/home/_components/SideProfile";
import SearchBar from "@/app/(provider)/(root)/(main-layout)/home/_components/SearchBar";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";
import RepostModal from "@/app/(provider)/(root)/(main-layout)/home/_components/Post/RepostModal";
import QuoteModal from "@/app/(provider)/(root)/(main-layout)/home/_components/Post/QuoteModal";
import { usePostStore } from "@/stores/post.store";
import { usePathname, useRouter } from "next/navigation";
import BackArrowBtn from "../BackArrowBtn";
import GibraltarLetter from "@/assets/logo/gibraltar_letter.svg";
import GibraltarLogo from "@/assets/logo/gibraltar_logo.svg";
import GroupCheckBox from "@/app/(provider)/(root)/(main-layout)/group/_components/GroupCheck/GroupCheckBox";
import ChatIcon from "@/assets/icons/post_chat.svg";

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

  return (
    <>
      {modalRendering()}
      <div className="relative flex w-screen w-m-[1920px] h-screen overflow-auto">
        {/* 사이드 바 */}
        <section className="fixed left-2 mt-[5%] lg:mt-0 lg:left-[15.5%] lg:top-[5%] lg:w-[10.3%]">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center w-full pb-10 gap-1 outline-none"
          >
            <GibraltarLogo width={24} height={24} className="lg:hidden block" />
            <GibraltarLetter width="90%" className="lg:block hidden" />
          </button>
          <SideBar />
          {/* 모바일 환경에서 글쓰기 */}
          <button
            onClick={() => router.push("/post")}
            className="fixed flex items-center justify-center bottom-[5%] w-[58px] h-[58px] min-h-[58px] min-w-[58px] bg-carrot rounded-full lg:hidden"
          >
            <ChatIcon width={24} height={24} style={{ color: "white" }} />
          </button>
        </section>
        {/* 가운데 */}
        <section className="flex-grow ml-[74px] lg:ml-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:w-[40.8%] min-h-screen h-auto bg-white">
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
