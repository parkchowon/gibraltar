import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingPlaying() {
  return (
    <ProfileSettingContainer
      title="플레이 성향을 알려주세요."
      sub="입력한 정보를 기반으로 잘 맞는 친구를 소개해드릴게요!"
    >
      <div className="w-[404px] mt-[66px] mb-[44px]">
        <p className="font-bold mb-6">내가 즐겨 하는 모드는...</p>
        <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
          <button>빠른대전</button>
          <button>경쟁전</button>
          <button>아케이드</button>
          <button>사설방</button>
        </div>
        <p className="font-medium text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
        <div className="mt-[23px] mb-[45px]">
          <p className="font-bold mb-6">나의 플레이 성향은...</p>
          <div className="grid grid-cols-2 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
            <button>즐겁게</button>
            <button>빡세게</button>
          </div>
        </div>
        <p className="font-bold mb-6">게임에 접속하는 시간은...</p>
        <div className="grid grid-cols-4 h-[52px] font-medium divide-x-2 divide-mint border-mint border-2 rounded-2xl">
          <button>오전</button>
          <button>오후</button>
          <button>밤</button>
          <button>새벽</button>
        </div>
        <p className="font-medium text-sm text-gray-600 text-center mt-3">
          다중 선택이 가능해요.
        </p>
      </div>
    </ProfileSettingContainer>
  );
}

export default SettingPlaying;
