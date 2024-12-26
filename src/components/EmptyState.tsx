import React from "react";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex flex-col w-full py-24 items-center justify-center gap-2">
      <div className="w-8 h-8">
        <Logo />
      </div>
      <p className="text-gray-400">{type}가 없어요</p>
    </div>
  );
}

export default EmptyState;
