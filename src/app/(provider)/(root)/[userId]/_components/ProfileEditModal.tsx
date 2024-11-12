import BackArrowBtn from "@/components/BackArrowBtn";
import ReactDOM from "react-dom";
import React, { Dispatch, SetStateAction, useState } from "react";
import ProfileBtn from "@/components/ProfileBtn";
import CameraIcon from "@/assets/icons/camera_edit.svg";

function ProfileEditModal({
  profileUser,
  setEditClick,
}: {
  profileUser: {
    created_at: string;
    email: string;
    handle: string;
    id: string;
    nickname: string;
    profile_url: string;
    status: string | null;
  };
  setEditClick: Dispatch<SetStateAction<boolean>>;
}) {
  const [nickname, setNickname] = useState<string>(profileUser.nickname);
  const [handle, setHandle] = useState<string>(profileUser.handle);

  const handleNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.currentTarget.value);
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.currentTarget.value);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center">
      <div
        onClick={() => setEditClick(false)}
        className="absolute inset-0 bg-black opacity-30"
      />
      <div className="relative top-[6.9%] w-[38.3%] h-fit pb-[30px] px-6 py-6 bg-white rounded-2xl">
        <BackArrowBtn
          intent={"profileEditModal"}
          type="modal"
          setModalClick={setEditClick}
        />
        <div className="flex justify-center w-full py-12 pl-[9.7%] gap-[46px]">
          <div className="relative w-fit h-fit flex items-center justify-center">
            <button className="absolute grid place-items-center w-[45px] h-[45px] bg-black rounded-full bg-opacity-40 z-20">
              <CameraIcon width="25" height="25" color="white" />
            </button>
            <ProfileBtn
              profileUrl={profileUser.profile_url}
              userId={profileUser.id}
              intent={"edit"}
              type="non-click"
            />
          </div>
          <div className="flex flex-col flex-grow gap-3">
            <label className="flex w-fit px-4 py-3 border gap-12 border-gray-300 rounded-2xl">
              <p className="text-gray-300">닉네임</p>
              <input
                type="text"
                value={nickname}
                onChange={handleNickChange}
                className="text-black bg-transparent w-60"
              />
            </label>
            <label className="flex w-fit px-4 py-3 border gap-12 border-gray-300 rounded-2xl">
              <p className="text-gray-300">아이디</p>
              <input
                type="text"
                value={handle}
                onChange={handleHandleChange}
                className="text-black bg-transparent w-60"
              />
            </label>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProfileEditModal;
