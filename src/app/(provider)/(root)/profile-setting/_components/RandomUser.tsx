import { randomUserRecommendation } from "@/apis/profile.api";
import { profileType } from "@/types/hero.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserItem from "@/components/UserItem";

function RandomUser({ profile }: { profile: profileType }) {
  const { data: randoms, isPending } = useQuery({
    queryKey: ["randomUser", profile.userId],
    queryFn: () => randomUserRecommendation(profile),
  });

  if (isPending) return <p>loading...</p>;
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
