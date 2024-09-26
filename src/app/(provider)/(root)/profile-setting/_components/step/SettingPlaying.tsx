import { PLAY_MODE, PLAY_STYLE, PLAY_TIME } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { useEffect, useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingPlaying() {
  const [modeClick, setModeClick] = useState<number[]>([]);
  const [styleClick, setStyleClick] = useState<number>(0);
  const [timeClick, setTimeClick] = useState<number[]>([]);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const { putPlayStyle } = useProfileStore();

  useEffect(() => {
    // 다 클릭 해야 버튼 활성화
    setCheckPass(!!modeClick.length && !!styleClick && !!timeClick.length);
  }, [modeClick, styleClick, timeClick]);

  // mode 클릭 시
  const handleModeClick = (mode: number) => {
    if (modeClick.includes(mode)) {
      setModeClick(modeClick.filter((item) => item !== mode));
    } else {
      setModeClick([...modeClick, mode]);
    }
  };

  // 플레이 성향 클릭 시
  const handleStyleClick = (style: number) => {
    setStyleClick(style);
  };

  // 접속 시간 클릭 시
  const handleTimeClick = (time: number) => {
    if (timeClick.includes(time)) {
      setTimeClick(timeClick.filter((item) => item !== time));
    } else {
      setTimeClick([...timeClick, time]);
    }
  };

  const handleSubmit = () => {
    console.log("step2 is clicked");
    console.log(modeClick, styleClick, timeClick);
    putPlayStyle({
      mode: modeClick,
      style: styleClick,
      time: timeClick,
    });
  };

  return (
    <ProfileSettingContainer
      title="플레이 성향을 알려주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="w-[404px] mt-[66px] mb-[44px]">
        <p className="font-bold mb-6">내가 즐겨 하는 모드는...</p>
        <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
          {PLAY_MODE.map((mode) => {
            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                className={`${modeClick.includes(mode.id) ? "bg-mint" : null} ${
                  mode.id === 1 ? "rounded-l-xl" : null
                } ${mode.id === 4 ? "rounded-r-xl" : null}`}
              >
                {mode.name}
              </button>
            );
          })}
        </div>
        <p className="font-medium text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
        <div className="mt-[23px] mb-[45px]">
          <p className="font-bold mb-6">나의 플레이 성향은...</p>
          <div className="grid grid-cols-2 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
            {PLAY_STYLE.map((style) => {
              return (
                <button
                  key={style.id}
                  className={`${styleClick === style.id ? "bg-mint" : null} ${
                    style.id === 1 ? "rounded-l-xl" : "rounded-r-xl"
                  }`}
                  onClick={() => handleStyleClick(style.id)}
                >
                  {style.name}
                </button>
              );
            })}
          </div>
        </div>
        <p className="font-bold mb-6">게임에 접속하는 시간은...</p>
        <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
          {PLAY_TIME.map((time) => {
            return (
              <button
                key={time.id}
                onClick={() => handleTimeClick(time.id)}
                className={`${timeClick.includes(time.id) ? "bg-mint" : null} ${
                  time.id === 1 ? "rounded-l-xl" : null
                } ${time.id === 4 ? "rounded-r-xl" : null}`}
              >
                {time.name}
              </button>
            );
          })}
        </div>
        <p className="font-medium text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
      </div>
      <NextStepButton isClickable={checkPass} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingPlaying;
