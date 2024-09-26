import { useTagStore } from "@/stores/tag.store";
import { TagRow } from "@/types/database";

function Tag({ tag }: { tag: TagRow }) {
  const { setSelectTag } = useTagStore();

  const handleTagClick = () => {
    if (tag.tag_name) setSelectTag(tag.tag_name);
  };

  return (
    <button
      onClick={handleTagClick}
      className="flex w-full py-3 px-3 text-left gap-3 rounded-2xl hover:bg-gray-100"
    >
      <div className="w-[25px] h-[25px] rounded-[10px] bg-gray-200" />
      <p>{tag.tag_name}</p>
    </button>
  );
}

export default Tag;
