import { PropsWithChildren } from "react";
import SideBar from "../SideBar";

function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-full bg-purple-50">
      <SideBar />
      {children}
    </div>
  );
}

export default MainLayout;
