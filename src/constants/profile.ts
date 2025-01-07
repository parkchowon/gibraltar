export const PLAY_MODE = [
  {
    id: 1,
    name: "빠른대전",
    icon: "game/mode/quick_mode",
  },
  {
    id: 2,
    name: "경쟁전",
    icon: "game/mode/rank_mode",
  },
  {
    id: 3,
    name: "아케이드",
    icon: "game/mode/arcade_mode",
  },
  {
    id: 4,
    name: "사설방",
    icon: "game/mode/user_edit_mode",
  },
];

export const PLAY_STYLE = [
  {
    id: 1,
    name: "즐겁게",
    icon: "game/style/joy",
  },
  {
    id: 2,
    name: "빡세게",
    icon: "game/style/hard",
  },
];

export const PLAY_TIME = [
  { id: 1, name: "오전" },
  { id: 2, name: "오후" },
  { id: 3, name: "저녁" },
  { id: 4, name: "새벽" },
];

export const PLAY_POSITION = [
  {
    id: "tank",
    name: "돌격",
    color: "#f0f0f0",
    icon: "/icons/position/tank_icon.svg",
    svg: "position/tank_icon",
  },
  {
    id: "damage",
    name: "공격",
    color: "#d7d7d7",
    icon: "/icons/position/deal_icon.svg",
    svg: "position/deal_icon",
  },
  {
    id: "support",
    name: "지원",
    color: "#bcbcbc",
    icon: "/icons/position/heal_icon.svg",
    svg: "position/heal_icon",
  },
];

export const COMMUNICATION = [
  { id: "off", name: "사용안함", icon: "mic_off" },
  { id: "game", name: "인게임", icon: "overwatch_logo" },
  { id: "discord", name: "디스코드", icon: "discord_logo" },
];
