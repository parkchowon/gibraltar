import { useGroupStore } from "@/stores/group.store";
import React from "react";
import ParticipantUserItem from "./ParticipantUserItem";
import LogoLoading from "@/components/Loading/LogoLoading";

function GroupCheckBox() {
  const { participantUser, searchingStatus } = useGroupStore();

  const renderingGroupState = () => {
    switch (searchingStatus) {
      case "모집":
        return (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">모집 중</p>
            <div className="flex w-full h-fit items-center">
              {participantUser.length === 0 && (
                <p className="text-mainGray text-sm">아직 참여자가 없습니다</p>
              )}
              {participantUser.map((user) => (
                <ParticipantUserItem user={user} />
              ))}
            </div>
          </div>
        );
      case "참가":
        return <p>참가 중</p>;
      case "안함":
        return <p>현재 매칭되고 있는 그룹이 없어요</p>;
      default:
        return <LogoLoading />;
    }
  };
  return (
    <div className="relative flex flex-col px-8 bg-subGray rounded-[30px] py-9 border border-mainGray">
      {renderingGroupState()}
    </div>
  );
}

export default GroupCheckBox;
