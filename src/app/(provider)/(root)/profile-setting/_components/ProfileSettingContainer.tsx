import { PropsWithChildren, useState } from "react";
import ProgressBar from "./ProgressBar";
import X from "@/assets/icons/x.svg";
import WarningModal from "./WarningModal";

type ProfileSettingProps = {
  title: string;
  sub?: string;
};

function ProfileSettingContainer({
  title,
  sub,
  children,
}: PropsWithChildren<ProfileSettingProps>) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleXClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center overflow-y-scroll">
      {isModalOpen && <WarningModal setState={setIsModalOpen} />}
      <div className="relative flex flex-col w-min-[28.4%] items-center">
        <ProgressBar />
        <button
          onClick={handleXClick}
          className="fixed right-10 lg:right-[21.1%]"
        >
          <X width={24} height={24} className="lg:w-6 lg:h-6 w-4 h-4" />
        </button>
        <div className="flex flex-col w-full lg:mt-16 mt-10 items-center">
          <div>
            <p className="lg:text-4xl text-2xl font-medium whitespace-pre-wrap">
              {title}
            </p>
            <p className="lg:text-base text-xs mt-2 lg:mt-[17px] font-medium">
              {sub}
            </p>
          </div>
          <div className="flex flex-col mx-auto items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingContainer;
