import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import Spinner from "../Components/Spinner";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      dispatch(setCredentials({ user: data.user || data, token: data.token }));

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#080808] to-[#0f0f0f] p-6">
      {loading && <Spinner />}
      <div className="bg-[#0b0b0b] border border-[#2b2b2b] shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#d8c305c5] mb-4">Verify OTP</h1>
        <p className="text-gray-300 mb-4">
          Enter the 6-digit code sent to <span className="text-[#d8c305] font-semibold">{email}</span>
        </p>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="• • • • • •"
            className="w-full p-3 rounded bg-[#0f0f0f] border border-[#222] text-white text-center tracking-widest text-xl"
            required
          />
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#d8c305c5] text-black py-2 rounded font-semibold hover:bg-[#b5a004] transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
