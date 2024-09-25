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
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col w-[546px] items-center">
        <ProgressBar />
        <div className="flex flex-col w-full mt-[84px]">
          <div className="pl-[70px]">
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
