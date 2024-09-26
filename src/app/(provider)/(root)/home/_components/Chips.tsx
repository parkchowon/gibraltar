import { cva, VariantProps } from "class-variance-authority";
import Image from "next/image";

const chipVariants = cva("flex", {
  variants: {
    intent: {
      removable: "text-sm py-1.5 px-4 bg-gray-100 rounded-[10px] gap-1.5  ",
      post: "",
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
  const handleXClick = () => {
    console.log(text);
  };
  return (
    <div className={chipVariants({ intent })}>
      {text}
      <button
        onClick={handleXClick}
        className={`${intent === "removable" ? "block" : "hidden"}`}
      >
        <Image
          alt="cancel"
          width={12}
          height={12}
          src={"/icons/circle_x.svg"}
        />
      </button>
    </div>
  );
}

export default Chips;
