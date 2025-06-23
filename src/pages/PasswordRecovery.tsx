import zxcvbn from "zxcvbn";
import React, { FormEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordRecovery } from "../utils/api";

const PasswordRecovery: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });

  // Перевірка міцності пароля
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
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
  }, [password, t]);

  const onSubmitHandler: FormEventHandler = async (event) => {
    event.preventDefault();
    if (passwordStrength.score < 2) {
      toast.error(t("login.password-too-weak"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("login.passwords-dont-match"));
      return;
    }

    try {
      const token = searchParams.get("token");
      if (!token) {
        toast.error(t("login.invalid-token"));
        return;
      }

      const response = await confirmPasswordRecovery(token, password);
      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        toast.error(response.message);
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
        <p className="prata-regular text-3xl">{t("login.reset-password")}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <div className="w-full">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder={t("login.new-password")}
          required
        />
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          className="w-full px-3 py-2 border border-gray-800 mt-2"
          placeholder={t("login.confirm-password")}
          required
        />
        {password && (
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
      <div className="w-full flex justify-end text-sm mt-[-8px]">
        <p onClick={() => navigate("/login")} className="cursor-pointer">
          {t("login.goto-login")}
        </p>
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {t("login.reset-password-btn")}
      </button>
    </form>
  );
};

export default PasswordRecovery;
