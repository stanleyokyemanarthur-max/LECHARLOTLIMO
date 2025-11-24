import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import Spinner from "../Components/Spinner";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user enters here without email → send them back
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

      // Save user + token
      dispatch(setCredentials({ user: data, token: data.token }));

      // Redirect based on role
      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "driver") navigate("/driver/dashboard");
      else navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/limo-bg.jpg')" }}
    >
      {loading && <Spinner />}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-[#111]/90 text-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#d8c305]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#d8c305]">
          Verify OTP
        </h1>

        <p className="text-center mb-4 text-gray-300">
          Enter the 6-digit code sent to:
          <br />
          <span className="text-[#d8c305] font-semibold">{email}</span>
        </p>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded bg-black/50 border-gray-700 text-white
            text-center text-xl tracking-widest focus:ring-2 focus:ring-[#d8c305]"
            placeholder="• • • • • •"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#d8c305] text-black font-semibold py-2 rounded-lg 
            hover:bg-[#b5a004] transition"
          >
            Verify OTP
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-300">
          Didn’t receive code?  
          <span className="text-[#d8c305] cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
