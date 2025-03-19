import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi"; // Mobile menu icons

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-gray-900", "text-white");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-gray-900", "text-white");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-gray-800 text-white shadow-lg">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold md:ml-[-90px] text-[27px] text-purple-100">
          {/* <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-tl-lg " /> */}
          <div className="p-2 rounded-tl-lg border border-black shadow-md bg-purple-500 px-4 text-gray-900">Tt</div>
          TLE Tracker
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl transition duration-300 hover:text-gray-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 md:mr-[-90px]">
          <Link to="/" className="hover:text-gray-300 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Home</Link>
          {isAuthenticated && <Link to="/bookmarks" className="hover:text-gray-300 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Bookmarks</Link>}
          {isAuthenticated && <Link to="/admin" className="hover:text-gray-300 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Admin</Link>}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-600 px-4 py-2 rounded transition duration-300 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Login</Link>
              <Link to="/signup" className="hover:text-gray-300 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Signup</Link>
            </>
          )}
          <button 
            onClick={toggleDarkMode} 
            className="bg-gray-700 px-4 py-2 rounded transition duration-300 hover:bg-gray-600 hover:text-yellow-400"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 mt-4 bg-gray-900 p-3 rounded-lg">
          <Link to="/" className="hover:text-gray-300 hover:bg-gray-700 w-full text-center py-2 rounded transition duration-300" onClick={() => setIsOpen(false)}>Home</Link>
          {isAuthenticated && <Link to="/bookmarks" className="hover:text-gray-300 hover:bg-gray-700 w-full text-center py-2 rounded transition duration-300" onClick={() => setIsOpen(false)}>Bookmarks</Link>}
          {isAuthenticated && <Link to="/admin" className="hover:text-gray-300 hover:bg-gray-700 w-full text-center py-2 rounded transition duration-300" onClick={() => setIsOpen(false)}>Admin</Link>}
          <button 
            onClick={toggleDarkMode} 
            className="bg-gray-700 px-4 py-2 rounded w-full text-center transition duration-300 hover:bg-gray-600 hover:text-yellow-400"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-600 px-4 py-2 rounded w-full transition duration-300 hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 hover:bg-gray-700 w-full text-center py-2 rounded transition duration-300" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="hover:text-gray-300 hover:bg-gray-700 w-full text-center py-2 rounded transition duration-300" onClick={() => setIsOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

