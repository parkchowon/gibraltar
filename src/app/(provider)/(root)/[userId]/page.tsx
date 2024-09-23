"use client";
import MainLayout from "@/components/Layout/MainLayout";
import ProfileBox from "./_components/ProfileBox";
import UserPost from "./_components/UserPost";

function ProfilePage() {
  return (
    <MainLayout>
      <div>
        <div>홈으로</div>
        <ProfileBox />
        <UserPost />
      </div>
    </MainLayout>
  );
}

export default ProfilePage;
