import GibraltarLogo from "@/assets/logo/gibraltar_logo.svg";

function InfoPage() {
  return (
    <div className="flex flex-col w-full py-20 items-center justify-center">
      <div className="w-fit h-fit opacity-25">
        <GibraltarLogo width={45} height={45} />
      </div>
      <p className="text-base text-mainGray">이 페이지는 준비 중입니다</p>
      <p className="text-base text-mainGray">빠른 시일 내로 준비하겠습니다</p>
    </div>
  );
}

export default InfoPage;
