"use client";
import MainLayout from "@/components/Layout/MainLayout";
import TimeLine from "./TimeLine";

function Home() {
  return (
    <MainLayout>
      <section className="w-[784px] h-fit">
        <TimeLine />
      </section>
    </MainLayout>
  );
}

export default Home;
