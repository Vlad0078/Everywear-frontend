import React from "react";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="hidden sm:flex flex-row border border-gray-400 transition-all duration-300">
        {/* //? WOMAN */}
        <div
          className="relative group w-full sm:w-1/3 overflow-hidden"
          onClick={() => navigate("/collection/women")}
        >
          <img
            src={assets.banner_woman}
            alt=""
            className="group-hover:scale-105 transition duration-300"
          />

          {/* Затемнення при наведенні */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>

          {/* Напис по центру */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white/70 text-black text-opacity-100 text-5xl px-6 py-3 uppercase">
              {t("nav.women")}
            </span>
          </div>
        </div>

        {/* //? MAN */}
        <div
          className="relative group w-full sm:w-1/3 overflow-hidden"
          onClick={() => navigate("/collection/men")}
        >
          <img
            src={assets.banner_man}
            alt=""
            className="group-hover:scale-105 transition duration-300"
          />

          {/* Затемнення при наведенні */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>

          {/* Напис по центру */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white/70 text-black text-opacity-100 text-5xl px-6 py-3 uppercase">
              {t("nav.men")}
            </span>
          </div>
        </div>

        {/* //? KIDS */}
        <div
          className="relative group w-full sm:w-1/3 overflow-hidden"
          onClick={() => navigate("/collection/kids")}
        >
          <img
            src={assets.banner_kid}
            alt=""
            className="group-hover:scale-105 transition duration-300"
          />

          {/* Затемнення при наведенні */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>

          {/* Напис по центру */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white/70 text-black text-opacity-100 text-5xl px-6 py-3 uppercase">
              {t("nav.kids")}
            </span>
          </div>
        </div>
      </div>

      {/* //? MOBILE */}
      <div className="sm:hidden relative border border-gray-400">
        <img src={assets.banner_mobile} className="w-full" alt="" />

        {/* Кнопки по центру в колонку */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button
            className="bg-white/90 text-black text-opacity-100 text-3xl px-4 py-2 uppercase w-3/4"
            onClick={() => navigate("/collection/women")}
          >
            {t("nav.women")}
          </button>
          <button
            className="bg-white/90 text-black text-opacity-100 text-3xl px-4 py-2 uppercase w-3/4"
            onClick={() => navigate("/collection/men")}
          >
            {t("nav.men")}
          </button>
          <button
            className="bg-white/90 text-black text-opacity-100 text-3xl px-4 py-2 uppercase w-3/4"
            onClick={() => navigate("/collection/kids")}
          >
            {t("nav.kids")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Hero;
