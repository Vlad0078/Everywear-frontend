import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../store/store";
import { getTryOnHistory } from "../utils/api";
import { Vton, VtonStatus } from "../types/vton";

const TryOnHistory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useShopStore();
  const [history, setHistory] = useState<Vton[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Отримання історії примірок
  const fetchHistory = async () => {
    if (!token) {
      toast.error(t("user.not-authenticated"));
      navigate("/login");
      return;
    }

    setIsLoading(true);
    const result = await getTryOnHistory(token);
    setIsLoading(false);

    if (result && result.success && result.history) {
      setHistory(result.history);
      console.log(result.history);
    } else {
      toast.error(result ? result.message : t("error.network-or-timeout"));
    }
  };

  // Перевірка token і завантаження історії
  useEffect(() => {
    fetchHistory();
  }, [token, navigate, t]);

  return (
    <div className="border-t-2 pt-4 transition-opacity ease-in-out opacity-100 max-w-5xl mx-auto">
      <h1 className="font-semibold text-3xl text-center mb-8">{t("vton.history-title")}</h1>
      {isLoading ? (
        <div className="text-center text-gray-600">{t("vton.loading")}</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500">{t("vton.no-history")}</div>
      ) : (
        <div className="space-y-8">
          {history.map((tryOn) => (
            <div key={tryOn._id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Зображення користувача */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">{t("vton.user-image")}</h2>
                <div className="relative w-full max-w-sm h-[450px]">
                  {tryOn.personImageUrl ? (
                    <img
                      src={tryOn.personImageUrl}
                      alt="User image"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                      <p className="text-gray-500">{t("vton.no-image")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Зображення одягу */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">{t("vton.product-image")}</h2>
                <div className="relative w-full max-w-sm h-[450px]">
                  {tryOn.clothingImageUrl ? (
                    <img
                      src={tryOn.clothingImageUrl}
                      alt="Clothing image"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                      <p className="text-gray-500">{t("vton.no-image")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Результат генерації */}
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4">{t("vton.result")}</h2>
                <div className="relative w-full max-w-sm h-[450px]">
                  {tryOn.generatedImageUrl ? (
                    <img
                      src={tryOn.generatedImageUrl}
                      alt="Generated result"
                      className="w-full h-full object-cover border border-gray-300 rounded-lg"
                    />
                  ) : tryOn.status === VtonStatus.processing ? (
                    <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                      <p className="text-gray-600">{t("vton.v-progress")}</p>
                    </div>
                  ) : tryOn.status === VtonStatus.error ? (
                    <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                      <p className="text-red-500">{t("vton.generation-error")}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                      <p className="text-gray-500">{t("vton.no-result")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TryOnHistory;
