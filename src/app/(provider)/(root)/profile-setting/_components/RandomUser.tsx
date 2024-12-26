import { randomUserRecommendation } from "@/apis/profile.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserItem from "@/components/UserItem";
import { ProfileType } from "@/types/profile.type";
import LogoLoading from "@/components/Loading/LogoLoading";

function RandomUser({ profile }: { profile: ProfileType }) {
  const { data: randoms, isPending } = useQuery({
    queryKey: ["randomUser", profile.userId],
    queryFn: () => randomUserRecommendation(profile),
  });

  if (isPending)
    return (
      <div className="w-[482px] h-[420px] border border-black rounded-xl my-5">
        <LogoLoading />
      </div>
    );
  return (
    <div className="border border-black rounded-xl py-2 my-5 divide-y-[1px]">
      {randoms &&
        randoms.map((random) => {
          const randomUser = {
            id: random.user?.id,
            profile_url: random.user.profile_url,
            nickname: random.user.nickname,
            handle: random.user.handle,
            user_profiles: {
              bio: random.user.profile?.bio,
            },
          };
          return <UserItem key={random.user?.id} user={randomUser} />;
        })}
    </div>
  );
}

export default RandomUser;
