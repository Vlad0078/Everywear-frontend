import React, { useEffect, useState } from "react";
import MyTable from "../components/UI/MyTable";
import { useTranslation } from "react-i18next";
import { SizeTable } from "../types/size";
import { fetchSizeTables } from "../utils/api";
import Title from "../components/Title";

const SizeTables: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sizeTables, setSizeTables] = useState<SizeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"clothing" | "shoes">("clothing");

  // Завантаження розмірних сіток
  useEffect(() => {
    const loadSizeTables = async () => {
      try {
        const response = await fetchSizeTables();
        setSizeTables(response.sizeTables || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load size tables");
        setLoading(false);
      }
    };
    loadSizeTables();
  }, []);

  // Формування матриці для взуттєвих сіток
  const getShoeMatrix = (sizeTable: SizeTable): string[][] => {
    const headers = ["EU", "UK", "US", t("size-tables.foot-length-header")];
    const rows = sizeTable.sizes.map((size) => [
      size.sizeEU || "",
      size.sizeUK || "",
      size.sizeUS || "",
      size.measurements.footLength || "",
    ]);
    return [headers, ...rows];
  };

  // Формування матриці для сіток одягу
  const getClothingMatrix = (sizeTable: SizeTable): string[][] => {
    if (["Men's Clothing", "Women's Clothing"].includes(sizeTable.title_en)) {
      const headers = [
        "US",
        "UA",
        "UK",
        t("size-tables.chest-header"),
        t("size-tables.waist-length-header"),
        t("size-tables.hips-length-header"),
      ];
      const rows = sizeTable.sizes.map((size) => [
        size.size || "",
        size.sizeUA || "",
        size.sizeUK || "",
        size.measurements.chest || "",
        size.measurements.waist || "",
        size.measurements.hips || "",
      ]);
      return [headers, ...rows];
    } else {
      const headers = [
        "US",
        "UK",
        // "FR",
        // "DE",
        t("size-tables.age-header") + "*",
        t("size-tables.height-header"),
        t("size-tables.chest-header"),
        t("size-tables.waist-length-header"),
        t("size-tables.hips-length-header"),
      ];
      const rows = sizeTable.sizes.map((size) => [
        size.size || "",
        size.sizeUK || "",
        // size.sizeFR || "",
        // size.sizeDE || "",
        size.measurements.age || "",
        size.measurements.height || "",
        size.measurements.chest || "",
        size.measurements.waist || "",
        size.measurements.hips || "",
      ]);
      return [headers, ...rows];
    }
  };

  // Фільтрація взуттєвих сіток
  const shoeTables = sizeTables.filter((table) =>
    ["Kids' Shoes", "Women's Shoes", "Men's Shoes"].includes(table.title_en)
  );

  // Фільтрація сіток одягу
  const clothingTables = sizeTables.filter((table) =>
    [
      "Men's Clothing",
      "Women's Clothing",
      "Baby Clothing",
      "Boys' Clothing",
      "Girls' Clothing",
    ].includes(table.title_en)
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="md:px-16 lg:px-24 xl:px-36 2xl:px-52">
      <div className="text-center py-4 text-2xl md:text-3xl">
        <Title text={t("size-tables.title")} />
      </div>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm w-64" role="group">
          <button
            type="button"
            className={`w-1/2 px-4 py-2 text-sm font-medium border border-gray-200 transition-colors duration-200 ${
              activeTab === "clothing"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } rounded-l-md`}
            onClick={() => setActiveTab("clothing")}
          >
            {t("size-tables.clothing")}
          </button>
          <button
            type="button"
            className={`w-1/2 px-4 py-2 text-sm font-medium border border-gray-200 border-l-0 transition-colors duration-200 ${
              activeTab === "shoes"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } rounded-r-md`}
            onClick={() => setActiveTab("shoes")}
          >
            {t("size-tables.shoes")}
          </button>
        </div>
      </div>
      {activeTab === "clothing" && clothingTables.length > 0 && (
        <div>
          {clothingTables.map((table) => (
            <div key={table.title_en} className="mb-12">
              <h2 className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
                {i18n.language === "uk" ? table.title_uk : table.title_en}
              </h2>
              <MyTable matrix={getClothingMatrix(table)} />
              {["Baby Clothing", "Boys' Clothing", "Girls' Clothing"].includes(table.title_en) && (
                <p className="text-sm text-gray-500 mt-2">* {t("size-tables.age-footnote")}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {activeTab === "shoes" && shoeTables.length > 0 && (
        <div>
          {shoeTables.map((table) => (
            <div key={table.title_en} className="mb-12">
              <h2 className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
                {i18n.language === "uk" ? table.title_uk : table.title_en}
              </h2>
              <MyTable matrix={getShoeMatrix(table)} />
            </div>
          ))}
        </div>
      )}
      <div className="mt-12">
        <h3 className="text-lg md:text-2xl text-gray-700 font-medium mb-4">
          {t("size-tables.measurement-guide.title")}
        </h3>
        <p className="text-sm md:text-base text-gray-700 mb-4">
          {t("size-tables.measurement-guide.intro")}
        </p>
        <ul className="list-disc list-inside text-sm md:text-base text-gray-600 space-y-2 mb-4">
          <li>{t("size-tables.measurement-guide.chest")}</li>
          <li>{t("size-tables.measurement-guide.waist")}</li>
          <li>{t("size-tables.measurement-guide.hips")}</li>
          <li>{t("size-tables.measurement-guide.footlength")}</li>
        </ul>
        <p className="text-sm md:text-base text-gray-500">
          {t("size-tables.measurement-guide.tip")}
        </p>
      </div>
    </div>
  );
};

export default SizeTables;
