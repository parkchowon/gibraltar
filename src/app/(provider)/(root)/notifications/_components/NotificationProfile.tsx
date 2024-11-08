import ProfileBtn from "@/components/ProfileBtn";
import React from "react";

function NotificationProfile({
  reactionCount,
  userIds,
  profileUrls,
}: {
  reactionCount: number;
  userIds: string[];
  profileUrls: string[];
}) {
  if (reactionCount === 2) {
    return (
      <div className="relative w-[46px] h-[46px]">
        <div className="absolute h-7 w-7 rounded-full">
          <ProfileBtn
            profileUrl={profileUrls[0]}
            userId={userIds[0]}
            intent="two"
          />
        </div>
        <div className="absolute w-7 h-7 right-0 bottom-0 rounded-full">
          <ProfileBtn
            profileUrl={profileUrls[1]}
            userId={userIds[1]}
            intent="two"
          />
        </div>
      </div>
    );
  }
  if (reactionCount > 3 || reactionCount < 5) {
    return (
      <div className="w-[46px] h-[46px] grid grid-cols-2 grid-rows-2 gap-0">
        {profileUrls.map((profile, idx) => {
          if (idx < 4)
            return (
              <ProfileBtn
                key={idx}
                profileUrl={profile}
                userId={userIds[idx]}
                intent="three"
              />
            );
        })}
      </div>
    );
  }
}

export default NotificationProfile;
