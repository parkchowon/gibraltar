import React from "react";
import Logo from "@/assets/logo/gibraltar_logo.svg";

function LogoLoading() {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="grid w-6 h-6 place-items-center">
        <Logo />
      </div>
      <p>화물 미는 중...</p>
    </div>
  );
}

export default LogoLoading;
