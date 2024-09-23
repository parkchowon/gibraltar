function SideBar() {
  return (
    <aside className="absolute top-0 left-0 flex flex-col bg-blue-50 w-fit h-fit">
      <button className="flex justify-center items-center h-[58px]">
        <div className="w-6 h-6 mx-10 bg-gray-300" />
        Home
      </button>
    </aside>
  );
}
export default SideBar;
