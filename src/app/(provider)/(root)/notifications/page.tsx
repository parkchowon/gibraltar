"use client";
import MainLayout from "@/components/Layout/MainLayout";
import RepostItem from "./_components/RepostItem";
import FollowItem from "./_components/FollowItem";

function NotificationPage() {
  return (
    <MainLayout>
      <div className="w-full h-[77px] bg-gray-300" />
      <div className="px-6 w-full divide-y-[1px] divide-gray-300">
        <RepostItem />
        <FollowItem />
      </div>
    </MainLayout>
  );
}

export default NotificationPage;
