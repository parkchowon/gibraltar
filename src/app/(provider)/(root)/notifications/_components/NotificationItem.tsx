import React from "react";

function NotificationItem() {
  return (
    <div className="flex w-full px-[25px] py-[15px] gap-6">
      <div className="w-[46px] h-[46px] rounded-full bg-gray-50 flex-shrink-0"></div>
      <div className="flex flex-col flex-grow gap-2.5">
        <p className="text-base">
          <span className="font-bold">유저 1293</span> 님이 회원님의 포스트를
          재게시했습니다.
        </p>
        <p className=" line-clamp-2 text-gray-400">
          트윗을 써보았어요 ㅋㅋ 아 근데 그건 진짜 개웃겼음 트윗을
          써보았어요트윗을 써보았어요 ㅋㅋ 아 근데 그건 진짜 개웃겼음 트윗을아
        </p>
      </div>
    </div>
  );
}

export default NotificationItem;
