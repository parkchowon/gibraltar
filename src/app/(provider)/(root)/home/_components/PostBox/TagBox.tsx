import styles from "@/styles/postbox.module.css";
import { TagRow } from "@/types/database";
import SelectTag from "./SelectTag";
import Tag from "../Tag/Tag";
import { useTagStore } from "@/stores/tag.store";

function TagBox({ tagList, top }: { tagList: TagRow[]; top: number }) {
  const { selectedTag } = useTagStore();

  return (
    <div
      className="absolute flex flex-col left-0 w-full h-[435px] px-8 pt-[86px] pb-5 rounded-[30px] bg-white shadow-lg z-10"
      style={{ top: `${top}px` }}
    >
      <div
        className={`${styles.customScrollbar} overflow-auto overscroll-x-hidden h-[233px] pr-6`}
      >
        {tagList.map((tag) => {
          return (
            <Tag
              key={tag.id}
              tag={tag}
              checked={
                !!selectedTag.find((item) => item.tag_name === tag.tag_name)
              }
            />
          );
        })}
      </div>
      <div className="h-[1px] w-full mt-7 bg-mainGray" />
      <SelectTag />
    </div>
  );
}

export default TagBox;
