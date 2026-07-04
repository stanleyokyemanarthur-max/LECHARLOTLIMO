import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import RewardsIcon from "./RewardsIcon";

function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const userName = userInfo?.user?.name || userInfo?.name || "";
  const userRole = userInfo?.user?.role || userInfo?.role || "";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const menuItems = ["Home", "About", "Fleet", "Services", "Contact"];
  const linkFor = (item) => `/${item === "Home" ? "" : item.toLowerCase()}`;

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${isScrolled ? "bg-[#111111] shadow-md backdrop-blur-md" : "bg-transparent"
        }`}
    >
      <div className="w-full mx-auto flex justify-between items-center py-4 px-8 lg:px-12 relative">
        {/* Logo */}
        <div className="relative h-14 w-40 overflow-visible">
          <img
            src="/images/logoiz.png"
            alt="Le Charlot Logo"
            className="absolute -top-5 right-0 w-40 h-auto object-contain cursor-pointer"
            onClick={() => {
              navigate("/");
              closeMobile();
              setIsDropdownOpen(false);
            }}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl text-[var(--gold-text)]"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <i className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>

        {/* Menu */}
        <ul
          className={`flex flex-col lg:flex-row items-center absolute lg:static left-0 top-full
            w-full lg:w-auto 
            bg-[#0B0B0B]/95 lg:bg-transparent 
            backdrop-blur-md
            transition-all duration-500 ease-in-out
            overflow-visible lg:overflow-visible
            gap-6 lg:gap-10
            border-t border-white/10 lg:border-none
            ${isMobileMenuOpen
              ? "max-h-[520px] opacity-100 py-6"
              : "max-h-0 opacity-0 lg:opacity-100 lg:max-h-none"
            }`}
        >
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={linkFor(item)}
                end={item === "Home"}
                className={({ isActive }) =>
                  ["nav-link", isActive ? "is-active" : "", "transition"].join(" ")
                }
                onClick={closeMobile}
              >
                {item}
              </NavLink>
            </li>
          ))}

          {!userInfo ? (
            <li>
              {/* Rolex metallic login button */}
              <NavLink
                to="/login"
                onClick={closeMobile}
                className="text-sm font-semibold uppercase px-4 py-2 rounded-full transition-all duration-300 border border-white/10
                           text-[#111] shadow-lg
                           btn btn-gold btn--hero
                           hover:brightness-105"
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li className="relative flex items-center gap-3 mb-2 lg:mb-0" ref={dropdownRef}>
              {userRole !== "admin" && <RewardsIcon />}

              <span
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="cursor-pointer font-semibold text-[var(--gold-text)] hover:opacity-90 flex items-center gap-1"
              >
                {userName} <i className="ri-arrow-down-s-line"></i>
              </span>

              {isDropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 w-56 bg-[#111111] text-white rounded-xl shadow-lg z-[99999] animate-fadeIn overflow-hidden border border-white/10"
>
                  <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#111111]"></div>

                  {userRole === "admin" ? (
                    <>
                      <li
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-dashboard-line"></i> Dashboard
                      </li>
                    </>
                  ) : userRole === "driver" ? (
                    <>
                      <li
                        onClick={() => {
                          navigate("/driver/dashboard");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-steering-2-line"></i> Driver Dashboard
                      </li>

                      <li
                        onClick={() => {
                          navigate("/enableauthenticator");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li>

                      <li
                        onClick={handleLogout}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-logout-box-line"></i> Logout
                      </li>
                    </>
                  ) : (
                    <>
                      <li
                        onClick={() => {
                          navigate("/mybookings");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-calendar-line"></i> My Bookings
                      </li>

                      <li
                        onClick={() => {
                          navigate("/enableauthenticator");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li>

                      <li
                        onClick={handleLogout}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
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

      {/* keep only this tiny animation helper (or move it global if you want) */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        `}
      </style>
    </nav>
  );
}

export default Nav;
