// Pages/VerifyTOTPLogin.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";


export default function VerifyTOTPLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const userInfo = useSelector((state) => state.auth.userInfo);

// when you need email fallback:
const initialEmail = location.state?.email || userInfo?.email || JSON.parse(localStorage.getItem("user") || "null")?.email || "";
  const [email] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!email) {
      // If email not available → go back to login
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email missing. Please start login again.");
    if (String(code).trim().length !== 6) return setError("Enter 6-digit code.");

    setLoading(true);
    try {
      const res = await fetch("https://lecharlotlimo.onrender.com/api/auth/verify-totp-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: String(code).trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");

      // Save credentials once (setCredentials writes to localStorage)
dispatch(setCredentials({ user: data.user || data, token: data.token }));

      // Redirect based on role
      switch (data.user.role) {
        case "admin": return navigate("/admin/dashboard", { replace: true });
        case "driver": return navigate("/driver/dashboard", { replace: true });
        default: return navigate("/mybookings", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#080808] to-[#0f0f0f] p-6 mt-16">
      <div className="bg-[#0b0b0b] border border-[#2b2b2b] shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-[#d8c305c5] mb-4">Verify Authenticator</h2>
        <p className="text-gray-300 mb-4">
          Enter the 6-digit code from your authenticator app for <span className="text-[#d8c305] font-semibold">{email}</span>
        </p>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={ref}
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="******"
            className="w-full p-3 rounded bg-[#0f0f0f] border border-[#222] text-white text-center tracking-widest text-xl"
            required
          />
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-[#d8c305c5] text-black py-2 rounded font-semibold hover:bg-[#b5a004] transition"
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
