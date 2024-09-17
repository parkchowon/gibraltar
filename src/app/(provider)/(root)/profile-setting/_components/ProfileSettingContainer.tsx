import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step");

  const handleClickNext = () => {
    router.push(`/profile-setting?step=${Number(step) + 1}`);
  };

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center">
      <div className="flex flex-col w-[546px] items-center">
        <ProgressBar />
        <div className="flex flex-col w-full mt-[84px] items-center">
          <div>
            <p className="text-[40px] font-medium">{title}</p>
            <p className="mt-[17px] font-medium">{sub}</p>
          </div>
          {children}
          <button
            onClick={handleClickNext}
            className="w-[352px] bg-mint rounded-full py-[19px] font-medium text-xl text-[#6A6A6A]"
          >
            다음단계로
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingContainer;
