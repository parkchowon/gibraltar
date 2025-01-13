import { updateGroupStatus, updateParticipantGroup } from "@/apis/group.api";
import LogoLoading from "@/components/Loading/LogoLoading";
import ProfileBtn from "@/components/ProfileBtn";
import { useGroupStore } from "@/stores/group.store";
import { ParticipantUserType } from "@/types/group.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Check from "@/assets/icons/check.svg";
import { PLAY_POSITION } from "@/constants/profile";
import Image from "next/image";

function ParticipantUserItem({
  user,
  lastUser,
}: {
  user: {
    id: string;
    profile_url: string;
    nickname: string;
    handle: string;
    status: string;
    position: string;
  };
  lastUser?: boolean;
}) {
  const { group } = useGroupStore();

  const positionIcon = PLAY_POSITION.find(
    (pos) => pos.name === user.position
  )?.icon;

  const queryClient = useQueryClient();

  const updatePartyMutation = useMutation({
    mutationFn: ({
      userId,
      groupId,
      status,
    }: {
      userId: string;
      groupId: string;
      status: string;
    }) => updateParticipantGroup(userId, groupId, status),
  });

  const updateGroupStatusMutation = useMutation({
    mutationFn: ({ groupId }: { groupId: string }) =>
      updateGroupStatus(groupId),
  });

  const handlePermissionClick = (status: string) => {
    updatePartyMutation.mutate({
      userId: user.id,
      groupId: group.id,
      status: status,
    });
    if (status === "승인" && lastUser) {
      updateGroupStatusMutation.mutate({ groupId: group.id });
    }
    return queryClient.refetchQueries({ queryKey: ["groupStatus"] });
  };

  if (user)
    return (
      <div className="relative flex w-full items-center bg-white border border-mainGray rounded-xl px-2 py-2">
        {updatePartyMutation.isPending && (
          <div className="absolute inset-0 bg-black/35 rounded-xl z-20 w-full h-full">
            <LogoLoading />
          </div>
        )}
        <ProfileBtn
          profileUrl={user.profile_url}
          handle={user.handle}
          intent={"post"}
        />
        <div className="ml-2">
          <div className="flex gap-1 items-center">
            <div className="w-fit h-fit rounded-full">
              {positionIcon ? (
                <Image
                  src={positionIcon}
                  alt={user.position}
                  width={15}
                  height={15}
                  className=""
                />
              ) : (
                <p>{user.position}</p>
              )}
            </div>
            <p className="font-semibold">{user.nickname}</p>
          </div>
          <p className="text-xs text-mainGray">{user.handle}</p>
        </div>
        <div className="flex gap-1 ml-auto">
          {user.status === "승인" ? (
            <button className="flex items-center gap-2 bg-carrot rounded-xl px-2 py-2">
              <p className="text-white text-sm">승인됨</p>
              <Check color="#ffffff" />
            </button>
          ) : (
            <>
              <button
                onClick={() => handlePermissionClick("거절")}
                className="w-fit h-fit px-2 py-1 text-mainGray border text-sm border-mainGray rounded-full"
              >
                거절
              </button>
              <button
                onClick={() => handlePermissionClick("승인")}
                className="w-fit h-fit px-2 py-1 text-white bg-carrot border border-carrot text-sm rounded-full"
              >
                수락
              </button>
            </>
          )}
        </div>
      </div>
    );
}

export default ParticipantUserItem;
