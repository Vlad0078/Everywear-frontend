import React from "react";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";

const OurPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.delivery_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">{t("exchange-policy")}</p>
        <p className="text-gray-400">{t("exchange-policy-subtitle")}</p>
      </div>
      <div>
        <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">{t("quality-policy")}</p>
        <p className="text-gray-400">{t("quality-policy-subtitle")}</p>
      </div>
      <div>
        <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">{t("support-policy")}</p>
        <p className="text-gray-400">{t("support-policy-subtitle")}</p>
      </div>
    </div>
  );
};

export default OurPolicy;
