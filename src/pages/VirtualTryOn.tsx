import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { VtonStatus } from "../types/vton";
import { useShopStore } from "../store/store";
import { createTryOn, fetchProductsById } from "../utils/api";
import { ProductData } from "../types/product";
import Title from "../components/Title";

const VirtualTryOn: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { token } = useShopStore();
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<VtonStatus | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prod, setProd] = useState<ProductData | undefined>(undefined);

  // Обробка вибору зображення
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPersonImage(file);
      setPersonImagePreview(URL.createObjectURL(file));
    }
  };

  // Запуск генерації
  const handleGenerate = async () => {
    if (!personImage || !productId || !token) {
      toast.error(t("vton.missing-image-or-product"));
      return;
    }

    setIsLoading(true);
    setStatus(VtonStatus.processing);
    const result = await createTryOn(productId, token, personImage);
    setIsLoading(false);

    if (result && result.success && result.vton) {
      setStatus(result.vton.status);
      if (result.vton.generatedImageUrl) {
        setGeneratedImageUrl(result.vton.generatedImageUrl);
        if (result.vton.generatedImageUrl) {
          setGeneratedImageUrl(result.vton.generatedImageUrl);
        } else {
          toast.error(t("cloudinary.sign-error"));
          setStatus(VtonStatus.error);
        }
      }
      if (result.vton.status === VtonStatus.complete) {
        toast.success(t("vton.generation-complete"));
      } else if (result.vton.status === VtonStatus.error) {
        toast.error(t("vton.generation-error"));
      }
    } else {
      setStatus(VtonStatus.error);
      toast.error(result ? result.message : t("error.network-or-timeout"));
    }
  };

  // Очистка при розмонтуванні
  useEffect(() => {
    return () => {
      if (personImagePreview) URL.revokeObjectURL(personImagePreview);
    };
  }, [personImagePreview]);

  // Перевірка productId і token
  useEffect(() => {
    if (!productId) {
      toast.error(t("vton.no-prod-id"));
      navigate("/");
      return;
    }
    fetchProductsById(productId).then((data) => {
      if (!data || !data.products || data.products.length === 0) {
        toast.error(t("vton.product-not-found"));
        navigate("/");
      } else if (!token) {
        toast.error(t("user.not-authenticated"));
        navigate("/login");
      } else {
        setProd(data.products[0]);
      }
    });
  }, [productId, token, navigate, t]);

  return (
    <div className="border-t-2 pt-4 transition-opacity ease-in-out opacity-100 max-w-5xl mx-auto">
      <h1 className="font-semibold text-3xl text-center mb-8">
        <Title text={t("vton.title")} />
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Блок 1: Зображення товару */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">{t("vton.product-image")}</h2>
          <div className="relative w-full max-w-sm h-[450px]">
            {prod?.vtonImage ? (
              <img
                src={prod.vtonImage}
                alt={prod.name_en}
                className="w-full h-full object-cover border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg">
                <p className="text-gray-500">{t("vton.no-image")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Блок 2: Зображення користувача */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">{t("vton.user-image")}</h2>
          <div className="relative w-full max-w-sm h-[450px] group">
            {personImagePreview ? (
              <img
                src={personImagePreview}
                alt="User upload"
                className="w-full h-full object-cover border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                <p className="text-gray-500 group-hover:text-gray-100">
                  {t("vton.upload-placeholder")}
                </p>
              </div>
            )}
            <label htmlFor="personImage">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-lg">
                <span className="text-white text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {personImagePreview ? t("vton.replace-photo") : t("vton.add-photo")}
                </span>
              </div>
            </label>
            <input
              id="personImage"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Блок 3: Результат */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">{t("vton.result")}</h2>
          <div className="relative w-full max-w-sm h-[450px]">
            {generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt="Generated result"
                className="w-full h-full object-cover border border-gray-300 rounded-lg"
              />
            ) : status === VtonStatus.processing ? (
              <div className="w-full h-full flex items-center justify-center border border-gray-400 rounded-lg bg-gray-100">
                <p className="text-gray-600">{t("vton.v-progress")}</p>
              </div>
            ) : status === VtonStatus.error ? (
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

      {/* Кнопка генерації */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !personImage || !productId || !token}
          className={`bg-gray-900 text-white rounded-lg px-10 py-4 text-base font-semibold w-full max-w-sm hover:bg-gray-800 active:bg-gray-700 transition-colors ${
            isLoading || !personImage || !productId || !token ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? t("vton.processing") : t("vton.v-try-on")}
        </button>
      </div>
    </div>
  );
};

export default VirtualTryOn;
