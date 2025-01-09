import { useGroupStore } from "@/stores/group.store";
import React from "react";
import ParticipantUserItem from "./ParticipantUserItem";
import LogoLoading from "@/components/Loading/LogoLoading";
import { group } from "console";

function GroupCheckBox() {
  const { participantUser, searchingStatus, participantGroup, rejectedGroup } =
    useGroupStore();

  const renderingGroupState = () => {
    switch (searchingStatus) {
      case "모집":
        const partyUser = participantUser.filter(
          (user) => user.status !== "거절"
        );
        return (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">모집 중</p>
            <div className="flex w-full h-fit items-center">
              {partyUser.length === 0 && (
                <p className="text-mainGray text-sm">아직 참여자가 없습니다</p>
              )}
              {partyUser.map((user) => (
                <ParticipantUserItem key={user.handle} user={user} />
              ))}
            </div>
          </div>
        );
      case "참가":
        return (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">그룹 참가</p>
            <p>참가 중</p>
            <p>참가 상태 : {participantGroup.participant_status}</p>
          </div>
        );
      case "안함":
        return (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">그룹 참가</p>
            <p>그룹찾기를 통해 같이 게임 할 유저를 찾아보세요!</p>
            {rejectedGroup && rejectedGroup.length > 0 && (
              <div>
                <p>거절된 그룹</p>
                {rejectedGroup.map((group) => {
                  return (
                    <>
                      <p>{group.group_id}</p>
                      <p>거절이유 : {group.participant_status}</p>
                    </>
                  );
                })}
              </div>
            )}
          </div>
        );
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
