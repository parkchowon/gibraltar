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
  return `${postYear}년 ${postYear}월 ${postDay}일`;
};
