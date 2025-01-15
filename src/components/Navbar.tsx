import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCartCount, setShowSearch } from "../store/store";

const Navbar: React.FC = () => {
  const { i18n, t } = useTranslation();

  const [visible, setVisible] = useState(false);

  const cartCount = useCartCount();

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        <img src={assets.logo} className="w-36" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to={"/"} className="flex flex-col items-center gap-1">
          <p className="uppercase">{t("home")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to={"/collection"}
          className="flex flex-col items-center gap-1"
        >
          <p className="uppercase">{t("collection")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to={"/about"} className="flex flex-col items-center gap-1">
          <p className="uppercase">{t("about")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to={"/contact"} className="flex flex-col items-center gap-1">
          <p className="uppercase">{t("contact")}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        <div className="group relative">
          <Link to={"/login"}>
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt=""
            />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">
                {t("nav.profile")}
              </p>
              <p className="cursor-pointer hover:text-black">
                {t("nav.orders")}
              </p>
              <p className="cursor-pointer hover:text-black">
                {t("nav.logout")}
              </p>
            </div>
          </div>
        </div>

        <div className="group relative">
          <div>
            <img src={assets.globe_icon} className="w-5 min-w-5" alt="" />
            <b className="absolute left-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-100 text-black aspect-square rounded-full text-[0.5rem]">
              UK
            </b>
          </div>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p
                onClick={() => i18n.changeLanguage("uk")}
                className={`cursor-pointer hover:text-black ${
                  i18n.language === "uk" ? "font-semibold text-gray-700" : ""
                }`}
              >
                {t("nav.lang-uk")}
              </p>
              <p
                onClick={() => i18n.changeLanguage("en")}
                className={`cursor-pointer hover:text-black ${
                  i18n.language === "en" ? "font-semibold text-gray-700" : ""
                }`}
              >
                {t("nav.lang-en")}
              </p>
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          {cartCount > 0 ? (
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[0.5rem]">
              {cartCount}
            </p>
          ) : null}
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* // ? Бокове меню для малих екранів */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>{t("back")}</p>
          </div>
          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className="uppercase py-2 pl-6 border"
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/collection"
            onClick={() => setVisible(false)}
            className="uppercase py-2 pl-6 border"
          >
            {t("collection")}
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setVisible(false)}
            className="uppercase py-2 pl-6 border"
          >
            {t("about")}
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setVisible(false)}
            className="uppercase py-2 pl-6 border"
          >
            {t("contact")}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
