import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import FoodList from "./components/FoodList";
import Login from "./components/Login";
import Register from "./components/Register";
import OrderPage from "./components/OrderPage";
import Cart from "./components/Cart";
import UserProfile from "./components/UserProfile";
import AdminDashboard from "./components/AdminDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import DeliveryPartnerDashboard from "./components/DeliveryPartnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<FoodList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/delivery" element={<ProtectedRoute><DeliveryPartnerDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
