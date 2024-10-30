import { StatusTypeProps } from "@/types/status";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const statusVariants = cva(
  "flex items-center text-[12px] py-1 text-[#737373]",
  {
    variants: {
      intent: {
        page: "gap-[8.7px] w-fit px-3 rounded-full bg-[#D9D9D9]",
        side: "gap-[7px] px-2",
        modal: "rounded-full w-full px-2 gap-[7px] hover:bg-[#F0F0F0]",
      },
    },
    defaultVariants: {
      intent: "side",
    },
  }
);

export type StatusVariantsType = VariantProps<typeof statusVariants>;

function UserStatus({ status, intent }: StatusTypeProps) {
  const dotSize = intent === "page" ? "11px" : "9px";

  return (
    <div className={statusVariants({ intent })}>
      <div
        className={`rounded-full`}
        style={{
          backgroundColor: status.color,
          width: dotSize,
          height: dotSize,
        }}
      />
      <p>{status.state}</p>
    </div>
  );
}

export default UserStatus;
