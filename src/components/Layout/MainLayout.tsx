"use client";
import PostBox from "@/app/(provider)/(root)/home/_components/PostBox";
import Profile from "@/app/(provider)/(root)/home/_components/Profile";
import SearchBar from "@/app/(provider)/(root)/home/_components/SearchBar";
import { PropsWithChildren } from "react";
import SideBar from "../SideBar";

function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-full">
      <main className="relative flex w-full h-full items-center justify-center">
        <SideBar />
        {children}
        <section className="absolute w-[352px] h-full top-[77px]">
          <SearchBar />
          <Profile />
          <PostBox />
        </section>
      </main>
    </div>
  );
}

export default MainLayout;
