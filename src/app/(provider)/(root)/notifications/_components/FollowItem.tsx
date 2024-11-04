import React from "react";

function FollowItem() {
  return (
    <div className="flex items-center w-full px-[25px] py-[15px] gap-6">
      <div className="w-[46px] h-[46px] rounded-full bg-gray-50 flex-shrink-0"></div>
      <p>
        <span className="font-bold">유저 1923</span> 님이 회원님을 팔로우하기
        시작했습니다.
      </p>
      <button className="text-sm font-semibold px-9 py-2.5 ml-auto bg-gray-50 rounded-[10px]">
        팔로우
      </button>
    </div>
  );
}

export default FollowItem;
