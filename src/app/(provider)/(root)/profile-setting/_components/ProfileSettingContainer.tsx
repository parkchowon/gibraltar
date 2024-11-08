import { PropsWithChildren } from "react";
import ProgressBar from "./ProgressBar";

type ProfileSettingProps = {
  title: string;
  sub?: string;
};

function ProfileSettingContainer({
  title,
  sub,
  children,
}: PropsWithChildren<ProfileSettingProps>) {
  // TODO: 최초 가입의 profile setting을 나갈 수 있는 버튼을 만들어야 함
  // TODO: x를 누르면 무조건 user_profiles 테이블에 row저장.(최초가입자인지 판별..)
  // TODO: css %로 바꿔서 크기 맞추기
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-y-scroll">
      <div className="flex flex-col w-min-[546px] items-center">
        <ProgressBar />
        <div className="flex flex-col w-full mt-[84px] items-center">
          <div>
            <p className="text-[40px] font-medium whitespace-pre-wrap">
              {title}
            </p>
            <p className="mt-[17px] font-medium">{sub}</p>
          </div>
          <div className="flex flex-col mx-auto items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingContainer;
