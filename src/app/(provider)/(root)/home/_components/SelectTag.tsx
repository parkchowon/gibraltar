import { useTagStore } from "@/stores/tag.store";
import Chips from "./Chips";

function SelectTag() {
  const { selectedTag } = useTagStore();

  return (
    <div className={`flex flex-wrap w-full gap-2.5 pt-4 pb-2`}>
      {selectedTag.map((tag) => {
        return <Chips key={tag.id} text={tag.tag_name} intent="removable" />;
      })}
    </div>
  );
}

export default SelectTag;
