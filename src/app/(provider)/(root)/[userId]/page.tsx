"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { useSearchParams } from "next/navigation";
import ProfileBox from "./_components/ProfileBox";
import ProfileDetail from "./_components/ProfileDetail";
import TabContainer from "./_components/TabContainer";
import UserPost from "./_components/UserPost";
import UserTab from "./_components/UserTab";

function ProfilePage({ params }: { params: { userId: string } }) {
  const userId = params.userId;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  // TODO: userId url 없애고 handle로 바꾼다음 handle로 userId 받아오는 로직으로 userId 넘겨주기
  // TODO: 기존의 userId로 router.push했던 곳들 다 handle로 바꾸기
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
