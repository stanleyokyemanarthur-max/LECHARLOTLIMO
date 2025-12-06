import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import Spinner from "../Components/Spinner.jsx";
import { motion } from "framer-motion";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://lecharlotlimo.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Handle MFA / OTP flows
      if (data.mfa === "SETUP_TOTP") {
        navigate("/enableauthenticator", { state: { email: form.email } });
        return;
      }
      if (data.mfa === "TOTP_REQUIRED") {
        navigate("/verify-totp-login", { state: { email: form.email } });
        return;
      }
      if (data.message?.includes("OTP sent")) {
        navigate("/verify-otp", { state: { email: form.email } });
        return;
      }

      // Direct login
      dispatch(setCredentials({ user: data.user || data, token: data.token }));
      const role = data.user?.role || data.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "driver") navigate("/driver/dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/elite.jpg')" }}
    >
      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {loading && <Spinner />}

      {/* Frosted glass login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mt-36 w-full max-w-md bg-black/50 border border-[#B8860B] rounded-3xl p-10 shadow-2xl backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-center text-[#B8860B] mb-6">
          Access Account
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1 capitalize text-gray-200">
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8860B] text-black font-semibold py-3 rounded-xl shadow-lg hover:bg-[#d4a019] transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Not registered?{" "}
          <Link to="/signup" className="text-[#B8860B] hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
