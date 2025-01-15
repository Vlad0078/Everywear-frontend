import React, { FormEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();

  const [currentState, setCurrentState] = useState(t("login.sign-up"));

  const onSubmitHandler: FormEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === t("login.login") ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder={t("login.name")}
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder={t("login.email")}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder={t("login.password")}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">{t("login.forgot-password")}</p>
        {currentState === t("login.login") ? (
          <p
            onClick={() => setCurrentState(t("login.sign-up"))}
            className="cursor-pointer"
          >
            {t("login.goto-sign-up")}
          </p>
        ) : (
          <p
            onClick={() => setCurrentState(t("login.login"))}
            className="cursor-pointer"
          >
            {t("login.goto-login")}
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === t("login.login")
          ? t("login.sign-in-btn")
          : t("login.sign-up-btn")}
      </button>
    </form>
  );
};

export default Login;
