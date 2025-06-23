import React from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-28 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 h-8" alt="" />
          <p className="w-full md:w-2/3 text-gray-600 text-sm sm:text-base">
            {t("everywear-slogan")}
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">{t("footer.company")}</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li
              className="cursor-pointer"
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
            >
              {t("footer.home")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                navigate("/about");
                window.scrollTo(0, 0);
              }}
            >
              {t("footer.about-us")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                navigate("/delivery");
                window.scrollTo(0, 0);
              }}
            >
              {t("footer.delivery")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                navigate("/privacy-policy");
                window.scrollTo(0, 0);
              }}
            >
              {t("footer.privacy-policy")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => {
                navigate("/size-tables");
                window.scrollTo(0, 0);
              }}
            >
              {t("footer.size-tables")}
            </li>
            {/* <li>{t("footer.privacy-policy")}</li> */}
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">{t("footer.get-in-touch")}</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+380 44 521-35-61</li>
            <li>vlad822@knu.ua</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">{t("footer.copyright")}</p>
      </div>
    </div>
  );
};

export default Footer;
