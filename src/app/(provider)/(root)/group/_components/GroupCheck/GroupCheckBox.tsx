import { useGroupStore } from "@/stores/group.store";
import React from "react";
import ParticipantUserItem from "./ParticipantUserItem";
import LogoLoading from "@/components/Loading/LogoLoading";
import ParticipantGroupItem from "./ParticipantGroupItem";

function GroupCheckBox() {
  const {
    participantUser,
    searchingStatus,
    participantGroup,
    rejectedGroup,
    group,
  } = useGroupStore();

  const groupCount = (group.position as string[]).filter(
    (pos) => pos !== "" && pos !== "X"
  ).length;

  const renderingGroupState = () => {
    switch (searchingStatus) {
      case "모집":
        const partyUser = participantUser.filter(
          (user) => user.status !== "거절"
        );
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-center">
              <p className="font-semibold">모집 중</p>
              <div className="flex items-center px-2 bg-carrot rounded-full">
                <p className="text-sm text-white font-semibold flex items-center justify-center">
                  {`(${
                    partyUser.filter((user) => user.status === "승인").length
                  }/`}
                  {groupCount}
                  {")"}
                </p>
              </div>
            </div>
            <div className="flex w-full h-fit items-center">
              {partyUser.length === 0 && (
                <p className="text-mainGray text-sm">아직 참여자가 없습니다</p>
              )}
              {partyUser.length > 0 && (
                <div className="flex flex-col w-full h-fit gap-3">
                  <div className="bg-white rounded-lg p-1">
                    <p className="text-sm text-mainGray">
                      &middot; 승인을 누르면 상대방에게 배틀태그가 보여집니다.
                    </p>
                    <p className="text-sm text-mainGray">
                      &middot; 모집 완료 후, 1시간이 지나야 삭제가 가능합니다.
                    </p>
                  </div>
                  {partyUser.map((user) => (
                    <ParticipantUserItem
                      key={user.handle}
                      user={user}
                      lastUser={partyUser.length === groupCount}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "참가":
        return (
          <div className="flex flex-col gap-4">
            <p className="font-semibold">그룹 참가</p>
            <div className="flex flex-col">
              {participantGroup.map((group) => {
                return (
                  <ParticipantGroupItem key={group.group_id} group={group} />
                );
              })}
            </div>
          </div>
        );
      case "안함":
        return (
          <div className="flex flex-col gap-3">
            <p className="font-semibold">그룹 찾기</p>
            <p className="text-sm text-mainGray">
              그룹찾기를 통해 같이 게임 할 유저를 찾아보세요!
            </p>
            {rejectedGroup && rejectedGroup.length > 0 && (
              <div>
                <p>거절된 그룹</p>
                {rejectedGroup.map((group) => {
                  return (
                    <ParticipantGroupItem key={group.group_id} group={group} />
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
