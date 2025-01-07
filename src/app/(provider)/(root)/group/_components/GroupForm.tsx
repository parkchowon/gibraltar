import React, { PropsWithChildren } from "react";

function GroupForm({ title, children }: PropsWithChildren & { title: string }) {
  return (
    <div className="relative flex flex-col gap-2 text-left border items-center border-mainGray bg-white rounded-lg px-3 py-2">
      <p className="text-sm w-full font-semibold">{title}</p>
      {children}
    </div>
  );
}

export default GroupForm;
