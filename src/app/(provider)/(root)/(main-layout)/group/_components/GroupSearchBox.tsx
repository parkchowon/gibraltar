import React, { useRef } from "react";
import GroupForm from "./GroupForm";
import SelectOption from "./SelectOption";
import { useGroupStore } from "@/stores/group.store";
import { useGroupCreateMutation } from "@/hooks/useGroupMutation";
import { useAuth } from "@/contexts/auth.context";
import LogoLoading from "@/components/Loading/LogoLoading";
import { invalidCheckBattleTag } from "@/utils/invalidCheck";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function GroupSearchBox() {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const battleTagRef = useRef<HTMLInputElement>(null);

  const { mode, position, tier, style, mic, searchingStatus } = useGroupStore();
  const { user } = useAuth();

  const mutation = useGroupCreateMutation();

  const handleSubmitClick = () => {
    if (titleRef.current && !titleRef.current.value) {
      return confirm("제목을 비워둘 수 없습니다");
    } else if (battleTagRef.current && !battleTagRef.current.value) {
      return confirm("배틀태그를 비워둘 수 없습니다");
    } else if (
      battleTagRef.current &&
      !invalidCheckBattleTag(battleTagRef.current.value)
    ) {
      return confirm("배틀태그의 형식이 맞지 않습니다.");
    } else if (contentRef.current && !contentRef.current.value) {
      return confirm("내용을 비워둘 수 없습니다");
    } else if (mode === "") {
      return confirm("모드를 비워둘 수 없습니다");
    } else if (position.every((pos) => pos === "X" || pos === "")) {
      return confirm("구하는 포지션을 선택해 주세요");
    } else if (
      !tier.every((tier) => tier === "") &&
      tier[0] + tier[1] === (tier[0] || tier[1])
    ) {
      return confirm("티어는 하나만 채워둘 수 없습니다");
    }

    if (
      titleRef.current &&
      contentRef.current &&
      battleTagRef.current &&
      user &&
      searchingStatus === "안함"
    ) {
      mutation.mutate({
        userId: user.id,
        title: titleRef.current.value,
        content: contentRef.current.value,
        battleTag: battleTagRef.current.value,
        mode,
        position,
        tier,
        style,
        mic,
      });
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (searchingStatus === "모집") {
      e.stopPropagation();
      confirm("이미 생성한 그룹이 있습니다.");
    } else if (searchingStatus === "참가") {
      e.stopPropagation();
      confirm("이미 참가한 그룹이 있습니다.");
    }
  };

  return (
    <>
      <div className="flex lg:hidden flex-col w-full justify-center items-center px-4 py-20 opacity-35 gap-4">
        <Logo width={40} height={40} />
        <p className="w-full text-center text-sm">
          모바일에서는 그룹 찾기를 지원하고 있지 않습니다.
        </p>
      </div>
      <div
        onClick={handleInputClick}
        className="relative hidden lg:flex flex-col w-full h-fit px-5 py-3 mt-3 gap-4 border border-mainGray bg-subGray rounded-xl"
      >
        {mutation.isPending && (
          <div className="absolute inset-0 rounded-xl bg-black/35 w-full h-full z-30">
            <LogoLoading />
          </div>
        )}
        <input
          type="text"
          placeholder="제목을 입력하세요.(필수)"
          ref={titleRef}
          maxLength={30}
          className="outline-none font-semibold py-1 px-2 bg-transparent placeholder:text-mainGray"
        />
        <input
          type="text"
          placeholder="배틀태그#1234(필수)"
          ref={battleTagRef}
          maxLength={20}
          className="text-sm placeholder:text-mainGray outline-none font-semibold py-1 px-2 bg-transparent"
        />
        <div className="flex gap-3 justify-center">
          <GroupForm title="모드">
            <SelectOption type="mode" />
          </GroupForm>
          <GroupForm title="포지션">
            <div className="flex gap-2">
              {Array(5)
                .fill(null)
                .map((_, idx) => {
                  return <SelectOption key={idx} type="position" index={idx} />;
                })}
            </div>
          </GroupForm>
          <GroupForm title="티어">
            <div className="flex gap-2 items-center">
              <SelectOption type="tier" index={0} />
              <div className="w-3 h-[2px] rounded-full bg-mainGray" />
              <SelectOption type="tier" index={1} />
            </div>
          </GroupForm>
          <GroupForm title="성향">
            <SelectOption type="type" />
          </GroupForm>
          <GroupForm title="마이크">
            <SelectOption type="mic" />
          </GroupForm>
        </div>
        <input
          type="text"
          placeholder="내용을 입력하세요.(필수)"
          ref={contentRef}
          maxLength={100}
          className="bg-transparent text-sm outline-none px-3 py-1 placeholder:text-mainGray"
        />
        <button
          onClick={handleSubmitClick}
          disabled={searchingStatus !== "안함"}
          className="py-2 px-3 bg-black rounded-full text-white disabled:bg-mainGray"
        >
          작성하기
        </button>
      </div>
    </>
  );
}

export default GroupSearchBox;
