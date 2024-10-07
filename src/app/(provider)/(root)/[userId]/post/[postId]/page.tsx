"use client";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/auth.context";
import { usePostDetail } from "@/hooks/usePostMutation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Post from "../../../home/_components/Post";

function DetailPostPage() {
  const pathname = usePathname();
  const postId = pathname.split("/")[3];
  const { data } = usePostDetail(postId);
  const { userData } = useAuth();

  if (!data) {
    return <p>loading...</p>;
  }

  return (
    <MainLayout>
      <div className="flex px-6 py-[26px] gap-8">
        <Image src={"/icons/arrow.svg"} alt="back" width={15} height={14} />
        <p className="font-semibold">홈으로</p>
      </div>
      <div className="h-fit">
        <Post post={data} />
        <div>
          <Image
            src={userData ? userData.profile_url : ""}
            alt="profile"
            width={46}
            height={36}
            className="rounded-full"
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default DetailPostPage;
