import React, { SVGProps, useEffect, useState } from "react";
import SelectModal from "./modal/SelectModal";

import {
  COMMUNICATION,
  PLAY_MODE,
  PLAY_POSITION,
  PLAY_STYLE,
} from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useGroupStore } from "@/stores/group.store";

function SelectOption({ type, index }: { type: string; index?: number }) {
  const [labelClick, setLabelClick] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [label, setLabel] = useState<string>("");
  const [iconName, setIconName] = useState<string | null>(null);

  const { putMic, putMode, putPosition, putStyle, putTier, searchingStatus } =
    useGroupStore();

  useEffect(() => {
    switch (type) {
      case "mode":
        putMode(label);
        setIconName(`${PLAY_MODE.find((mode) => mode.name === label)?.icon}`);
        return setOptions(PLAY_MODE.map((mode) => mode.name));
      case "tier":
        putTier(label, index as number);
        const tierImg = OWTier.find((mode) => mode.tier === label)?.img;
        setIconName(tierImg ? tierImg : null);
        return setOptions(OWTier.map((tier) => tier.tier));
      case "position":
        putPosition(label, index as number);
        const icon = PLAY_POSITION.find((pos) => pos.name === label);
        setIconName(icon ? `${icon.svg}` : null);
        return setOptions([...PLAY_POSITION.map((pos) => pos.name), "X"]);
      case "type":
        putStyle(label);
        setIconName(
          `${PLAY_STYLE.find((style) => style.name === label)?.icon}`
        );
        return setOptions(PLAY_STYLE.map((style) => style.name));
      case "mic":
        putMic(label);
        setIconName(`${COMMUNICATION.find((com) => com.name === label)?.icon}`);
        return setOptions(COMMUNICATION.map((com) => com.name));
    }
  }, [type, label]);

  interface IconProps extends SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
  }

  const IconComponent = (
    iconName && type !== "tier"
      ? dynamic(() => import(`@/assets/icons/${iconName}.svg`))
      : null
  ) as React.FC<IconProps>;

  const handleOptionClick = () => {
    if (searchingStatus === "안함") {
      setLabelClick(!labelClick);
    }
  };

  return (
    <div className="relative flex flex-col gap-2 items-center z-0">
      <button
        className={`flex w-10 h-10 items-center justify-center p-1 rounded-full ${
          type === "mode" && label ? "" : "border"
        } border-mainGray ${label === "X" ? "bg-mainGray" : "bg-white"}`}
        onClick={handleOptionClick}
      >
        {label && IconComponent && type !== "tier" && (
          <IconComponent width={40} />
        )}
        {iconName && type === "tier" && (
          <Image alt={label as string} src={iconName} width={40} height={40} />
        )}
      </button>
      <p className="text-sm z-0">{label}</p>
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
