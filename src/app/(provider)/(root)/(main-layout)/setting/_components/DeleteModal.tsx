import { deleteUser } from "@/apis/auth.api";
import supabase from "@/supabase/client";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

function DeleteModal({
  setState,
}: {
  setState: Dispatch<SetStateAction<boolean>>;
}) {
  const handleDeleteUserClick = async () => {
    await deleteUser();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("로그아웃 실패. 다시 시도해주세요.");
      throw new Error("로그아웃 실패");
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex flex-col w-96 h-fit px-10 py-10 bg-white rounded-2xl gap-2 items-center justify-center">
        <p className="font-bold text-xl">정말 계정을 삭제하시겠습니까?</p>
        <div>
          <p className="text-mainGray">
            &middot; 계정의 모든 것들이{" "}
            <span className="text-warning font-bold">삭제</span> 되고{" "}
            <span className="text-warning font-bold">
              다시 되돌릴 수 없습니다.
            </span>
          </p>
        </div>
        <div className="flex mt-6 w-full justify-evenly">
          <button
            onClick={() => setState(false)}
            className="px-3 py-1 w-24 bg-mainGray rounded-full text-white"
          >
            윈니오
          </button>
          <button
            onClick={handleDeleteUserClick}
            className="px-3 py-1 w-40 font-semibold bg-warning rounded-full text-white"
          >
            삭제합니다
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
