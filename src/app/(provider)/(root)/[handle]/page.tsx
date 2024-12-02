"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { useSearchParams } from "next/navigation";
import ProfileBox from "./_components/ProfileBox";
import ProfileDetail from "./_components/ProfileDetail";
import TabContainer from "./_components/TabContainer";
import UserPost from "./_components/UserPost";
import UserTab from "./_components/UserTab";
import { useQuery } from "@tanstack/react-query";
import { getUserId } from "@/apis/auth.api";
import TimeLineLoading from "@/components/Loading/TimeLineLoading";

function ProfilePage({ params }: { params: { handle: string } }) {
  const handle = params.handle;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const { data: userId, isPending } = useQuery({
    queryKey: ["userId", handle],
    queryFn: () => getUserId(handle),
  });
  // TODO: userId url 없애고 handle로 바꾼다음 handle로 userId 받아오는 로직으로 userId 넘겨주기
  // TODO: 기존의 userId로 router.push했던 곳들 다 handle로 바꾸기

  if (isPending)
    return (
      <MainLayout>
        <TimeLineLoading />
      </MainLayout>
    );
  return (
    <MainLayout>
      <div className="px-6">
        {/* 프로필 부분 */}
        <ProfileBox userId={userId} />
        {/* 세부프로필 부분 */}
        <ProfileDetail />
        {/* 탭 영역 */}
        <TabContainer>
          {tab ? (
            <UserTab userId={userId} type={tab} />
          ) : (
            <UserPost userId={userId} />
          )}
        </TabContainer>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
