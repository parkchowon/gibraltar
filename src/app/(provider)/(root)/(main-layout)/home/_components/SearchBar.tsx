import SearchBarLoading from "@/components/Loading/SearchBarLoading";
import SearchIcon from "@/assets/icons/search.svg";
import { useAuth } from "@/contexts/auth.context";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SearchBar({
  searchValue,
  tab,
}: {
  searchValue?: string;
  tab?: string;
}) {
  const { isPending } = useAuth();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>(
    searchValue ? searchValue : ""
  );

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText === "") {
      return;
    }
    if (tab) {
      return router.push(
        `/search?word=${encodeURIComponent(searchText)}&tab=${tab}`
      );
    }
    router.push(`/search?word=${encodeURIComponent(searchText)}&tab=recent`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  };

  if (isPending) return <SearchBarLoading />;
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex w-full items-center h-12 lg:h-[58px] px-5 lg:px-8 py-2 lg:py-[15px] text-sm lg:text-base gap-3 rounded-full bg-subGray border border-mainGray"
    >
      <input
        value={searchText}
        onChange={handleInputChange}
        className="flex-grow min-w-0 bg-inherit outline-none placeholder:text-mainGray"
        placeholder="검색어를 입력하세요"
      />
      <button
        type="submit"
        className="w-7 h-7 flex items-center justify-center"
      >
        <SearchIcon width="28" height="28" />
      </button>
    </form>
  );
}

export default SearchBar;
