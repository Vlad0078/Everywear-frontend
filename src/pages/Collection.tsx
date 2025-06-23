import React, { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { useShopStore } from "../store/store";
import { useTranslation } from "react-i18next";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { ProductData } from "../types/product";
import ProductItem from "../components/ProductItem";
import i18n from "../i18n";
import { fetchProducts } from "../utils/api";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-headless-accordion";
import { produce } from "immer";
import { Size } from "../types/size";
import { Brand } from "../types/brand";
import { Color } from "../types/color";
import SearchBar from "../components/SearchBar";
import { Slider, TextField } from "@mui/material";

interface FilterDropdowns {
  category: {
    header: boolean;
    [key: string]: boolean;
  };
  size: boolean;
  color: boolean;
  brand: boolean;
}

interface CollectionParams {
  target: "men" | "women" | "kids";
}

const Collection: React.FC<CollectionParams> = ({ target }) => {
  const { t } = useTranslation();
  const allCategories = useShopStore((state) => state.categories);
  const allSubcategories = useShopStore((state) => state.subcategories);

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [simpleCategories, setSimpleCategories] = useState<{ _id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);

  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);

  // filters
  const [filtersUpdated, setFiltersUpdated] = useState(true);
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [sizesId, setSizesId] = useState<string[]>([]);
  const [brandsId, setBrandsId] = useState<string[]>([]);
  const [colorsId, setColorsId] = useState<string[]>([]);
  const [sortType, setSortType] = useState<"newest" | "low-high" | "high-low">("newest");
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(20000);
  const [minPriceInput, setMinPriceInput] = useState<string>("0");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("20000");

  const [filterDropdowns, setFilterDropdowns] = useState<FilterDropdowns>({
    category: {
      header: true,
    },
    size: true,
    brand: true,
    color: true,
  });

  // initial
  useEffect(() => {
    // reset
    setSubcategoryId("");

    setSimpleCategories(
      allCategories
        .filter((category) => category.target === target)
        .map((category) => ({
          _id: category._id,
          name: i18n.language === "uk" ? category.name_uk : category.name_en,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
		);
		setProductsLoaded(false)
    fetchProducts({ target }).then((data) => {
      if (data && data.products) {
				setProducts(data.products);
				setProductsLoaded(true)
        const maxProductPrice = Math.max(...data.products.map((p) => p.price), 20000);
        setMaxPriceLimit(maxProductPrice);
        setPriceRange([0, maxProductPrice]);
        setMaxPriceInput(maxProductPrice.toString());
      }
    });
  }, [allCategories, target, t]);

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setMinPriceInput((newValue as number[])[0].toString());
    setMaxPriceInput((newValue as number[])[1].toString());
  };

  const handlePriceChangeCommitted = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
    setMinPriceInput((newValue as number[])[0].toString());
    setMaxPriceInput((newValue as number[])[1].toString());
    if ((newValue as number[])[1] < 40000) {
      setMaxPriceLimit(40000);
    }
    setFiltersUpdated(true);
  };

  const handleMinPriceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinPriceInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= priceRange[1]) {
      setPriceRange([numValue, priceRange[1]]);
      setFiltersUpdated(true);
    }
  };

  const handleMaxPriceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxPriceInput(value);
    const numValue = parseFloat(value);
    if (numValue > maxPriceLimit) {
      setMaxPriceLimit(numValue);
    } else if (numValue < 40000) {
      setMaxPriceLimit(40000);
    }
    setPriceRange([priceRange[0], numValue]);
    setFiltersUpdated(true);
  };

  const selectSubcategory: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSubcategoryId(e.target.value);
    setFiltersUpdated(true);
  };

  const toggleBrand: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (brandsId.includes(e.target.value)) {
      setBrandsId((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setBrandsId((prev) => [...prev, e.target.value]);
    }
    setFiltersUpdated(true);
  };

  const toggleSize: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (sizesId.includes(e.target.value)) {
      setSizesId((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSizesId((prev) => [...prev, e.target.value]);
    }
    setFiltersUpdated(true);
  };

  const toggleColor: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (colorsId.includes(e.target.value)) {
      setColorsId((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setColorsId((prev) => [...prev, e.target.value]);
    }
    setFiltersUpdated(true);
  };

  const applyFilters = useCallback(async () => {
    if (filtersUpdated) {
      let sortField: string, sortDesc: boolean;
      switch (sortType) {
        case "low-high":
          sortField = "price";
          sortDesc = false;
          break;
        case "high-low":
          sortField = "price";
          sortDesc = true;
          break;
        default:
          sortField = "createdAt";
          sortDesc = true;
          break;
			}
			setProductsLoaded(false)
      fetchProducts({
        target,
        subcategoriesId: subcategoryId ? [subcategoryId] : undefined,
        brandsId: brandsId.length ? brandsId : undefined,
        sizesId: sizesId.length ? sizesId : undefined,
        colorsId: colorsId.length ? colorsId : undefined,
        sortField,
        sortDesc,
        name_uk: search,
        min_price: priceRange[0],
        max_price: priceRange[1],
      }).then((data) => {
        if (data && data.products) {
					setProducts(data.products);
					setProductsLoaded(true)
          if (data.availBrands) {
            setAllBrands(data.availBrands);
          }
          if (data.availSizes) {
            setAllSizes(data.availSizes);
          }
          if (data.availColors) {
            setAllColors(data.availColors);
          }
        }
      });

      setFiltersUpdated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersUpdated, target]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <>
      <SearchBar search={search} setSearch={setSearch} setFiltersUpdated={setFiltersUpdated} />
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        {/* //? ********************* Filters */}
        <div className="min-w-60 max-w-[14.5rem]">
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
          {/* //? Price Filter */}
          <div
            className={`text-base text-gray-700 border border-gray-300 px-5 py-3 mt-6 sm:block ${
              showFilter ? "" : "hidden"
            }`}
          >
            <p className="text-base font-medium pb-2">{t("filters.price")}</p>
            <div className="w-[80%]]">
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                onChangeCommitted={() => handlePriceChangeCommitted}
                valueLabelDisplay="auto"
                min={0}
                max={maxPriceLimit}
                step={10}
              />
              <div className="flex justify-between items-center mt-2">
                <TextField
                  value={minPriceInput}
                  onChange={handleMinPriceInputChange}
                  type="number"
                  size="small"
                  sx={{ width: "47%" }}
                  inputProps={{ min: 0, max: priceRange[1] }}
                  InputProps={{
                    sx: {
                      // Chrome, Safari, Edge
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                        display: "none",
                      },
                      // Firefox
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    },
                  }}
                />
                -
                <TextField
                  value={maxPriceInput}
                  onChange={handleMaxPriceInputChange}
                  type="number"
                  size="small"
                  sx={{ width: "47%" }}
                  inputProps={{ min: priceRange[0], max: maxPriceLimit }}
                  InputProps={{
                    sx: {
                      // Chrome, Safari, Edge
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                        display: "none",
                      },
                      // Firefox
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* //? Category Filter */}
          <div
            className={`text-base text-gray-700 border border-gray-300 pl-5 py-3 mt-6 sm:block ${
              showFilter ? "" : "hidden"
            }`}
          >
            <Accordion alwaysOpen transition={{ duration: "300ms" }}>
              <AccordionItem isActive>
                <AccordionHeader as="div">
                  <div
                    onClick={() =>
                      setFilterDropdowns((state) =>
                        produce(state, (draft) => {
                          draft.category.header = !draft.category.header;
                        })
                      )
                    }
                    className="cursor-pointer flex gap-4 items-center"
                  >
                    <p className="text-base font-medium">{t("filters.categories")}</p>
                    <img
                      src={assets.dropdown_icon}
                      className={`h-3 ${
                        filterDropdowns.category.header ? "-" : " "
                      }rotate-90 transition-transform duration-300`}
                      alt=""
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body">
                    <div className="h-1"></div>
                    {simpleCategories.map((category, index) => (
                      <AccordionItem key={index} isActive>
                        <AccordionHeader as="div">
                          <div className="h-2"></div>
                          <div
                            onClick={() =>
                              setFilterDropdowns((state) =>
                                produce(state, (draft) => {
                                  if (!(category._id in draft.category)) {
                                    draft.category[category._id] = true;
                                  }
                                  draft.category[category._id] = !draft.category[category._id];
                                })
                              )
                            }
                            className="cursor-pointer flex gap-4 items-center"
                          >
                            <p className="flex gap-2 cursor-pointer font-medium">{category.name}</p>
                            <img
                              src={assets.dropdown_icon}
                              className={`h-3 ${
                                filterDropdowns.category[category._id] !== false ? "-" : " "
                              }rotate-90 transition-transform duration-300`}
                              alt=""
                            />
                          </div>
                        </AccordionHeader>
                        <AccordionBody>
                          <div className="accordion-body font-normal">
                            <div className="h-1"></div>
                            {/* //* Subcategories */}
                            {allSubcategories
                              .filter((subcat) => subcat.categoryId === category._id)
                              .map((subcat, index) => (
                                <label
                                  htmlFor={`categoryFilter${subcat._id}`}
                                  key={index}
                                  className="flex gap-2 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    checked={subcategoryId === subcat._id}
                                    onChange={selectSubcategory}
                                    className="w-3"
                                    value={subcat._id}
                                    id={`categoryFilter${subcat._id}`}
                                  />
                                  {i18n.language === "uk" ? subcat.name_uk : subcat.name_en}
                                </label>
                              ))}
                          </div>
                        </AccordionBody>
                      </AccordionItem>
                    ))}
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
          {/* //? Brands Filter */}
          <div
            className={`text-base text-gray-700 border border-gray-300 pl-5 py-3 mt-6 ${
              subcategoryId ? "sm:block" : ""
            } ${showFilter && subcategoryId ? "" : "hidden"}`}
          >
            <Accordion alwaysOpen transition={{ duration: "300ms" }}>
              <AccordionItem isActive>
                <AccordionHeader as="div">
                  <div
                    onClick={() =>
                      setFilterDropdowns((state) =>
                        produce(state, (draft) => {
                          draft.brand = !draft.brand;
                        })
                      )
                    }
                    className="cursor-pointer flex gap-4 items-center"
                  >
                    <p className="text-base font-medium">{t("filters.brands")}</p>
                    <img
                      src={assets.dropdown_icon}
                      className={`h-3 ${
                        filterDropdowns.brand ? "-" : " "
                      }rotate-90 transition-transform duration-300`}
                      alt=""
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body font-normal">
                    <div className="h-3"></div>
                    {/* //* Brands */}
                    {allBrands.map((brand, index) => (
                      <label
                        htmlFor={`brandFilter${brand._id}`}
                        key={index}
                        className="flex gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={brandsId.includes(brand._id)}
                          onChange={toggleBrand}
                          className="w-3"
                          value={brand._id}
                          id={`brandFilter${brand._id}`}
                        />
                        {brand.name}
                      </label>
                    ))}
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
          {/* //? Sizes Filter */}
          <div
            className={`text-base text-gray-700 border border-gray-300 pl-5 py-3 mt-6 ${
              subcategoryId ? "sm:block" : ""
            } ${showFilter && subcategoryId ? "" : "hidden"}`}
          >
            <Accordion alwaysOpen transition={{ duration: "300ms" }}>
              <AccordionItem isActive>
                <AccordionHeader as="div">
                  <div
                    onClick={() =>
                      setFilterDropdowns((state) =>
                        produce(state, (draft) => {
                          draft.size = !draft.size;
                        })
                      )
                    }
                    className="cursor-pointer flex gap-4 items-center"
                  >
                    <p className="text-base font-medium">{t("filters.sizes")}</p>
                    <img
                      src={assets.dropdown_icon}
                      className={`h-3 ${
                        filterDropdowns.size ? "-" : " "
                      }rotate-90 transition-transform duration-300`}
                      alt=""
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body font-normal">
                    <div className="h-3"></div>
                    {/* //* Sizes */}
                    {allSizes.map((size, index) => (
                      <label
                        htmlFor={`sizeFilter${size._id}`}
                        key={index}
                        className="flex gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={sizesId.includes(size._id)}
                          onChange={toggleSize}
                          className="w-3"
                          value={size._id}
                          id={`sizeFilter${size._id}`}
                        />
                        {size.size}
                      </label>
                    ))}
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
          {/* //? Colors Filter */}
          <div
            className={`text-base text-gray-700 border border-gray-300 pl-5 py-3 mt-6 ${
              subcategoryId ? "sm:block" : ""
            } ${showFilter && subcategoryId ? "" : "hidden"}`}
          >
            <Accordion alwaysOpen transition={{ duration: "300ms" }}>
              <AccordionItem isActive>
                <AccordionHeader as="div">
                  <div
                    onClick={() =>
                      setFilterDropdowns((state) =>
                        produce(state, (draft) => {
                          draft.color = !draft.color;
                        })
                      )
                    }
                    className="cursor-pointer flex gap-4 items-center"
                  >
                    <p className="text-base font-medium">{t("filters.colors")}</p>
                    <img
                      src={assets.dropdown_icon}
                      className={`h-3 ${
                        filterDropdowns.color ? "-" : " "
                      }rotate-90 transition-transform duration-300`}
                      alt=""
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="accordion-body font-normal">
                    <div className="h-3"></div>
                    {/* //* Colors */}
                    {allColors.map((color, index) => (
                      <label
                        htmlFor={`colorFilter${color._id}`}
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={colorsId.includes(color._id)}
                          onChange={toggleColor}
                          className="w-3"
                          value={color._id}
                          id={`colorFilter${color._id}`}
                        />
                        <div
                          className="rounded-full w-4 h-4 border border-gray-300"
                          style={{
                            backgroundColor: color.hex,
                          }}
                        ></div>
                        {i18n.language === "uk" ? color.name_uk : color.name_en}
                      </label>
                    ))}
                  </div>
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
          {/* //? SubCategory Filter */}
        </div>
        {/* //? ************************* Main Content (Product List) */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <div className="hidden sm:block">
              <Title text={t(`collection-page.${target}-collection`)} />
            </div>
            {/* //? Sorting Products*/}
            <select
              onChange={(e) => {
                setSortType(e.target.value as typeof sortType);
                setFiltersUpdated(true);
              }}
              className="border-2 border-gray-300 text-sm px-2 min-h-11 mt-4 mb-2 sm:my-0"
            >
              <option value="newest">
                {t("sort.sort-by")}: {t("sort.newest")}
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
            {products.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                images={item.images}
                name={i18n.language === "uk" ? item.name_uk : item.name_en}
                price={item.price}
              />
            ))}
          </div>
          {products.length === 0 ? (
            productsLoaded ? (
              <p className="text-xl text-gray-700 font-normal text-center py-8">
                {t("collection-page.no-products")}
              </p>
            ) : (
              <p className="text-xl text-gray-700 font-normal text-center py-8">
                {t("collection-page.loading")}
              </p>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Collection;
