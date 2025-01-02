import { useTagStore } from "@/stores/tag.store";
import { TagRow } from "@/types/database";

function Tag({ tag, checked }: { tag: TagRow; checked: boolean }) {
  const { setSelectTag } = useTagStore();

  const handleTagClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (tag.tag_name) setSelectTag(tag);
  };

  return (
    <button
      onClick={(e) => handleTagClick(e)}
      className="flex w-full py-3 px-3 text-left gap-3 rounded-2xl hover:bg-gray-100"
    >
      <div
        className={`w-[25px] h-[25px] rounded-[10px] ${
          checked ? "bg-mint" : "bg-gray-200"
        } `}
      />
      <p>{tag.tag_name}</p>
    </button>
  );
}

export default Tag;
