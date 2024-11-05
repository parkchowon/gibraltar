import { USER_STATUS } from "@/constants/status";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import UserStatus from "./UserStatus";
import { useStatusMutation } from "@/hooks/useStatusMutation";

function StatusModal({
  userId,
  setStatusClick,
}: {
  userId: string;
  setStatusClick: Dispatch<SetStateAction<boolean>>;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // 유저 상태 낙관적 업데이트
  const { mutate } = useStatusMutation(userId);

  // modal 바깥쪽 클릭 시 모달 닫힘
  useEffect(() => {
    const handleClickOut = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setStatusClick(false);
      }
    };
    document.addEventListener("mousedown", handleClickOut);
    return () => {
      document.removeEventListener("mousedown", handleClickOut);
    };
  }, [setStatusClick]);

  // state 클릭 시 state 저장
  const handleStateClick = (state: string) => {
    mutate(state);
    setStatusClick(false);
  };

  return (
    <div
      ref={modalRef}
      className="absolute top-0 -left-2 w-[124px] h-fit bg-white rounded-xl border-[#B2B2B2] border-[1px] py-[9px] px-[5px] shadow-xl shadow-gray-400 z-30"
    >
      {USER_STATUS.map((status) => {
        return (
          <button
            key={status.id}
            onClick={() => handleStateClick(status.state)}
            className="flex w-full"
          >
            <UserStatus status={status} intent="modal" />
          </button>
        );
      })}
    </div>
  );
}

export default StatusModal;
