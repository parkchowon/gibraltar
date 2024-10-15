import NextStepButton from "../NextStepButton";
import ProfileSettingContainer from "../ProfileSettingContainer";

function FollowUser() {
  const handleSubmit = () => {};

  // TODO supabase 취향? 테이블에서 비슷한 유저 찾아오기
  return (
    <ProfileSettingContainer title={"나와 공통점이 있는 계정을\n1개 찾았어요!"}>
      <div></div>
      <NextStepButton
        isClickable={true}
        text="지브롤터 시작하기"
        onClick={handleSubmit}
      />
    </ProfileSettingContainer>
  );
}

export default FollowUser;
