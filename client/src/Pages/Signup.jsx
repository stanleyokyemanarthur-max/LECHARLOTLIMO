import React, { useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // Redux slice
import Spinner from "../Components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCalendar } from "react-icons/ai";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    birthday: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://selfless-renewal-production-793e.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          birthday: form.birthday ? format(form.birthday, "yyyy-MM-dd") : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Store credentials in Redux
      dispatch(setCredentials(data));

      navigate("/login", {
        state: { email: form.email, info: "Account created. Check your email for OTP." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Custom input for DatePicker with calendar icon
  const CalendarInput = forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full cursor-pointer">
      <input
        type="text"
        value={value}
        readOnly
        onClick={onClick}
        ref={ref}
        placeholder="MM/DD/YYYY"
        className="calendar-input w-full h-12 p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] pl-4 pr-10 text-sm transition-all"
      />
      <AiOutlineCalendar
        className="calendar-icon absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer transition-all"
        onClick={onClick}
        size={20}
      />
    </div>
  ));

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/elite.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <AnimatePresence>{loading && <Spinner />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="relative mt-36 z-10 w-full max-w-md bg-black/50 border border-[#B8860B] rounded-3xl p-10 shadow-2xl backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-center text-[#B8860B] mb-6">
          Join Le Charlot Elite
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-12 p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-12 p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-12 p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
              required
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-200">
              Birthday (optional)
            </label>
            <DatePicker
              selected={form.birthday}
              onChange={(date) => setForm({ ...form, birthday: date })}
              dateFormat="MM/dd/yyyy"
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
              calendarClassName="bg-black text-white border border-[#B8860B] rounded-lg shadow-lg transition-all"
              popperClassName="z-50"
              customInput={<CalendarInput />}
              renderCustomHeader={({
                monthDate,
                decreaseMonth,
                increaseMonth,
                changeYear,
                changeMonth,
              }) => (
                <div className="flex justify-between items-center px-2 py-1 bg-[#222] text-white border-b border-[#B8860B] rounded-t-lg">
                  <button
                    onClick={decreaseMonth}
                    className="text-[#B8860B] hover:text-white"
                  >
                    {"<"}
                  </button>

                  {/* Year dropdown */}
                  <select
                    value={monthDate.getFullYear()}
                    onChange={(e) => changeYear(Number(e.target.value))}
                    className="bg-[#222] text-white p-1 rounded"
                  >
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>

                  {/* Month dropdown */}
                  <select
                    value={monthDate.getMonth()}
                    onChange={(e) => changeMonth(Number(e.target.value))}
                    className="bg-[#222] text-white p-1 rounded ml-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{format(new Date(0, i), "MMMM")}</option>
                    ))}
                  </select>

                  <button
                    onClick={increaseMonth}
                    className="text-[#B8860B] hover:text-white"
                  >
                    {">"}
                  </button>
                </div>
              )}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-200">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-12 p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition-all"
              required
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-white transition-all"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8860B] text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-[#d4a019] transition-all"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Already a member?{" "}
          <Link to="/login" className="text-[#B8860B] hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
