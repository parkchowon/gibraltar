import { TagRow } from "@/types/database";
import { create } from "zustand";

type TagProps = {
  selectedTag:TagRow[];
  setSelectTag: (value: TagRow)=> void;
  deleteSelectedTag: (value: string)=> void;
  resetTag: ()=>void;
}

export const useTagStore = create<TagProps>((set)=>({
 selectedTag: [],
 setSelectTag: (tag)=> set((prev)=> {
  if(prev.selectedTag.includes(tag)) return prev;
  return { selectedTag: [...prev.selectedTag, tag]}
 }),
 deleteSelectedTag: (tag) =>set((prev)=>{
  const deletedTags = prev.selectedTag.filter((item)=>{
    return item.tag_name !== tag
  })
  return {selectedTag : deletedTags}
}),
resetTag: ()=>set((prev)=>({selectedTag: []}))
}))