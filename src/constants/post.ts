// post에 들어갈 text의 최대길이
export const MAX_POST_TEXT_LENGTH = 300;

// post 불러오는 갯수
export const POST_SIZE = 10;
export const NOTIFICATION_SIZE = 10;

export const IMAGE_MAX_SIZE = 3 * 1024 * 1024; // 2mb
export const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50mb

export const REPORT_LIST = [
  { id: 0, reason: "의심스럽거나 스팸입니다." },
  { id: 1, reason: "민감한 사진 또는 동영상을 보여주고 있습니다." },
  { id: 2, reason: "가학적이거나 유해한 내용입니다." },
  { id: 3, reason: "오해의 소지가 있습니다." },
  { id: 4, reason: "자해 또는 자살 의도를 표현하고 있습니다." },
];
