import { reportPost } from "@/apis/post.api";
import { MAX_POST_TEXT_LENGTH } from "@/constants/post";
import { useAuth } from "@/contexts/auth.context";
import { useMutation } from "@tanstack/react-query";
import React, { useRef } from "react";
import { toast } from "react-toastify";

function ReportBugModal({ onClick }: { onClick: () => void }) {
  const reportRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { mutate } = useMutation({
    mutationFn: ({
      postId,
      userId,
      reason,
    }: {
      postId: string;
      userId: string;
      reason: string;
    }) => reportPost(postId, userId, reason),
    onSuccess: () => {
      toast.success("불편사항 접수 성공");
      onClick();
    },
    onError: () => {
      toast.error("접수 도중 에러 발생. 다시 시도해주세요.");
    },
  });

  const handleReportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (reportRef.current && reportRef.current.value !== "" && user) {
      mutate({ postId: "", userId: user.id, reason: reportRef.current.value });
    } else {
      toast.error("글을 작성해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-30">
      <div onClick={() => onClick()} className="absolute inset-0 z-40" />
      <form
        className="flex flex-col w-[80%] h-fit px-10 py-10 bg-white rounded-2xl gap-5 items-center justify-center z-50"
        z-20
      >
        <div>
          <p className="text-lg font-bold">어떤 불편사항을 겪으셨나요?</p>
          <p className="text-sm text-mainGray">
            더욱 더 편리한 서비스 제공을 위해 작성해주세요
          </p>
        </div>
        <textarea
          ref={reportRef}
          maxLength={MAX_POST_TEXT_LENGTH}
          placeholder="겪으신 불편사항을 적어주세요."
          className="w-full h-[200px] px-4 py-3 text-sm border border-mainGray rounded-2xl resize-none outline-none"
        />
        <button
          onClick={handleReportClick}
          className="w-40 px-4 py-2 bg-black rounded-full text-white"
        >
          접수하기
        </button>
      </form>
    </div>
  );
}

export default ReportBugModal;
