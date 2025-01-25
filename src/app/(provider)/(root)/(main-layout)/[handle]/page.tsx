"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { useSearchParams } from "next/navigation";
import ProfileBox from "./_components/ProfileBox";
import ProfileDetail from "./_components/ProfileDetail/ProfileDetail";
import TabContainer from "./_components/TabContainer";
import UserPost from "./_components/UserPost";
import UserTab from "./_components/UserTab";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/apis/auth.api";
import TimeLineLoading from "@/components/Loading/TimeLineLoading";
import ProfileLoading from "@/components/Loading/ProfileLoading";

function ProfilePage({ params }: { params: { handle: string } }) {
  const handle = params.handle;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const { data: userId, isPending } = useQuery({
    queryKey: ["userId", handle],
    queryFn: () => getUserId(handle),
  });

  if (isPending)
    return (
      <>
        <div className="px-6">
          <ProfileLoading />
          <div className={`flex py-3 border-t justify-center border-mainGray`}>
            <div className="flex gap-10">
              <p className="text-xs font-semibold">세부 프로필 펼치기</p>
              <div className="grid place-items-center w-4 h-4 rotate-90"></div>
            </div>
          </div>
          <TabContainer />
          <TimeLineLoading />
        </div>
      </>
    );
  return (
    <>
      <div className="lg:px-6">
        {/* 프로필 부분 */}
        <ProfileBox userId={userId} />
        {/* 세부프로필 부분 */}
        <ProfileDetail userId={userId} />
        {/* 탭 영역 */}
        <TabContainer>
          {tab ? (
            <UserTab userId={userId} type={tab} />
          ) : (
            <UserPost userId={userId} />
          )}
        </TabContainer>
      </div>
    </>
  );
}

export default ProfilePage;
