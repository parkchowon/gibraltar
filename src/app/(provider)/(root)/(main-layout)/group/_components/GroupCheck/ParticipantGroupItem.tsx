import { PLAY_POSITION } from "@/constants/profile";
import { GroupItemType } from "@/types/group.type";
import Image from "next/image";
import React from "react";

function ParticipantGroupItem({ group }: { group: GroupItemType }) {
  const positionIcon = PLAY_POSITION.find(
    (pos) => pos.name === group.party_position
  )?.icon;

  return (
    <div className="flex flex-col gap-3 bg-white border border-mainGray rounded-xl py-2 px-3">
      <div className="flex justify-between">
        <p className="font-semibold">{group.group.title}</p>
        <p
          className={`px-2 ${
            group.group.group_status === "모집 완료" ? "bg-carrot" : "bg-mint"
          } rounded-full text-white flex items-center justify-center text-sm`}
        >
          {group.group.group_status}
        </p>
      </div>
      <div className="flex justify-center gap-2">
        <div className="flex flex-col gap-1 p-2 items-center border border-mainGray rounded-xl">
          <p className="font-semibold text-sm">포지션</p>
          {positionIcon ? (
            <Image
              src={positionIcon}
              alt={group.party_position}
              width={20}
              height={20}
            />
          ) : (
            <p className="text-sm">{group.party_position}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 p-2 items-center border border-mainGray rounded-xl">
          <p className="font-semibold text-sm">게임 모드</p>
          <p className="text-sm">{group.group.mode}</p>
        </div>
        <div className="flex flex-col gap-1 p-2 items-center border border-mainGray rounded-xl">
          <p className="font-semibold text-sm">참가 상태</p>
          <p className="text-sm">{group.participant_status}</p>
        </div>
      </div>
      {group.group.battle_tag && group.participant_status === "승인" && (
        <div className="flex items-center w-full rounded-full gap-2 border border-carrot bg-carrot pl-3">
          <p className="text-sm text-left text-white font-semibold">
            배틀태그{" "}
          </p>
          <span className="bg-white px-3 py-1 flex-grow text-sm rounded-full font-bold">
            {group.group.battle_tag}
          </span>
        </div>
      )}
    </div>
  );
}

export default ParticipantGroupItem;
