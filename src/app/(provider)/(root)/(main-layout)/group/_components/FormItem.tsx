import {
  COMMUNICATION,
  PLAY_MODE,
  PLAY_POSITION,
  PLAY_STYLE,
} from "@/constants/profile";
import { OWTier } from "@/constants/tier";
import { useGroupStore } from "@/stores/group.store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface IconProps {
  iconName?: string;
  type?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

function FormItem({
  label,
  type,
  id,
}: {
  label: string;
  type: string;
  id?: string;
}) {
  const [iconName, setIconName] = useState<string | null>(null);
  const [DynamicIcon, setDynamicIcon] = useState<React.FC<IconProps> | null>(
    null
  );
  const { participantPos, putParticipantPos } = useGroupStore();
  useEffect(() => {
    switch (type) {
      case "mode":
        return setIconName(
          `${PLAY_MODE.find((mode) => mode.name === label)?.icon}`
        );
      case "tier":
        const tierImg = OWTier.find((mode) => mode.tier === label)?.img;
        return setIconName(tierImg ? tierImg : null);
      case "position":
        const icon = PLAY_POSITION.find((pos) => pos.name === label);
        return setIconName(icon ? `${icon.svg}` : null);
      case "type":
        return setIconName(
          `${PLAY_STYLE.find((style) => style.name === label)?.icon}`
        );
      case "mic":
        return setIconName(
          `${COMMUNICATION.find((com) => com.name === label)?.icon}`
        );
    }
  }, [type]);

  useEffect(() => {
    if (iconName && type !== "tier") {
      const loadIcon = async () => {
        const icon = await import(`@/assets/icons/${iconName}.svg`);
        setDynamicIcon(() => icon.default); // SVG 파일의 기본 내보내기를 설정
      };
      loadIcon();
    } else {
      setDynamicIcon(null);
    }
  }, [iconName, type]);

  const handlePositionClick = (label: string) => {
    if (type === "position") {
      putParticipantPos(label);
    }
  };

  return (
    <div className="relative flex flex-col gap-2 items-center z-0">
      <div
        className={`flex w-10 h-10 items-center justify-center p-1 rounded-full
           ${label ? "" : "border"}
         border-mainGray ${
           label === "X" || (type === "position" && label === "")
             ? "bg-mainGray"
             : "bg-white"
         }`}
      >
        {label && DynamicIcon && type !== "tier" && (
          <div
            className={`flex w-fit h-10 items-center justify-center rounded-full ${
              type === "position" && "hover:cursor-pointer"
            } ${participantPos === label ? "bg-carrot" : "bg-transparent"}
            }`}
            onClick={() => handlePositionClick(label)}
          >
            <DynamicIcon width={40} />
          </div>
        )}
        {iconName && type === "tier" && (
          <Image
            alt={label as string}
            src={iconName}
            width={40}
            height={40}
            className="h-fit max-h-16"
          />
        )}
      </div>
      <p className="text-sm z-0">{label}</p>
    </div>
  );
}

export default FormItem;
