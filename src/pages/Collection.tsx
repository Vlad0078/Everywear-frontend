import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { fetchProducts, useShopStore } from "../store/store";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { ProductData } from "../types/products";
import ProductItem from "../components/ProductItem";

const Collection: React.FC = () => {
  const { t } = useTranslation();

  const products = useShopStore((state) => state.products);
  const search = useShopStore((state) => state.search);
  const showSearch = useShopStore((state) => state.showSearch);

  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState("relevant");

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleCategory: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    return productsCopy;
  }, [category, products, search, showSearch, subCategory]);

  const sortProducts = useCallback(
    (products: ProductData[]) => {
      const productCopy = products.slice();
      switch (sortType) {
        case "low-high":
          return productCopy.sort((a, b) => a.price - b.price);

        case "high-low":
          return productCopy.sort((a, b) => b.price - a.price);

        default:
          return products;
      }
    },
    [sortType]
  );

  useEffect(() => {
    const filtered = applyFilter();
    const sorted = sortProducts(filtered);
    setFilteredProducts(sorted);
  }, [applyFilter, sortProducts]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* //* Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter((state) => !state)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          {t("filters.title")}{" "}
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* //? Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">{t("filters.categories")}</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleCategory}
                className="w-3"
                value="Men"
              />{" "}
              {t("filters.men")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleCategory}
                className="w-3"
                value="Women"
              />{" "}
              {t("filters.women")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleCategory}
                className="w-3"
                value="Kids"
              />{" "}
              {t("filters.kids")}
            </p>
          </div>
        </div>
        {/* //? SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">{t("filters.type")}</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleSubCategory}
                className="w-3"
                value="Topwear"
              />{" "}
              {t("filters.topwear")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleSubCategory}
                className="w-3"
                value="Bottomwear"
              />{" "}
              {t("filters.bottomwear")}
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                onChange={toggleSubCategory}
                className="w-3"
                value="Winterwear"
              />{" "}
              {t("filters.winterwear")}
            </p>
          </div>
        </div>
      </div>
      {/* //* Main Content (Product List) */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text={t("collection-page.all-collections")} />
          {/* //? Sorting Products*/}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">
              {t("sort.sort-by")}: {t("sort.relevant")}
            </option>
            <option value="low-high">
              {t("sort.sort-by")}: {t("sort.low-high")}
            </option>
            <option value="high-low">
              {t("sort.sort-by")}: {t("sort.high-low")}
            </option>
          </select>
        </div>
        {/* //? Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filteredProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
