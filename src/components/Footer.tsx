import React from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-28 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 h-8" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci sit eius neque
            corporis nesciunt itaque architecto at in ex beatae, voluptatem laboriosam rem veniam
            quo sed ipsa, inventore placeat. Officiis!
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">{t("footer.company")}</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>{t("footer.home")}</li>
            <li>{t("footer.about-us")}</li>
            <li>{t("footer.delivery")}</li>
            <li>{t("footer.privacy-policy")}</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">{t("footer.get-in-touch")}</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+380 44 521-35-61</li>
            <li>office@knu.ua</li>
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
