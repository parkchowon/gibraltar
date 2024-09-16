import { PropsWithChildren } from "react";
import ProgressBar from "./ProgressBar";

type ProfileSettingProps = {
  title: string;
  sub: string;
};

function ProfileSettingContainer({
  title,
  sub,
  children,
}: PropsWithChildren<ProfileSettingProps>) {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <ProgressBar />
      <p>{title}</p>
      <p>{sub}</p>
      {children}
    </div>
  );
}

export default ProfileSettingContainer;
