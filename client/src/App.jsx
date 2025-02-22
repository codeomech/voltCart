import Navbar from "./components/common/Navbar";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/common/Footer";
import Dashboard from "./pages/shop/Dashboard";
import AdminLayout from "./components/admin/Layout";
import Product from "./pages/admin-view/Product";
import Orders from "./pages/admin-view/Orders";
import Features from "./pages/admin-view/Features";
import AdminDashboard from "./pages/admin-view/Dashboard";
import "./App.css";
import CheckAuth from "./components/common/CheckAuth";
import { Toaster } from "@/components/ui/toaster";
import Preloader from "./components/common/Preloader";
import Error from "./pages/notfound/Error";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { checkAuth } from "./store/auth-slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Shop from "./pages/shop/Shop";
import Contact from "./pages/shop/Contact";
import About from "./pages/shop/About";
import ShippingPolicy from "./pages/shop/Shipping";
import PrivacyPolicy from "./pages/shop/Privacy";
import ShoppingAccount from "./pages/shop/Account";
import ShoppingCheckout from "./pages/shop/Checkout";
import ProductDetailPage from "./pages/shop/Product";
import PaymentSuccessPage from "./pages/shop/Payment";
import ModalProvider from "./context/DialogContext";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Analytics />
      <div className="flex flex-col overflow-hidden bg-white">
        <Preloader />
        <ModalProvider>
          <div className="big-image">
            {user?.role !== "admin" ? <Navbar /> : <></>}
          </div>
          <Toaster />
          <Routes>
            <Route
              path="/"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <Dashboard />
                </CheckAuth>
              }
            ></Route>
            <Route path="shop" element={<Shop />} />
            <Route path="contactUs" element={<Contact />} />
            <Route path="story" element={<About />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route
              path="/admin"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout />
                </CheckAuth>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<Product />} />
              <Route path="orders" element={<Orders />} />
              <Route path="features" element={<Features />} />
            </Route>
            <Route path="*" element={<Error />}></Route>
          </Routes>
          <Footer />
        </ModalProvider>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
