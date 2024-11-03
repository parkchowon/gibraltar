import MainLayout from "@/components/Layout/MainLayout";
import NotificationItem from "./_components/NotificationItem";

function NotificationPage() {
  return (
    <MainLayout>
      <div className="w-full h-[77px] bg-gray-300" />
      <div className="px-6 w-full">
        <NotificationItem />
      </div>
    </MainLayout>
  );
}

export default NotificationPage;
