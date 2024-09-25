import ProfileSettingContainer from "../ProfileSettingContainer";

function SettingText() {
  return (
    <ProfileSettingContainer
      title="마지막 단계예요!"
      sub="나를 표현하는 소개글을 적어보세요."
    >
      <textarea
        className="w-[404px] resize-none border-[1px] border-black rounded-[15px] h-[367px] px-6 py-5 my-[84px] outline-none"
        placeholder="저는 오버워치를 하는 홍길동이라고 해요"
      ></textarea>
    </ProfileSettingContainer>
  );
}

export default SettingText;
