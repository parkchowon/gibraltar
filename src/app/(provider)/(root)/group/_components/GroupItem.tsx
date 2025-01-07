import { GroupType } from "@/types/group.type";
import React from "react";
import GroupForm from "./GroupForm";
import FormItem from "./FormItem";
import { useGroupStore } from "@/stores/group.store";
import { useParticipantCreateMutation } from "@/hooks/useGroupMutation";

function GroupItem({
  group,
  userId,
}: {
  group: GroupType[number];
  userId: string;
}) {
  const { searchingStatus, participantPos } = useGroupStore();
  const mutation = useParticipantCreateMutation();

  const EmptyState = () => {
    return (
      <div className="flex items-center justify-center">
        <p className="text-sm">상관 없음</p>
      </div>
    );
  };

  const handleButtonClick = (groupId: string) => {
    if (userId === group.user_id) {
      // TODO: group 삭제
    } else {
      if (participantPos === "") {
        return confirm("역할군을 선택해주세요");
      } else if (searchingStatus === "모집") {
        return confirm("이미 모집하고 있는 그룹이 있습니다");
      } else if (searchingStatus === "참가") {
        return confirm("이미 참가 중인 그룹이 있습니다.");
      }
      return mutation.mutate({ groupId, userId });
    }
  };

  return (
    <div className="flex flex-col w-full h-fit px-5 py-3 mt-3 gap-4 border border-mainGray bg-subGray rounded-xl">
      <div className="flex items-center">
        <p className="outline-none font-semibold py-1 px-2 bg-transparent placeholder:text-mainGray whitespace-nowrap">
          {group.title}
        </p>
        <div className="flex rounded-full bg-mint px-3 py-1 gap-2 ml-auto">
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
                <FormItem key={pos} id={idx} label={pos} type="position" />
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
      <button
        disabled={group.group_status === "모집 완료"}
        onClick={() => handleButtonClick(group.id)}
        className={`rounded-full py-2 px-3 text-white disabled:bg-mainGray disabled:cursor-not-allowed ${
          userId === group.user_id ? "bg-warning" : "bg-black"
        }`}
      >
        {userId === group.user_id ? "삭제하기" : "참가하기"}
      </button>
    </div>
  );
}

export default GroupItem;
