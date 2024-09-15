"use client";
import { getUser } from "@/apis/auth.api";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import PostBox from "./PostBox";
import Profile from "./Profile";
import SearchBar from "./SearchBar";
import TimeLine from "./TimeLine";

function Home() {
  const { isInitialized, user } = useAuth();

  const { isPending, data: userData } = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: () => {
      if (user) {
        return getUser(user.id);
      }
    },
    enabled: isInitialized,
  });

  if (!isInitialized) return <p>loading...</p>;

  return (
    <main className="flex h-full w-full pt-[84px] ">
      <section className="flex-grow">
        <TimeLine userData={userData} />
      </section>
      <section className="w-[352px] h-full bg-blue-50 mr-[250px] ml-[95px]">
        <SearchBar />
        <Profile userData={userData} isPending={isPending} />
        <PostBox userData={userData} />
      </section>
    </main>
  );
}

export default Home;
