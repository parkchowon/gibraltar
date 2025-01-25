import { PLAY_MODE, PLAY_STYLE, PLAY_TIME } from "@/constants/profile";
import { useProfileStore } from "@/stores/profile.store";
import { useEffect, useState } from "react";
import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingPlaying() {
  const [modeClick, setModeClick] = useState<string[]>([]);
  const [styleClick, setStyleClick] = useState<string>("");
  const [timeClick, setTimeClick] = useState<string[]>([]);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const { putPlayStyle } = useProfileStore();

  useEffect(() => {
    // 다 클릭 해야 버튼 활성화
    setCheckPass(!!modeClick.length && !!styleClick && !!timeClick.length);
  }, [modeClick, styleClick, timeClick]);

  // mode 클릭 시
  const handleModeClick = (mode: string) => {
    if (modeClick.includes(mode)) {
      setModeClick(modeClick.filter((item) => item !== mode));
    } else {
      setModeClick([...modeClick, mode]);
    }
  };

  // 플레이 성향 클릭 시
  const handleStyleClick = (style: string) => {
    setStyleClick(style);
  };

  // 접속 시간 클릭 시
  const handleTimeClick = (time: string) => {
    if (timeClick.includes(time)) {
      setTimeClick(timeClick.filter((item) => item !== time));
    } else {
      setTimeClick([...timeClick, time]);
    }
  };

  const handleSubmit = async () => {
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
      <div className="lg:w-[404px] w-[280px] mt-[66px] mb-[44px]">
        <p className="font-bold lg:mb-6 mb-2 lg:text-base text-sm">
          내가 즐겨 하는 모드는...
        </p>
        <div className="grid grid-cols-4 h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-xl lg:rounded-2xl">
          {PLAY_MODE.map((mode) => {
            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.name)}
                className={`${
                  modeClick.includes(mode.name) ? "bg-mint" : null
                } ${mode.id === 1 ? "lg:rounded-l-xl rounded-l-lg" : null} ${
                  mode.id === 4 ? "lg:rounded-r-xl rounded-r-lg" : null
                } lg:text-base text-sm`}
              >
                {mode.name}
              </button>
            );
          })}
        </div>
        <p className="font-medium text-xs lg:text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
        <div className="mt-[23px] mb-[45px]">
          <p className="font-bold lg:mb-6 mb-2 lg:text-base text-sm">
            나의 플레이 성향은...
          </p>
          <div className="grid grid-cols-2 h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-xl lg:rounded-2xl">
            {PLAY_STYLE.map((style) => {
              return (
                <button
                  key={style.id}
                  className={`${styleClick === style.name ? "bg-mint" : null} ${
                    style.id === 1
                      ? "lg:rounded-l-xl rounded-l-lg"
                      : "lg:rounded-r-xl rounded-r-lg"
                  } lg:text-base text-sm`}
                  onClick={() => handleStyleClick(style.name)}
                >
                  {style.name}
                </button>
              );
            })}
          </div>
        </div>
        <p className="font-bold lg:mb-6 mb-2 lg:text-base text-sm">
          게임에 접속하는 시간은...
        </p>
        <div className="grid grid-cols-4 h-10 lg:h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-xl lg:rounded-2xl">
          {PLAY_TIME.map((time) => {
            return (
              <button
                key={time.id}
                onClick={() => handleTimeClick(time.name)}
                className={`${
                  timeClick.includes(time.name) ? "bg-mint" : null
                } ${time.id === 1 ? "lg:rounded-l-xl rounded-l-lg" : null} ${
                  time.id === 4 ? "lg:rounded-r-xl rounded-r-lg" : null
                } lg:text-base text-sm`}
              >
                {time.name}
              </button>
            );
          })}
        </div>
        <p className="font-medium text-xs lg:text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
      </div>
      <NextStepButton isClickable={checkPass} onClick={handleSubmit} />
    </ProfileSettingContainer>
  );
}

export default SettingPlaying;
