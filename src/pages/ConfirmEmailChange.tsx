import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setToken } from "../store/store";
import { confirmEmailChange } from "../utils/api";

const ConfirmEmailChange: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setIsLoading(false);
        toast.error(t("user.invalid-token"));
        return;
      }

      const result = await confirmEmailChange({ token });
      if (result && result.success) {
        // Очистити token і userId, оскільки email змінився
        setToken("", "");
        setIsSuccess(true);
        toast.success(t("user.email-changed"));
      } else {
        toast.error(result ? result.message : t("error.undefined-error"));
      }
      setIsLoading(false);
    };

    confirmEmail();
  }, [searchParams, t]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  if (isLoading) {
    return <div className="text-center mt-10">{t("user.loading")}</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-4xl mx-auto text-center">
      <h1 className="font-medium text-2xl mt-2">{t("user.email-change-title")}</h1>
      {isSuccess ? (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-gray-700">{t("user.email-changed")}</p>
          <button
            onClick={handleGoToLogin}
            className="bg-black text-white px-8 py-3 text-sm font-semibold w-full max-w-xs mx-auto hover:bg-gray-800 active:bg-gray-700 transition-colors"
          >
            {t("user.go-to-login")}
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-gray-700">{t("user.invalid-token")}</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmEmailChange;
