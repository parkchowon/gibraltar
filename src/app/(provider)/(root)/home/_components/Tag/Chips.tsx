import { useTagStore } from "@/stores/tag.store";
import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const chipVariants = cva("flex", {
  variants: {
    intent: {
      removable:
        "text-sm text-center py-1.5 px-4 bg-gray-100 rounded-[10px] gap-1.5 items-center whitespace-nowrap inline-block",
      post: "items-center h-6 px-2.5 border-[1.5px] text-[11px] font-medium border-gray-400 bg-gray-300 rounded-lg inline-block",
    },
  },
  defaultVariants: {
    intent: "post",
  },
});

export type ChipVariantsType = VariantProps<typeof chipVariants>;

type ChipProps = {
  text: string;
} & ChipVariantsType;

function Chips({ text, intent }: ChipProps) {
  const { deleteSelectedTag } = useTagStore();
  const router = useRouter();

  const handleXClick = (tag: string) => {
    deleteSelectedTag(tag);
  };

  const handleClickTag = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (intent !== "removable") {
      e.stopPropagation();
      console.log("tag 클릭");
      router.push(`/search?word=${text}&tab=recent`);
    }
  };

  return (
    <div
      onClick={(e) => handleClickTag(e)}
      className={chipVariants({ intent })}
    >
      {text}
      <button
        onClick={() => handleXClick(text)}
        className={`relative ${
          intent === "removable" ? "block" : "hidden"
        } w-3 h-3`}
      >
        <Image
          alt="cancel"
          fill
          src={"/icons/circle_x.svg"}
          className="object-fill"
        />
      </button>
    </div>
  );
}

export default Chips;
