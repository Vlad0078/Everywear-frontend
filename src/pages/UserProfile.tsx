import React, { useState, useEffect, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { UserPublicInfo } from "../types/user";
import { assets } from "../assets/assets";
import { clearCart, setToken, useShopStore } from "../store/store";
import {
  fetchUserInfo,
  updateProfile,
  changePassword,
  requestEmailChange,
  deleteUserProfile,
} from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { token, userId } = useShopStore();

  const navigate = useNavigate();

  // Стан для даних користувача
  const [user, setUser] = useState<UserPublicInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Стан для форми профілю
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    phone: "",
  });

  // Стан для зображення профілю
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(assets.default_user_image);

  // Стан для форми зміни пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Стан для форми зміни email
  const [newEmail, setNewEmail] = useState("");

  // Стан для видалення профілю
  const [deletePassword, setDeletePassword] = useState("");

  // Завантаження даних користувача
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token || !userId) {
        setIsLoading(false);
        toast.error(t("user.unauthorized"));
        return;
      }

      const result = await fetchUserInfo(userId, token);
      console.log(result);

      if (result && result.success && result.userInfo) {
        setUser(result.userInfo!);

        setProfileData({
          firstName: result.userInfo!.firstName || "",
          lastName: result.userInfo!.lastName || "",
          patronymic: result.userInfo!.patronymic || "",
          phone: result.userInfo!.phone || "",
        });
        setProfileImageUrl(result.userInfo!.profilePicture || assets.default_user_image);
      }
      setIsLoading(false);
    };

    loadUserProfile();
  }, [token, userId, t]);

  // Обробка вибору зображення
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    } else {
      toast.error(t("user.invalid-image-format"));
    }
    e.target.value = "";
  };

  // Оновлення профілю
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !userId) {
      toast.error(t("user.unauthorized"));
      return;
    }

    const result = await updateProfile(
      {
        ...profileData,
        profilePicture: profileImage || undefined,
      },
      token
    );
    if (result && result.success && result.user) {
      setUser(result.user);
      setProfileImage(null);
      setProfileImageUrl(result.user.profilePicture || assets.default_user_image);
      toast.success(t("user.profile-updated"));
    }
  };

  // Зміна пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !userId) {
      toast.error(t("user.unauthorized"));
      return;
    }

    const result = await changePassword({ ...passwordData }, token);
    if (result && result.success) {
      setPasswordData({ currentPassword: "", newPassword: "" });
      toast.success(t("user.password-changed"));
    }
  };

  // Запит на зміну email
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !userId) {
      toast.error(t("user.unauthorized"));
      return;
    }

    const result = await requestEmailChange({ newEmail }, token);
    if (result && result.success) {
      setNewEmail("");
      toast.success(t("user.email-change-requested"));
    }
  };

  // Видалення профілю
  const handleDeleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !userId) {
      toast.error(t("user.unauthorized"));
      return;
    }

    const result = await deleteUserProfile({ password: deletePassword }, token);
    if (result && result.success) {
      setDeletePassword("");
      localStorage.removeItem("token");
      setToken("", "");
      clearCart();
      navigate("/login");
      toast.success(t("user.profile-deleted"));
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">{t("user.loading")}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10">{t("user.unauthorized")}</div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 max-w-4xl mx-auto">
      <h1 className="font-medium text-2xl mt-2">{t("user.profile-title")}</h1>
      <div className="flex flex-col gap-6 mt-8">
        {/* Зображення профілю */}
        <div className="relative w-48 h-48 group self-center">
          <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          <label htmlFor="profileImage">
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profileImageUrl === assets.default_user_image
                  ? t("user.add-photo")
                  : t("user.replace-photo")}
              </span>
            </div>
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Форма оновлення профілю */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("user.edit-profile")}</h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-500 mb-1">{t("user.firstName")}</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.firstName-placeholder")}
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">{t("user.lastName")}</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.lastName-placeholder")}
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">{t("user.patronymic")}</label>
              <input
                type="text"
                value={profileData.patronymic}
                onChange={(e) => setProfileData({ ...profileData, patronymic: e.target.value })}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.patronymic-placeholder")}
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">{t("user.phone")}</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.phone-placeholder")}
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm font-semibold w-full hover:bg-gray-800 active:bg-gray-700 transition-colors"
            >
              {t("user.save-profile")}
            </button>
          </form>
        </div>

        {/* Форма зміни пароля */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("user.security-settings")}</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-500 mb-1">{t("user.currentPassword")}</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.currentPassword-placeholder")}
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">{t("user.newPassword")}</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.newPassword-placeholder")}
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm font-semibold w-full hover:bg-gray-800 active:bg-gray-700 transition-colors"
            >
              {t("user.change-password")}
            </button>
          </form>
        </div>

        {/* Форма зміни email */}
        <div>
          <form onSubmit={handleRequestEmailChange} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-500 mb-1">{t("user.newEmail")}</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.newEmail-placeholder")}
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 text-sm font-semibold w-full hover:bg-gray-800 active:bg-gray-700 transition-colors"
            >
              {t("user.request-email-change")}
            </button>
          </form>
        </div>

        {/* Форма видалення профілю */}
        <div>
          <form onSubmit={handleDeleteProfile} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-500 mb-1">{t("user.deletePassword")}</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full"
                placeholder={t("user.deletePassword-placeholder")}
              />
            </div>
            <button
              type="submit"
              className="text-red-500 text-sm font-semibold w-full text-left hover:text-red-600 active:text-red-700 transition-colors"
            >
              {t("user.delete-profile")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
