import { Routes, Route } from "react-router-dom";
import VendedorRoute from "./routes/VendedorRoute";
import UserRoute from "./routes/UserRoute";
import HomeGate from "./pages/HomeGate";
import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import AboutUs from "./pages/AboutUs";
import Partners from "./pages/Partners";
import Quality from "./pages/Quality";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/quality" element={<Quality />} />

        {/* Rutas de vendedor */}
        <Route
          path="/dashboard"
          element={
            <VendedorRoute>
              <Dashboard />
            </VendedorRoute>
          }
        />
        <Route
          path="/dashboard/producto/crear"
          element={
            <VendedorRoute>
              <ProductForm />
            </VendedorRoute>
          }
        />
        <Route
          path="/dashboard/producto/editar/:id"
          element={
            <VendedorRoute>
              <ProductForm />
            </VendedorRoute>
          }
        />

        {/* Rutas de usuario normal */}
        <Route path="/" element={<UserRoute><Home /></UserRoute>} />
        <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
        <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="/payment-success" element={<UserRoute><PaymentSuccess /></UserRoute>} />
        <Route path="/wishlist" element={<UserRoute><Wishlist /></UserRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
        <Route path="/search" element={<UserRoute><Search /></UserRoute>} />
        <Route path="/producto/:id" element={<UserRoute><ProductDetail /></UserRoute>} />
      </Routes>
    </>
  );
}
