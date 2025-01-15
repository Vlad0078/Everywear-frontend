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

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat
            ratione rem voluptatibus adipisci facilis autem consectetur iusto,
            maxime illum aliquid nobis quas harum nulla necessitatibus
            voluptates voluptatem. Odit, expedita laboriosam.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus accusamus, excepturi enim omnis quod reprehenderit
            nobis alias pariatur eveniet doloribus ipsam voluptatem eligendi
            necessitatibus dolore. Magni consectetur est quam quod.
          </p>
          <b className="text-gray-800">// Our Mission</b>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore
            cum libero animi sint incidunt magni, inventore repellendus. Dolores
            voluptate maiores labore odit provident aliquid. Numquam ratione
            repudiandae voluptatibus quis harum.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text={t("about-page.why-choose-us")} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>{t("about-page.quality-assurance")}:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus,
            voluptas! Natus hic explicabo voluptatibus, quod, eveniet blanditiis
            molestias nostrum rem facilis praesentium aspernatur. Iure, quasi
            repellendus asperiores ea tempore quidem.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>{t("about-page.convenience")}:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, amet
            et! Illum fugit cupiditate nemo voluptates repellendus unde error
            suscipit perspiciatis quibusdam deleniti, exercitationem, quo
            reiciendis nihil sapiente praesentium quia!
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>{t("about-page.customer-service")}:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            odio voluptatibus nobis ipsum provident ratione possimus, cupiditate
            ipsa, nam ducimus, assumenda expedita aliquid voluptate distinctio
            quia sapiente suscipit sed consectetur.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
