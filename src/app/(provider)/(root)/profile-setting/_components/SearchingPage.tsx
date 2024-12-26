import LogoLoading from "@/components/Loading/LogoLoading";
import ProfileSettingContainer from "./ProfileSettingContainer";

function SearchingPage() {
  return (
    <ProfileSettingContainer title="나와 공통점이 있는 계정을 찾고 있어요.">
      <div className="w-[482px] h-[520px] border border-black rounded-xl">
        <LogoLoading />
      </div>
    </ProfileSettingContainer>
  );
}

export default SearchingPage;
