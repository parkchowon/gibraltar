"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { usePathname, useSearchParams } from "next/navigation";
import ProfileBox from "./_components/ProfileBox";
import ProfileDetail from "./_components/ProfileDetail";
import TabContainer from "./_components/TabContainer";
import UserPost from "./_components/UserPost";
import UserTab from "./_components/UserTab";

function ProfilePage() {
  const pathname = usePathname();
  const userId = pathname.replace("/", "");
  const params = useSearchParams();
  const tab = params.get("tab");

  // TODO: userId url 없애고 handle로 바꾼다음 handle로 userId 받아오는 로직으로 userId 넘겨주기

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
