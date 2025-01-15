import React, { useEffect, useState } from "react";
import { setSearch, setShowSearch, useShopStore } from "../store/store";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const search = useShopStore((state) => state.search);
  const showSearch = useShopStore((state) => state.showSearch);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location, showSearch]);

  return visible ? (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={t("search.placeholder")}
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <img src={assets.search_icon} className="w-4" alt="" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        src={assets.cross_icon}
        className="inline w-3 cursor-pointer"
        alt=""
      />
    </div>
  ) : null;
};

export default SearchBar;
