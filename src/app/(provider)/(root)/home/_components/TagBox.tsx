import { useTagStore } from "@/stores/tag.store";
import styles from "@/styles/postbox.module.css";
import { TagRow } from "@/types/database";
import Chips from "./Chips";
import Tag from "./Tag";

function TagBox({ tagList }: { tagList: TagRow[] }) {
  const { selectedTag } = useTagStore();

  return (
    <div className="absolute flex flex-col left-0 top-[280px] w-full h-[435px] px-8 pt-[86px] rounded-[30px] bg-white shadow-lg">
      <div
        className={`${styles.customScrollbar} overflow-auto overscroll-x-hidden h-[233px] pr-6`}
      >
        {tagList.map((tag) => {
          return <Tag key={tag.id} tag={tag} />;
        })}
      </div>
      <div className="h-[1px] w-full my-7 bg-gray-300" />
      <div className="flex gap-2.5">
        {selectedTag.map((tag, idx) => {
          return <Chips key={idx} text={tag} intent="removable" />;
        })}
      </div>
    </div>
  );
}

export default TagBox;
