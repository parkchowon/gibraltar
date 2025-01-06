import React from "react";
import GroupForm from "./GroupForm";
import SelectOption from "./SelectOption";

function GroupSearchBox() {
  return (
    <div className="flex flex-col w-full h-fit px-5 py-3 mt-3 gap-4 border border-mainGray rounded-xl">
      <input
        type="text"
        placeholder="제목을 입력하세요."
        className="outline-none font-semibold py-1 px-2"
      />
      <div className="flex gap-3 justify-center">
        <GroupForm title="모드">
          <SelectOption type="mode" />
        </GroupForm>
        <GroupForm title="포지션">
          <div className="flex gap-2">
            <SelectOption type="position" />
            <SelectOption type="position" />
            <SelectOption type="position" />
            <SelectOption type="position" />
            <SelectOption type="position" />
          </div>
        </GroupForm>
        <GroupForm title="티어">
          <div className="flex gap-2 items-center">
            <SelectOption type="tier" />
            <div className="w-3 h-[2px] rounded-full bg-mainGray" />
            <SelectOption type="tier" />
          </div>
        </GroupForm>
        <GroupForm title="성향">
          <SelectOption type="type" />
        </GroupForm>
        <GroupForm title="마이크">
          <SelectOption type="mic" />
        </GroupForm>
      </div>
      <button className="py-2 px-3 bg-black rounded-full text-white">
        작성하기
      </button>
    </div>
  );
}

export default GroupSearchBox;
