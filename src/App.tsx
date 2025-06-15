import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { loadUserCart, loadCategories, loadSubcategories } from "./store/store";
import Verify from "./pages/Verify";
import ShippingPayment from "./pages/ShippingPayment";
import SizeTables from "./pages/SizeTables";
import UserProfile from "./pages/UserProfile";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import VirtualTryOn from "./pages/VirtualTryOn";
import TryOnHistory from "./pages/TryOnHistory";

const App: React.FC = () => {
  useEffect(() => {
    loadCategories();
    loadSubcategories();
    loadUserCart(); // ! тут може бути помилка бо products ще не завантажились
    console.log("App Loaded");
  }, []);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/collection/women" element={<Collection target="women" />}></Route>
        <Route path="/collection/men" element={<Collection target="men" />}></Route>
        <Route path="/collection/kids" element={<Collection target="kids" />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/delivery" element={<ShippingPayment />}></Route>
        {/* <Route path="/contact" element={<Contact />}></Route> */}
        <Route path="/product/:productId" element={<Product />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/place-order" element={<PlaceOrder />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/verifyStripe" element={<Verify paymentMethod="stripe" />}></Route>
        <Route path="/size-tables" element={<SizeTables />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/confirm-email" element={<ConfirmEmailChange />} />
        <Route path="/try-on/history" element={<TryOnHistory />} />
        <Route path="/try-on/:productId" element={<VirtualTryOn />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
