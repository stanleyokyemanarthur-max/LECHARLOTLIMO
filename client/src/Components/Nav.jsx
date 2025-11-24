import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userName = userInfo?.name || userInfo?.user?.name;
  const userRole = userInfo?.role || userInfo?.user?.role;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
        isScrolled ? "bg-[#111111] shadow-md" : "bg-transparent"
      }`}
    >
      {/* Top Contact Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 lg:px-12 cursor-default">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <i className="ri-mail-line text-[#B8860B]"></i>
            info@lecharlotlimousine.com
          </span>
          <span className="flex items-center gap-2">
            <i className="ri-phone-line text-[#B8860B]"></i>
            +1 (404) 405-3738
          </span>
        </div>

        <div className="flex items-center gap-4 text-lg mt-2 lg:mt-0">
          <i className="ri-facebook-fill cursor-pointer hover:text-[#B8860B]"></i>
          <i className="ri-instagram-fill cursor-pointer hover:text-[#B8860B]"></i>
          <i className="ri-twitter-x-fill cursor-pointer hover:text-[#B8860B]"></i>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 lg:px-12 relative">
        {/* Logo */}
        <Link to="/" className="logo font-bold text-xl text-[#d8c305c5]">
          Le Charlot<span> Limousine</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl text-[#B8860B]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>

        {/* Menu */}
        <ul
          className={`flex flex-col lg:flex-row items-center absolute lg:static left-0 top-full
          w-full lg:w-auto bg-[#0B0B0B] lg:bg-transparent transition-all duration-500
          ease-in-out overflow-hidden lg:overflow-visible gap-6 lg:gap-10
          ${isMobileMenuOpen ? "max-h-[500px] opacity-100 py-6" : "max-h-0 opacity-0 lg:opacity-100 lg:max-h-none"}`}
        >
          {["Home", "About", "Fleet", "Services", "Contact"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="nav-link"
              >
                {item}
              </Link>
            </li>
          ))}

          {!userInfo ? (
            <li>
              <Link
                to="/login"
                className="text-sm font-semibold uppercase text-[#B8860B] border border-[#B8860B] px-4 py-1.5 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
              >
                Login
              </Link>
            </li>
          ) : (
            <li className="flex items-center mb-4 gap-3 relative" ref={dropdownRef}>
              <span
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer font-semibold text-[#B8860B] hover:underline flex items-center gap-1"
              >
                {userName} <i className="ri-arrow-down-s-line"></i>
              </span>

              {/* Dropdown */}
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-[#111111] text-white rounded shadow-lg z-[9999] animate-fadeIn">
                  {/* Arrow */}
                  <div className="absolute top-0 right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#111111]"></div>

                  {/* Dropdown Items */}
                  <li className="relative group">
                    <span
                      onClick={() => {
                        navigate("/mybookings");
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-[#B8860B] hover:text-black cursor-pointer"
                    >
                      My Bookings
                    </span>
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
                      View all your bookings
                    </span>
                  </li>

                  <li className="relative group">
                    <span
                      onClick={() => {
                        navigate("/enable-authenticator");
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-[#B8860B] hover:text-black cursor-pointer"
                    >
                      Enable Authenticator
                    </span>
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
                      Secure your account with 2FA
                    </span>
                  </li>

                  <li className="relative group">
                    <span
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-[#B8860B] hover:text-black cursor-pointer"
                    >
                      Logout
                    </span>
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-block">
                      Sign out of your account
                    </span>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}
      </style>
    </nav>
  );
}

export default Nav;
