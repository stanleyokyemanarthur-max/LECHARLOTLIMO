import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // 🔥 Redux action

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Save user info and token to Redux + localStorage
      dispatch(setCredentials({ user: data.user || data, token: data.token }));

      // ✅ Redirect based on role
      if (data.user?.role === "admin") navigate("/admin/dashboard");
      else if (data.user?.role === "driver") navigate("/driver/dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-page flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/limo-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-[#111111]/90 text-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#d8c305c5]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#d8c305c5]">
          Sign Up
        </h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-black/50 border-gray-700 text-white focus:ring-2 focus:ring-[#d8c305c5] focus:outline-none"
              required
            />
          </div>

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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already registered?{" "}
          <Link to="/login" className="text-[#d8c305c5] hover:underline">
            Click here to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
