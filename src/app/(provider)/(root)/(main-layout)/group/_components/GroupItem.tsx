import { GroupItemType, GroupStatusType, GroupType } from "@/types/group.type";
import React, { useEffect, useState } from "react";
import GroupForm from "./GroupForm";
import FormItem from "./FormItem";
import { useGroupStore } from "@/stores/group.store";
import {
  useGroupDeleteMutation,
  useParticipantCreateMutation,
} from "@/hooks/useGroupMutation";
import LogoLoading from "@/components/Loading/LogoLoading";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

function GroupItem({
  group,
  userId,
  refetch,
}: {
  group: GroupType[number];
  userId: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<GroupStatusType, Error>>;
}) {
  const { searchingStatus, participantPos, participantGroup, participantUser } =
    useGroupStore();
  const mutation = useParticipantCreateMutation();
  const deleteMutation = useGroupDeleteMutation();

  const [partiGroup, setPartiGroup] = useState<GroupItemType>();
  const formattedUpdateAtString = group.update_at?.replace("+00:00", "") || "";
  const updateTime = new Date(formattedUpdateAtString);
  const now = new Date();
  const deletableTime = new Date(now.getTime() - 5 * 60 * 1000);

  useEffect(() => {
    setPartiGroup(
      participantGroup.find((parti) => parti.group_id === group.id)
    );
  }, [participantGroup]);

  const EmptyState = () => {
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm">상관 없음</p>
      </div>
    );
  };

  // 삭제하기 버튼 클릭 시
  const handleDeleteClick = () => {
    if (
      participantUser.filter((user) => user.status !== "거절").length > 0 &&
      group.group_status === "모집 중"
    ) {
      return confirm("참가중인 유저가 있으면 삭제할 수 없습니다.");
    } else if (
      group.group_status === "모집 완료" &&
      updateTime > deletableTime
    ) {
      return confirm("1시간은 지나야 삭제할 수 있습니다.");
    }

    // 삭제
    return deleteMutation.mutate({ groupId: group.id, userId });
  };

  // 참가하기 버튼 클릭 시
  const handleParticipantClick = (groupId: string) => {
    if (group.group_status !== "모집 중") {
      return confirm("이미 모집이 끝난 그룹입니다.");
    } else if (participantPos === "") {
      return confirm("역할군을 선택해주세요");
    } else if (searchingStatus === "모집") {
      return confirm("이미 모집하고 있는 그룹이 있습니다");
    } else if (searchingStatus === "참가") {
      return confirm("이미 참가 중인 그룹이 있습니다.");
    }
    refetch();

    return mutation.mutate({
      groupId,
      userId,
      groupOwnerId: group.user_id,
      position: participantPos,
    });
  };

  return (
    <div className="relative flex flex-col w-full h-fit px-5 py-4 mt-3 gap-4 border border-mainGray bg-subGray rounded-xl">
      {(mutation.isPending || deleteMutation.isPending) && (
        <div className="absolute inset-0 rounded-xl w-full h-full bg-black/35 z-20">
          <LogoLoading />
        </div>
      )}
      <div className="flex items-center">
        <p className="outline-none font-semibold py-1 px-2 bg-transparent placeholder:text-mainGray whitespace-nowrap">
          {group.title}
        </p>
        <div
          className={`flex rounded-full ${
            group.group_status === "모집 중" ? "bg-mint" : "bg-carrot"
          } px-3 py-1 gap-2 ml-auto`}
        >
          <p className="text-sm text-white">
            {`( ${group.participant_count} / `}
            {
              (group.position as string[]).filter(
                (pos) => pos !== "" && pos !== "X"
              ).length
            }
            {" )"}
          </p>
          <p className="text-sm text-white font-semibold">
            {group.group_status}
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <GroupForm title="모드">
          <FormItem label={group.mode} type="mode" />
        </GroupForm>
        <GroupForm title="포지션">
          <div className="flex gap-2">
            {(group.position as string[]).map((pos, idx) => {
              return (
                <FormItem
                  key={group.id + idx}
                  id={group.id + idx}
                  label={pos}
                  type="position"
                />
              );
            })}
          </div>
        </GroupForm>
        <GroupForm title="티어">
          {group.tier && group.tier.every((tier) => tier !== "") ? (
            <div className="flex gap-2 items-center">
              <FormItem type="tier" label={group.tier[0] as string} />
              <div className="w-3 h-[2px] rounded-full bg-mainGray" />
              <FormItem type="tier" label={group.tier[1] as string} />
            </div>
          ) : (
            EmptyState()
          )}
        </GroupForm>
        <GroupForm title="성향">
          {group.style ? (
            <FormItem label={group.style} type="type" />
          ) : (
            EmptyState()
          )}
        </GroupForm>
        <GroupForm title="마이크">
          {group.mic ? <FormItem type="mic" label={group.mic} /> : EmptyState()}
        </GroupForm>
      </div>
      <p className="text-sm px-3 py-1">{group.content}</p>
      {userId === group.user_id ? (
        <button
          onClick={handleDeleteClick}
          className={`rounded-full py-2 px-3 text-white bg-warning`}
        >
          삭제하기
        </button>
      ) : (
        <button
          disabled={searchingStatus === "모집"}
          onClick={() => handleParticipantClick(group.id)}
          className={`rounded-full py-2 px-3 ${
            !partiGroup && group.group_status !== "모집 중"
              ? "bg-white border border-mainGray text-mainGray cursor-not-allowed"
              : !partiGroup
              ? "bg-black text-white"
              : partiGroup.participant_status === "승인" &&
                group.id === partiGroup.group_id
              ? "bg-carrot text-white"
              : partiGroup.participant_status === "거절"
              ? "bg-mainGray text-white"
              : partiGroup.group_id === group.id
              ? "bg-mint text-white"
              : "bg-black text-white"
          } disabled:bg-mainGray disabled:cursor-not-allowed `}
        >
          {!partiGroup && group.group_status !== "모집 중"
            ? group.group_status
            : !partiGroup
            ? "참가하기"
            : partiGroup.participant_status === "승인" &&
              group.id === partiGroup.group_id
            ? "참가 완료"
            : partiGroup.participant_status === "거절"
            ? "거절 됨"
            : partiGroup.group_id === group.id
            ? "참가 중"
            : "참가하기"}
        </button>
      )}
    </div>
  );
}

export default GroupItem;
