import { searchUserHandle } from "@/apis/search.api";
import styles from "@/styles/postbox.module.css";
import LogoLoading from "@/components/Loading/LogoLoading";
import UserItem from "@/components/UserItem";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useUserTagStore } from "@/stores/userTag.store";

function UserTag({ top, handle }: { top: number; handle?: string }) {
  const { data: users, isPending } = useQuery({
    queryKey: ["userTag", handle],
    queryFn: () => searchUserHandle(handle ?? ""),
    enabled: !!handle,
  });

  const { selectedUser, setSelectedUser, setSelectedHandle } =
    useUserTagStore();

  useEffect(() => {
    if (!users) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && selectedUser > 0) {
        setSelectedUser(selectedUser - 1);
      } else if (e.key === "ArrowDown" && users.length - 1 > selectedUser) {
        setSelectedUser(selectedUser + 1);
      } else if (e.key === "Enter" || e.key === "Tab" || e.key === " ") {
        e.preventDefault();
        setSelectedUser(0);
        setSelectedHandle(users[selectedUser].handle);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [users?.length, selectedUser]);

  return (
    <div
      className="absolute flex flex-col left-0 w-full h-[335px] rounded-[30px] px-3 py-10 bg-white shadow-lg z-20"
      style={{ top: `${top}px` }}
    >
      <div
        className={`${styles.customScrollbar} overflow-auto overscroll-x-hidden h-full pr-3`}
      >
        {!!handle && isPending && <LogoLoading />}
        {users?.map((user, index) => {
          return <UserItem key={user.id} user={user} tag order={index} />;
        })}
      </div>
    </div>
  );
}

export default UserTag;
