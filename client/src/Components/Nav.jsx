import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userName = userInfo?.name || userInfo?.user?.name;
  const userRole = userInfo?.role || userInfo?.user?.role;

  const handleUserClick = () => {
    if (userRole === "admin") navigate("/admin/dashboard");
    else navigate("/mybookings");
  };

  return (
    <>

      <nav
        className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${isScrolled ? "bg-[#111111] shadow-md" : "bg-transparent"
          }`}
      >
        {/* Top Contact Bar */}
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 lg:px-12 cursor-default">
          {/* Left Side: Email + Phone */}
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

          {/* Right Side: Social Icons */}
          <div className="flex items-center gap-4 text-lg mt-2 lg:mt-0">
            <i className="ri-facebook-fill cursor-pointer hover:text-[#B8860B]"></i>
            <i className="ri-instagram-fill cursor-pointer hover:text-[#B8860B]"></i>
            <i className="ri-twitter-x-fill cursor-pointer hover:text-[#B8860B]"></i>
          </div>
        </div>


        {/* Main Nav Content */}
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 lg:px-12">
          {/* Logo */}
          <Link to="/" className="logo">
            Le Charlot<span> Limousine</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-3xl text-[#B8860B]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={isOpen ? "ri-close-line" : "ri-menu-line"}></i>
          </button>

          {/* Menu */}
          <ul
            className={`flex flex-col lg:flex-row items-center absolute lg:static left-0 top-full
        w-full lg:w-auto bg-[#0B0B0B] lg:bg-transparent transition-all duration-500
        ease-in-out overflow-hidden lg:overflow-visible gap-6 lg:gap-10
        ${isOpen ? "max-h-[500px] opacity-100 py-6" : "max-h-0 opacity-0 lg:opacity-100 lg:max-h-none"}`}
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
              <li className="flex items-center gap-3">
                <span
                  onClick={handleUserClick}
                  title={userRole === "admin" ? "Go to Admin Dashboard" : "View My Bookings"}
                  className="cursor-pointer font-semibold text-[#B8860B] hover:underline"
                >
                  {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm uppercase font-semibold bg-[#B8860B] text-black px-4 py-1.5 rounded-full hover:bg-[#B8860B] transition-all duration-300"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

    </>
  );
}

export default Nav;
