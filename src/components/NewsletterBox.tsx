import React, { FormEventHandler } from "react";
import { useTranslation } from "react-i18next";

const NewsletterBox: React.FC = () => {
  const { t } = useTranslation();
  const onSubmitHandler: FormEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        {t("newsletter-box")}
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum odio rerum
        nobis vel vitae ducimus quasi dolorum accusantium non!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          placeholder={t("email-placeholder")}
          required
          className="w-full sm:flex-1 outline-none"
        />{" "}
        <button
          type="submit"
          className="bg-black text-white text-xs px-10 py-4"
        >
          {t("subscribe")}
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
