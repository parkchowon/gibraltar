import { useTagStore } from "@/stores/tag.store";
import styles from "@/styles/postbox.module.css";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Chips from "./Chips";

function TagRowScroll() {
  const { selectedTag } = useTagStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const scroll = scrollRef.current;

    if (!scroll) return;

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      scroll.classList.add("cursor-grabbing");
      scroll.classList.remove("cursor-grab");
      setStartX(e.pageX - scroll.offsetLeft);
      setScrollLeft(scroll.scrollLeft);
    };
    const handleMouseLeaveOrUp = () => {
      setIsDragging(false);
      scroll.classList.add("cursor-grab");
      scroll.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scroll.offsetLeft;
      const walk = x - startX; // 스크롤 속도 조정
      scroll.scrollLeft = scrollLeft - walk;
    };

    // 이벤트 리스너 추가
    scroll.addEventListener("mousedown", handleMouseDown as any);
    scroll.addEventListener("mouseleave", handleMouseLeaveOrUp);
    scroll.addEventListener("mouseup", handleMouseLeaveOrUp);
    scroll.addEventListener("mousemove", handleMouseMove as any);

    // Clean-up function: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      scroll.removeEventListener("mousedown", handleMouseDown as any);
      scroll.removeEventListener("mouseleave", handleMouseLeaveOrUp);
      scroll.removeEventListener("mouseup", handleMouseLeaveOrUp);
      scroll.removeEventListener("mousemove", handleMouseMove as any);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <div
      ref={scrollRef}
      className={`${styles.customScrollbar} flex gap-2.5 pt-4 pb-2 overflow-x-auto cursor-grab select-none`}
    >
      {selectedTag.map((tag) => {
        return <Chips key={tag.id} text={tag.tag_name} intent="removable" />;
      })}
    </div>
  );
}

export default TagRowScroll;
