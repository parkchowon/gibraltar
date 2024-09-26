import { create } from "zustand";

type TagProps = {
  selectedTag: string[];
  setSelectTag: (value: string)=> void;
}

export const useTagStore = create<TagProps>((set)=>({
 selectedTag: [],
 setSelectTag: (tag)=> set((prev)=> {
  if(prev.selectedTag.includes(tag)) return prev;
  return { selectedTag: [...prev.selectedTag, tag]}
 })
}))