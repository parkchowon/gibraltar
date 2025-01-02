import {
  MAX_BIO_LENGTH,
  MAX_HANDLE_LENGTH,
  MAX_NICKNAME_LENGTH,
} from "@/constants/textLength";
import React, { useEffect, useState } from "react";

type EditInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function EditInput({ label, value, onChange }: EditInputProps) {
  const [maxLength, setMaxLength] = useState<number>(15);

  useEffect(() => {
    switch (label) {
      case "닉네임":
        return setMaxLength(MAX_NICKNAME_LENGTH);
      case "아이디":
        return setMaxLength(MAX_HANDLE_LENGTH);
      case "바이오":
        return setMaxLength(MAX_BIO_LENGTH);
    }
  }, []);

  return (
    <label className="flex w-full px-4 py-3 border gap-8 border-mainGray rounded-2xl bg-subGray">
      <p className="text-mainGray">{label}</p>
      <textarea
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        className={`text-black flex-grow resize-none outline-none bg-subGray ${
          label !== "바이오" ? "h-6" : "h-14"
        }`}
      />
    </label>
  );
}

export default EditInput;
