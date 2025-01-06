import React, { useEffect, useState } from "react";
import SelectModal from "./modal/SelectModal";
import {
  COMMUNICATION,
  PLAY_MODE,
  PLAY_POSITION,
  PLAY_STYLE,
} from "@/constants/profile";
import { OWTier } from "@/constants/tier";

function SelectOption({ type }: { type: string | number }) {
  const [labelClick, setLabelClick] = useState<boolean>(false);
  const [options, setOptions] = useState<string[] | number[]>([]);
  const [label, setLabel] = useState<string | number>("");

  useEffect(() => {
    switch (type) {
      case "mode":
        return setOptions(PLAY_MODE.map((mode) => mode.name));
      case "tier":
        return setOptions(OWTier.map((tier) => tier.tier));
      case "position":
        return setOptions(PLAY_POSITION.map((pos) => pos.name));
      case "type":
        return setOptions(PLAY_STYLE.map((style) => style.name));
      case "mic":
        return setOptions(COMMUNICATION.map((com) => com.name));
    }
  }, [type]);

  const handleOptionClick = () => {
    setLabelClick(!labelClick);
  };

  return (
    <div className="relative flex flex-col gap-2 items-center z-0">
      <button
        className="w-10 h-10 rounded-full bg-mainGray"
        onClick={handleOptionClick}
      ></button>
      <p className="text-sm">{label}</p>
      {labelClick && (
        <SelectModal
          selections={options}
          setLabel={setLabel}
          setLabelClick={setLabelClick}
        />
      )}
    </div>
  );
}

export default SelectOption;
