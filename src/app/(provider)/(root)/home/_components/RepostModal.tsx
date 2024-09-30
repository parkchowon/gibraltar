import { insertRepost } from "@/apis/post.api";
import { useAuth } from "@/contexts/auth.context";
import { usePostStore } from "@/stores/post.store";

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
  const { setIsModalOpen, modal } = usePostStore();
  const { user } = useAuth();

  const handleRepostClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    text: string
  ) => {
    e.stopPropagation();
    if (user) {
      if (text === "재게시") {
        await insertRepost(modal.postId, user.id);
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
