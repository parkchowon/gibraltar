import SearchBarLoading from "@/components/Loading/SearchBarLoading";
import SearchIcon from "@/assets/icons/search.svg";
import { useAuth } from "@/contexts/auth.context";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SearchBar() {
  const { isPending } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchText);
    router.push(`/search?word=${searchText}&tab=popular`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  };

  if (isPending) return <SearchBarLoading />;
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex w-full h-[58px] px-8 py-[15px] gap-3 rounded-full bg-gray-300"
    >
      <input
        onChange={handleInputChange}
        className="flex-grow bg-inherit outline-none"
        placeholder="검색어를 입력하세요"
      />
      <button>
        <SearchIcon width="28" height="28" />
      </button>
    </form>
  );
}

export default SearchBar;
