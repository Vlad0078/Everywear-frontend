import axios, { AxiosResponse } from "axios";
import React, { FormEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginRequestBody, RegisterRequestBody, ResponseBody } from "../types/api-requests";
import { backendUrl } from "../constants";
import { setToken, useShopStore } from "../store/store";
import { toast } from "react-toastify";
import i18n from "../i18n";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useShopStore((state) => state.token);

  const [currentState, setCurrentState] = useState("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "sign-up") {
        // ? Sign up
        const response = await axios.post<
          ResponseBody,
          AxiosResponse<ResponseBody>,
          RegisterRequestBody
        >(backendUrl + "/api/user/register", { name, email, password });
        if (response.data.success) {
          setToken(response.data.token!);
          localStorage.setItem("token", response.data.token!);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // ? Login
        const reqBody: LoginRequestBody = { email, password };
        const response = await axios.post<
          ResponseBody,
          AxiosResponse<ResponseBody>,
          LoginRequestBody
        >(backendUrl + "/api/user/login", reqBody, {
          params: { lng: i18n.language },
        });
        if (response.data.success) {
          setToken(response.data.token!);
          localStorage.setItem("token", response.data.token!);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{t(`login.${currentState}`)}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {["login", "password-recovery"].includes(currentState) ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder={t("login.name")}
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder={t("login.email")}
        required
      />
      {currentState === "password-recovery" ? (
        ""
      ) : (
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder={t("login.password")}
          required
        />
      )}
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p
          onClick={() => setCurrentState("password-recovery")}
          className={`cursor-pointer ${currentState === "login" ? "" : " invisible"}`}
        >
          {t("login.forgot-password")}
        </p>
        {currentState === "login" ? (
          <p onClick={() => setCurrentState("sign-up")} className="cursor-pointer">
            {t("login.goto-sign-up")}
          </p>
        ) : (
          <p onClick={() => setCurrentState("login")} className="cursor-pointer">
            {t("login.goto-login")}
          </p>
        )}
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === "login" ? t("login.sign-in-btn") : t("login.sign-up-btn")}
      </button>
    </form>
  );
};

export default Login;
