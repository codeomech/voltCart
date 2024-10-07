import Navbar from "./components/common/Navbar";
import Register from "./pages/auth/Register";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/common/Footer";
import Login from "./pages/auth/Login";
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

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  console.log(isLoading, user);

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="252794840759-al2c1t9s85j0i8dg9nfbua5n4v31ikfl.apps.googleusercontent.com">
        <Login />
      </GoogleOAuthProvider>
    );
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-white">
        <Preloader />
        <div className="big-image">
          <Navbar />
        </div>
        <Toaster />
        <Routes>
          <Route
            path="/register"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Register />
              </CheckAuth>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <GoogleAuthWrapper />
              </CheckAuth>
            }
          ></Route>
          <Route path="/" element={<Dashboard />}></Route>
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
      </div>
    </>
  );
}

export default App;
