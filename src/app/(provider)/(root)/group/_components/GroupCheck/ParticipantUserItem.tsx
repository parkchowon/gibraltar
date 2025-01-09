import { updateParticipantGroup } from "@/apis/group.api";
import LogoLoading from "@/components/Loading/LogoLoading";
import ProfileBtn from "@/components/ProfileBtn";
import { useGroupStore } from "@/stores/group.store";
import { ParticipantUserType } from "@/types/group.type";
import { useMutation } from "@tanstack/react-query";
import Check from "@/assets/icons/check.svg";

function ParticipantUserItem({
  user,
}: {
  user: {
    id: string;
    profile_url: string;
    nickname: string;
    handle: string;
    status: string;
  };
}) {
  const { groupId } = useGroupStore();
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
  const handlePermissionClick = (status: string) => {
    updatePartyMutation.mutate({
      userId: user.id,
      groupId: groupId,
      status: status,
    });
  };

  if (user)
    return (
      <div className="flex w-full items-center bg-white border border-mainGray rounded-xl px-2 py-1">
        {updatePartyMutation.isPending && <LogoLoading />}
        <ProfileBtn
          profileUrl={user.profile_url}
          handle={user.handle}
          intent={"post"}
        />
        <div className="ml-2">
          <p className="font-semibold">{user.nickname}</p>
          <p className="text-sm text-mainGray">{user.handle}</p>
        </div>
        <div className="flex gap-2 ml-auto">
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
