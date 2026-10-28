import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const handleResponsiveNavigation = (event) => {
      if (event.key === "Escape" || window.matchMedia("(min-width: 1024px)").matches) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleResponsiveNavigation);
    window.addEventListener("resize", handleResponsiveNavigation);
    return () => {
      document.removeEventListener("keydown", handleResponsiveNavigation);
      window.removeEventListener("resize", handleResponsiveNavigation);
    };
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
      aria-label="Main navigation"
      className={`lc-navigation fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${isScrolled ? "is-scrolled" : ""
        }`}
    >
      <div className="lc-navigation__inner w-full mx-auto flex justify-between items-center py-3 px-5 sm:px-7 lg:px-10 relative">
        {/* Logo */}
        <Link
          to="/"
          aria-label="Le Charlot Limousine home"
          onClick={() => {
            closeMobile();
            setIsDropdownOpen(false);
          }}
          className="flex h-20 w-52 items-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <img
            src="/images/logoiz.png"
            alt=""
            className="block max-h-20 w-full object-contain"
            fetchPriority="high"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lc-navigation__toggle lg:hidden text-3xl text-[var(--gold-text)]"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-navigation"
        >
          <i aria-hidden="true" className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
        </button>

        {/* Menu */}
        <ul
          aria-label="Primary"
          id="primary-navigation"
          className={`lc-navigation__list flex flex-col lg:flex-row items-center absolute lg:static left-0 top-full
            w-full lg:w-auto 
            bg-[#0B0B0B]/95 lg:bg-transparent 
            backdrop-blur-md
            transition-all duration-500 ease-in-out
            overflow-visible lg:overflow-visible
            gap-6 lg:gap-10
            border-t border-white/10 lg:border-none
            ${isMobileMenuOpen
              ? "is-open max-h-screen opacity-100 py-6"
              : "is-closed max-h-0 opacity-0 lg:opacity-100 lg:max-h-none"
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

              <button
                type="button"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex min-h-11 cursor-pointer items-center gap-1 rounded-sm font-semibold text-[var(--gold-text)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                {userName} <i className="ri-arrow-down-s-line" aria-hidden="true"></i>
              </button>

              {isDropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 w-56 bg-[#111111] text-white rounded-xl shadow-lg z-[99999] animate-fadeIn overflow-hidden border border-white/10"
                >
                  <li
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2 right-6 h-0 w-0 border-b-8 border-l-8 border-r-8 border-l-transparent border-r-transparent border-b-[#111111]"
                  />

                  {userRole === "admin" ? (
                    <>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setIsDropdownOpen(false);
                            closeMobile();
                          }}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-dashboard-line" aria-hidden="true"></i> Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-logout-box-line" aria-hidden="true"></i> Logout
                        </button>
                      </li>
                    </>
                  ) : userRole === "driver" ? (
                    <>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/driver/dashboard");
                            setIsDropdownOpen(false);
                            closeMobile();
                          }}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-steering-2-line" aria-hidden="true"></i> Driver Dashboard
                        </button>
                      </li>

                      {/* <li
                        onClick={() => {
                          navigate("/enableauthenticator");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li> */}

                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-logout-box-line" aria-hidden="true"></i> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/mybookings");
                            setIsDropdownOpen(false);
                            closeMobile();
                          }}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-calendar-line" aria-hidden="true"></i> My Bookings
                        </button>
                      </li>

                      {/* <li
                        onClick={() => {
                          navigate("/enableauthenticator");
                          setIsDropdownOpen(false);
                          closeMobile();
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i> Enable Authenticator
                      </li> */}

                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-11 w-full items-center gap-2 px-4 py-3 text-left text-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4AF37]"
                        >
                          <i className="ri-logout-box-line" aria-hidden="true"></i> Logout
                        </button>
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
