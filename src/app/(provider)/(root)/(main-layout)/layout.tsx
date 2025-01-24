import MainLayout from "@/components/Layout/MainLayout";
import React, { PropsWithChildren } from "react";

function layout({ children }: PropsWithChildren) {
  return <MainLayout>{children}</MainLayout>;
}

export default layout;
