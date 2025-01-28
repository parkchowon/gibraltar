import { NotificationType } from "@/types/notification.type";

// post 날짜 표시 함수
export const formatToPostDate = (postTimeStamp: string) => {
  // 한국 현재 시간
  const now = new Date();
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const currentTimeStamp = new Date(
    now.getTime() + koreaTimeDiff
  ).toISOString();

  const [currentDate, currentTime] = currentTimeStamp.split("T");
  const [postDate, postTime] = postTimeStamp.split("T");

  // 날짜
  const [currentYear, currentMonth, currentDay] = currentDate.split("-");
  const [postYear, postMonth, postDay] = postDate.split("-");

  // 시간
  const [currentHour, currentMin, currentSec] = currentTime
    .split(".")[0]
    .split(":");
  const [postHour, postMin, postSec] = postTime.split(".")[0].split(":");

  // 어제 쓰인 것
  console.log("작성날짜: ", postDate, "지금 날짜:", currentDate);
  if (Number(postDay) === Number(currentDay) - 1) {
    return `${24 - Number(currentHour) - Number(postHour)}시간 전`;
  }

  // 오늘 쓰인 post의 time
  if (postDate === currentDate) {
    return postHour !== currentHour
      ? `${Number(currentHour) - Number(postHour)}시간 전`
      : postMin !== currentMin
      ? `${Number(currentMin) - Number(postMin)}분 전`
      : postSec !== currentSec
      ? `${Number(currentSec) - Number(postSec)}초 전`
      : "방금";
  }

  // 현재 년도에 쓰여진 post의 time
  if (postYear === currentYear) {
    return `${postMonth}월 ${postDay}일`;
  }

  // 현재 년도가 아닌 post의 time
  return `${postYear}년 ${postMonth}월 ${postDay}일`;
};

// 알림 페이지 reactedUser 데이터 배열 재구성 함수
export const userDataReducer = (post: NotificationType[]) => {
  const result = post.reduce(
    (acc, repost) => {
      if (repost.reacted_user) {
        acc.nicknames.push(repost.reacted_user.nickname);
        acc.profileUrls.push(repost.reacted_user.profile_url);
        acc.handles.push(repost.reacted_user.handle);
      }
      return acc;
    },
    {
      nicknames: [] as string[],
      profileUrls: [] as string[],
      handles: [] as string[],
    }
  );
  return result;
};

export const generateFilePathWithUnicode = (fileName: string) => {
  const changeFileName = fileName
    .split("")
    .map((char) => (char.charCodeAt(0) > 127 ? `u${char.charCodeAt(0)}` : char))
    .join("");

  return changeFileName;
};
