import React from "react";
import ReactDOM from "react-dom";
import { REPORT_LIST } from "@/constants/post";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth.context";
import { reportPost } from "@/apis/post.api";
import { toast } from "react-toastify";

function ReportModal({
  postId,
  onClick,
}: {
  postId: string;
  onClick: () => void;
}) {
  const { user } = useAuth();
  const { mutate } = useMutation({
    mutationKey: ["reports", user?.id],
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
      toast.success("신고가 접수되었습니다.");
      onClick();
    },
    onError: () => {
      toast.error("신고 접수 중 에러 발생하였습니다.");
    },
  });
  const handleReportClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    reason: string
  ) => {
    e.stopPropagation();
    if (user) {
      mutate({ userId: user.id, postId: postId, reason: reason });
    }
  };

  return ReactDOM.createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex items-center justify-center w-full h-screen bg-black/30 z-50"
    >
      <div className="flex flex-col lg:w-[600px] w-[300px] h-fit bg-white rounded-2xl gap-2 items-center justify-center">
        <div className="flex flex-col w-full divide-y-[1px] divide-mainGray">
          <p className="text-lg w-full py-4 px-10 bg-subGray mt-10">
            해당 포스트에 어떤 문제가 있나요?
          </p>
          {REPORT_LIST.map((report) => {
            return (
              <button
                onClick={(e) => handleReportClick(e, report.reason)}
                key={report.id}
                className={`py-2 hover:bg-subGray ${
                  report.id === 4 && "rounded-b-2xl"
                }`}
              >
                {report.reason}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ReportModal;
