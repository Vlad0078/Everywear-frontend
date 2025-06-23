import axios, { AxiosResponse } from "axios";
import React, { FormEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LoginRequestBody,
  LoginResponseBody,
  RegisterRequestBody,
  RegisterResponseBody,
} from "../types/api-requests";
import { backendUrl } from "../constants";
import { setToken, useShopStore } from "../store/store";
import { toast } from "react-toastify";
import i18n from "../i18n";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { requestPasswordRecovery } from "../utils/api";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useShopStore((state) => state.token);

  const [currentState, setCurrentState] = useState<"login" | "sign-up" | "password-recovery">(
    "login"
  );
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });

  // Перевірка міцності пароля
  useEffect(() => {
    if (password && currentState === "sign-up") {
      const result = zxcvbn(password, [name, email]);
      let score = result.score;
      let feedback = "";
      if (password.length <= 8) {
        score = Math.min(score, 1); // Паролі до 8 символів не можуть бути сильнішими за "слабкий"
        feedback = t("login.password-feedback.too-short");
      } else if (result.score < 2 && result.feedback.warning) {
        feedback = result.feedback.warning;
      }
      setPasswordStrength({ score, feedback });
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [password, name, email, currentState, t]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    if (currentState === "sign-up" && passwordStrength.score < 2) {
      toast.error(t("login.password-too-weak"));
      return;
    }
    try {
      if (currentState === "password-recovery") {
        // ? Password Recovery Request
        const response = await requestPasswordRecovery(email);
        if (response.success) {
          toast.success(response.message);
          setCurrentState("login");
        } else {
          toast.error(response.message);
        }
      } else if (currentState === "sign-up") {
        // ? Sign up
        const response = await axios.post<
          RegisterResponseBody,
          AxiosResponse<RegisterResponseBody>,
          RegisterRequestBody
        >(backendUrl + "/api/user/register", { name, email, password });
        if (response.data.success) {
          setToken(response.data.token!, response.data.userId);
          localStorage.setItem("token", response.data.token!);
          localStorage.setItem("userId", response.data.userId);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // ? Login
        const reqBody: LoginRequestBody = { email, password };
        const response = await axios.post<
          LoginResponseBody,
          AxiosResponse<LoginResponseBody>,
          LoginRequestBody
        >(backendUrl + "/api/user/login", reqBody, {
          params: { lng: i18n.language },
        });
        if (response.data.success) {
          setToken(response.data.token!, response.data.userId);
          localStorage.setItem("token", response.data.token!);
          localStorage.setItem("userId", response.data.userId);
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
        <div className="w-full">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder={t("login.password")}
            required
          />
          {currentState === "sign-up" && password && (
            <div className="mt-1 text-sm">
              <p
                className={`font-medium ${
                  passwordStrength.score < 2
                    ? "text-red-600"
                    : passwordStrength.score === 2
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {t("login.password-strength")}: {passwordStrength.score}
              </p>
              {passwordStrength.feedback && (
                <p className="text-gray-600">{passwordStrength.feedback}</p>
              )}
            </div>
          )}
        </div>
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
        {currentState === "login"
          ? t("login.sign-in-btn")
          : currentState === "sign-up"
          ? t("login.sign-up-btn")
          : t("login.recover-password-btn")}
      </button>
    </form>
  );
};

export default Login;
