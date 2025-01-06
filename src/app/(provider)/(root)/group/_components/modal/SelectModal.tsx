import React, { Dispatch, SetStateAction } from "react";

function SelectModal({
  selections,
  setLabel,
  setLabelClick,
}: {
  selections: string[] | number[];
  setLabel: Dispatch<SetStateAction<string | number>>;
  setLabelClick: Dispatch<SetStateAction<boolean>>;
}) {
  const handleOptionClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: string | number
  ) => {
    setLabel(option);
    setLabelClick(false);
  };

  return (
    <div className="absolute flex flex-col text-center px-1 py-1 w-fit h-fit border border-mainGray rounded-lg bg-white z-10">
      {selections.map((selection, idx) => {
        return (
          <div
            className="w-full whitespace-nowrap cursor-pointer rounded-full px-2 py-1 hover:bg-subGray"
            onClick={(e) => handleOptionClick(e, selection)}
            key={idx}
          >
            {selection}
          </div>
        );
      })}
    </div>
  );
}

export default SelectModal;
