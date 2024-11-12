import { insertRepost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { usePostStore } from "@/stores/post.store";
import ReactDOM from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PostType } from "@/types/home.type";

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

function RepostModal() {
  const { modal, setIsModalOpen } = usePostStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => insertRepost(modal.postId, user?.id, modal.postUserId),
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

  const handleRepostClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    text: string
  ) => {
    e.stopPropagation();
    if (user) {
      if (text === "재게시") {
        setIsModalOpen("closed");
        mutate();
      }
      if (text === "인용하기") {
        // router.push(`/home?quote`);
        setIsModalOpen("quote");
      }
    }
  };

  return ReactDOM.createPortal(
    <div
      onClick={() => setIsModalOpen("closed")}
      className={`fixed inset-0 w-screen h-full z-30`}
    >
      <div
        className="absolute flex flex-col w-[80px] h-fit rounded-xl bg-white"
        style={{ top: `${modal.top}px`, left: `${modal.left}px` }}
      >
        {REPOST_LIST.map((repost) => {
          return (
            <button
              className={`px-1 py-2 hover:bg-gray-100 ${
                repost.id === 1 ? "hover:rounded-t-xl" : "hover:rounded-b-xl"
              }`}
              onClick={(e) => handleRepostClick(e, repost.name)}
              key={repost.id}
            >
              {repost.name}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}

export default RepostModal;
