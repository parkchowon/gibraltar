import { insertRepost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { usePostStore } from "@/stores/post.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const REPOST_LIST = [
  {
    id: 1,
    name: "재게시",
  },
  {
    id: 2,
    name: "인용하기",
  },
];

function RepostModal({ postUserId }: { postUserId: string }) {
  const { setIsModalOpen, modal } = usePostStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => insertRepost(modal.postId, user?.id, postUserId),
    // 낙관적 업데이트
    onMutate: async () => {
      // 업데이트 전 타임라인 데이터
      const prevTimeline = queryClient.getQueryData(["timelineData"]);
      // overwrite 방지를 위해 취소시킴
      await queryClient.cancelQueries({ queryKey: ["timelineData"] });
      // 미리 UI 적용
      queryClient.setQueryData(["timelineData"], "");
      // 에러나면 이전 것을..
      return () => queryClient.setQueryData(["timelineData"], prevTimeline);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["timelineData"],
      });
    },
  });

  const handleRepostClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    text: string
  ) => {
    e.stopPropagation();
    if (user) {
      if (text === "재게시") {
        mutate();
      }
    }
    setIsModalOpen();
  };

  return (
    <div onClick={setIsModalOpen} className={`fixed w-screen h-full z-30`}>
      <div
        className="absolute flex flex-col w-[80px] h-fit rounded-xl bg-white"
        style={{ top: `${modal.top}px`, left: `${modal.left}px` }}
      >
        {REPOST_LIST.map((repost) => {
          return (
            <button
              className="px-1 py-2"
              onClick={(e) => handleRepostClick(e, repost.name)}
              key={repost.id}
            >
              {repost.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RepostModal;
