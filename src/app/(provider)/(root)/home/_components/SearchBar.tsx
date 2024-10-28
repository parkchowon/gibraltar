import SearchBarLoading from "@/components/Loading/SearchBarLoading";
import { useAuth } from "@/contexts/auth.context";

function SearchBar() {
  const { isPending } = useAuth();

  if (isPending) return <SearchBarLoading />;
  return (
    <input
      className="w-full h-[58px] px-8 py-[15px] rounded-full bg-gray-300"
      placeholder="검색어를 입력하세요"
    />
  );
}

export default SearchBar;
