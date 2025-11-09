import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import Login from "./Login";   // Import Login Popup
import Register from "./Register"; // Import Register Popup

const Header = ({ cartItemCount }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <h1 className="text-2xl font-bold">🍔 Food App</h1>

        {/* Hamburger Menu for Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={24} />
        </button>

        {/* Navigation Links */}
        <nav className={`md:flex gap-6 ${menuOpen ? "block mt-4" : "hidden"} md:block`}>
          <Link to="/" className="hover:text-yellow-400">Home</Link>
          <Link to="/menu" className="hover:text-yellow-400">Menu</Link>

          {/* Show Login/Register OR User Menu based on Authentication */}
          {!isLoggedIn ? (
            <>
              <button onClick={() => setShowLogin(true)} className="hover:text-yellow-400">
                Login
              </button>
              <button onClick={() => setShowRegister(true)} className="hover:text-yellow-400">
                Register
              </button>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
              <Link to="/order" className="hover:text-yellow-400">Orders</Link>
              {/* Add Admin Dashboard link if user is admin */}
              <Link to="/admin" className="hover:text-yellow-400">Admin</Link>
              <button onClick={handleLogout} className="hover:text-red-400">
                Logout
              </button>
            </>
          )}

          {/* Cart Button with Item Count */}
          <Link to="/cart" className="relative flex items-center">
            <FaShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* Popup Modals for Login & Register */}
      {showLogin && <Login onClose={() => setShowLogin(false)} onLogin={() => setIsLoggedIn(true)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} onRegister={() => setIsLoggedIn(true)} />}
    </header>
  );
};

export default Header;
