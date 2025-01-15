import React from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text={t("contact-page.contact-us")} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} className="w-full max-w-[480px]" alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">
            {t("contact-page.our-store")}
          </p>
          <p className="text-gray-500">
            {t("contact-page.addres.street")}
            <br />
            {t("contact-page.addres.city")}
          </p>
          <p className="text-gray-500">
            {t("contact-page.phone")}: +380 44 521-35-61
            <br />
            {t("contact-page.email")}: office@knu.ua
          </p>
          <p className="text-gray-600">{t("contact-page.careers")}</p>
          <p className="text-gray-500">{t("contact-page.our-teams")}</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            {t("contact-page.explore-jobs")}
          </button>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
