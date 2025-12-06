import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; 
import Spinner from '../Components/Spinner';
import { motion } from "framer-motion";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    birthday: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

      navigate("/login", { state: { email: form.email, info: "Account created. Check your email for OTP." } });
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
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {loading && <Spinner />}

      {/* Frosted Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mt-36 z-10 w-full max-w-md bg-black/50 border border-[#B8860B] rounded-3xl p-10 shadow-2xl backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold text-center text-[#B8860B] mb-6">
          Join Le Charlot Elite
        </h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "birthday", "password"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium mb-1 capitalize text-gray-200">
                {field === "birthday" ? "Birthday (optional)" : field}
              </label>
              <input
                type={field === "password" ? "password" : field === "birthday" ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B]"
                required={field !== "birthday"}
              />
            </div>
          ))}

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
