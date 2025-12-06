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

  // Fix: always get username and role correctly
  const userName = userInfo?.user?.name || userInfo?.name || "";
  const userRole = userInfo?.user?.role || userInfo?.role || "";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
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

  const menuItems = ["Home", "About", "Fleet", "Services", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${isScrolled ? "bg-[#111111] shadow-md" : "bg-transparent"
        }`}
    >
      {/* Top Contact Bar */}
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 lg:px-12 cursor-default">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <i className="ri-mail-line text-[#B8860B]"></i>
            info@LeCharlotLimousine.com
          </span>
          <span className="flex items-center gap-2">
            <i className="ri-phone-line text-[#B8860B]"></i>
            (404) 900-9088
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
        <div className="relative h-12 w-40 overflow-visible">
          <img
            src="/images/favicon.png"
            alt="Le Charlot Logo"
            className="absolute -top-16 left-0 w-40 h-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>





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
          {/* Top-level nav items */}
          {menuItems.map((item) => (
            <li key={item}>
              <Link
                to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="nav-link text-white hover:text-[#B8860B] transition"
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
            <li className="relative flex items-center gap-3 mb-4 lg:mb-0" ref={dropdownRef}>
              {/* Dropdown trigger */}
              <span
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer font-semibold text-[#B8860B] hover:underline flex items-center gap-1"
              >
                {userName} <i className="ri-arrow-down-s-line"></i>
              </span>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <ul className="absolute right-0 top-12 mt-2 w-56 bg-[#111111] text-white rounded-xl shadow-lg z-[9999] animate-fadeIn overflow-hidden border border-[#333]">
                  <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#111111]"></div>

                  {userRole === "admin" ? (
                    <>
                      <li
                        onClick={() => { navigate("/admin/dashboard"); setIsDropdownOpen(false); }}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-dashboard-line"></i> Dashboard
                      </li>
                      <li
                        onClick={() => { navigate("/enableauthenticator"); setIsDropdownOpen(false); }}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-logout-box-line"></i> Logout
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        onClick={() => { navigate("/mybookings"); setIsDropdownOpen(false); }}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-calendar-line"></i> My Bookings
                      </li>
                      <li
                        onClick={() => { navigate("/enableauthenticator"); setIsDropdownOpen(false); }}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-3 hover:bg-[#B8860B] hover:text-black cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-logout-box-line"></i> Logout
                      </li>
                    </>
                  )}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

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
