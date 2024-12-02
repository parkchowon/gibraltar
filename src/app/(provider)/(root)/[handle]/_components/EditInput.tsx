import React from "react";

type EditInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function EditInput({ label, value, onChange }: EditInputProps) {
  return (
    <label className="flex w-full px-4 py-3 border gap-12 border-gray-300 rounded-2xl">
      <p className="text-gray-300">{label}</p>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="text-black bg-transparent"
      />
    </label>
  );
}

export default EditInput;
