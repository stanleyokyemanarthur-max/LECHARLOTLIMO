import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // ✅ from Redux slice
import Spinner from "../Components/Spinner.jsx";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // 🔥 Save user + token to Redux and localStorage
      dispatch(setCredentials({ user: data.user || data, token: data.token }));

      // 🎯 Redirect user based on role
      const role = data.user?.role || data.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/"); // customer default
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/limo-bg.jpg')" }}
    >
      {loading && (<Spinner/>)}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-[#111111]/90 text-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#d8c305c5]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#d8c305c5]">
          Login
        </h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-black/50 border-gray-700 text-white focus:ring-2 focus:ring-[#d8c305c5] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-black/50 border-gray-700 text-white focus:ring-2 focus:ring-[#d8c305c5] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d8c305c5] text-black font-semibold py-2 rounded-lg hover:bg-[#b5a004] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Not registered?{" "}
          <Link to="/signup" className="text-[#d8c305c5] hover:underline">
            Click here to Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
