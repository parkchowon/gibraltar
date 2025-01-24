"use client";
import MainLayout from "@/components/Layout/MainLayout";
import supabase from "@/supabase/client";
import React, { useState } from "react";
import DeleteModal from "./_components/DeleteModal";
import ReportBugModal from "./_components/ReportBugModal";
import { toast } from "react-toastify";

function SettingPage() {
  const [isDeleteModalClick, setIsDeleteModalClick] = useState<boolean>(false);
  const [isReportModalClick, setIsReportModalClick] = useState<boolean>(false);

  const handleLogoutClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("로그아웃 실패. 다시 시도해주세요.");
      throw new Error("로그아웃 실패");
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {isDeleteModalClick && <DeleteModal setState={setIsDeleteModalClick} />}
      {isReportModalClick && (
        <ReportBugModal onClick={() => setIsReportModalClick(false)} />
      )}
      <div className="flex flex-col items-center justify-center w-full divide-y-[1px]">
        <button
          onClick={() => setIsReportModalClick(true)}
          className="w-full text-center py-4 hover:bg-subGray"
        >
          불편사항 신고
        </button>
        <button
          onClick={handleLogoutClick}
          className="w-full text-center py-4 hover:bg-subGray"
        >
          로그아웃
        </button>
        <button
          onClick={() => setIsDeleteModalClick(true)}
          className="w-full text-center py-4 font-bold hover:bg-subGray text-warning"
        >
          회원탈퇴
        </button>
      </div>
    </>
  );
}

export default SettingPage;
