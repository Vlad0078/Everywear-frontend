import React from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";

interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFiltersUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch, setFiltersUpdated }) => {
  const { t } = useTranslation();

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <form
        className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2"
        onSubmit={(e) => {
          e.preventDefault();
          setFiltersUpdated(true);
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            setFiltersUpdated(true);
          }}
          type="text"
          placeholder={t("search.placeholder")}
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <img
          onClick={() => {
            setFiltersUpdated(true);
          }}
          src={assets.search_icon}
          className="w-4 cursor-pointer"
          alt=""
        />
      </form>
      <img
        onClick={() => {
          setSearch("");
          setFiltersUpdated(true);
        }}
        src={assets.cross_icon}
        className="inline w-3 cursor-pointer"
        alt=""
      />
    </div>
  );
};

export default SearchBar;
