"use client";
import MainLayout from "@/components/Layout/MainLayout";
import Image from "next/image";
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

  return (
    <MainLayout>
      <div className="px-6 pt-[4%]">
        <div className="flex gap-8 items-center">
          <button>
            <Image
              alt="arrow"
              width={15}
              height={13.7}
              src={"/icons/arrow.svg"}
            />
          </button>
          <p className="font-semibold">홈으로</p>
        </div>
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
