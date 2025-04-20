import React from "react";
import Title from "../components/Title";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text={t("about-page.title")} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16 text-base sm:text-lg">
        <img src={assets.about_img} className="w-full md:w-2/5" alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            <b>Everywear</b> – це український інтернет-магазин стильного та зручного повсякденного
            одягу для всієї сім’ї. У нашому каталозі ви знайдете футболки, джинси, светри, сукні від
            провідних брендів та вітчизняних виробників. Ми дбаємо про те, щоб кожен елемент Вашого
            гардеробу поєднував у собі комфорт, якість і сучасний дизайн.
          </p>
          <p>
            Ми постійно оновлюємо каталог, щоб Ви завжди мали доступ до найактуальніших трендів.
            Наша мета – зробити процес вибору одягу простим і приємним, пропонуючи широкий
            асортимент для чоловіків, жінок і дітей. Від базових речей на кожен день до стильних
            акцентів для особливих моментів – у нас є все, щоб Ви могли виразити себе через моду.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text={t("about-page.why-choose-us")} />
      </div>

      <div className="flex flex-col md:flex-row text-sm sm:text-base mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 w-1/3">
          <b>{t("about-page.family-clothing")}</b>
          <p className="text-gray-600">
            У нашому каталозі є стильні та зручні речі для чоловіків, жінок і дітей – від футболок і
            джинсів до суконь і курток. Кожен знайде свій ідеальний образ!
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 w-1/3">
          <b>{t("about-page.affordable-prices")}</b>
          <p className="text-gray-600">
            У Everywear ви знайдете одяг на будь-який бюджет – від доступних базових речей до
            преміум-моделей.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 w-1/3">
          <b>{t("about-page.quality-garantee")}</b>
          <p className="text-gray-600">
            Ми співпрацюємо лише з перевіреними постачальниками та пропонуємо одяг, який поєднує
            довговічність, комфорт і стиль.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
