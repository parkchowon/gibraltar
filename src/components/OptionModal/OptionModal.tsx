import React, { Dispatch, SetStateAction } from "react";
import ReactDOM from "react-dom";
import OptionItem from "./OptionItem";
import { useAuth } from "@/contexts/auth.context";
import { useQuery } from "@tanstack/react-query";
import { checkFollow } from "@/apis/follow.api";
import { deletePostType } from "@/types/home.type";

type OptionModalProps = {
  post: deletePostType;
  pos: number[];
  setOptionClick: Dispatch<SetStateAction<boolean>>;
};

function OptionModal({ post, pos, setOptionClick }: OptionModalProps) {
  const { user, isPending } = useAuth();

  const { data } = useQuery({
    queryKey: ["followCheck", post.postId],
    queryFn: () => checkFollow(user?.id ?? "", post.userId),
    enabled: !!user,
  });

  if (isPending) return;

  const handleBackGroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOptionClick(false);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div onClick={handleBackGroundClick} className={`absolute inset-0`}>
        <div
          className="absolute w-60 h-fit rounded-2xl bg-white shadow-md"
          style={{ top: `${pos[0]}px`, left: `${pos[1]}px` }}
        >
          {post.userId === user?.id ? (
            <OptionItem text="삭제하기" post={post} />
          ) : (
            <OptionItem
              text={data ? "언팔로우하기" : "팔로우하기"}
              post={post}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default OptionModal;
