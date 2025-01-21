"use client";
import MainLayout from "@/components/Layout/MainLayout";
import supabase from "@/supabase/client";
import React from "react";

function SettingPage() {
  const handleReportClick = () => {};

  const handleLogoutClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error("로그아웃 실패");
    } else {
      window.location.reload();
    }
  };

  const handleDeleteAccountClick = () => {};

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full divide-y-[1px]">
        <button
          onClick={handleReportClick}
          className="w-full text-center py-4 font-bold hover:bg-subGray"
        >
          불편사항 신고
        </button>
        <button
          onClick={handleLogoutClick}
          className="w-full text-center py-4 font-bold hover:bg-subGray"
        >
          로그아웃
        </button>
        <button
          onClick={handleDeleteAccountClick}
          className="w-full text-center py-4 font-bold hover:bg-subGray text-warning"
        >
          회원탈퇴
        </button>
      </div>
    </MainLayout>
  );
}

export default SettingPage;
