import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetTOTP() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, error, success
  const [message, setMessage] = useState("");

  useEffect(() => {
    const resetTOTP = async () => {
      try {
        const res = await fetch(`https://lecharlotlimo.onrender.com/api/auth/reset-totp/${token}`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Reset failed");

        setStatus("success");
        setMessage("TOTP reset. Redirecting to setup...");

        setTimeout(() => {
          navigate(`/enableauthenticator?token=${encodeURIComponent(data.tempToken)}`);
        }, 1500);
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Failed to reset TOTP.");
      }
    };

    if (token) resetTOTP();
    else { setStatus("error"); setMessage("Invalid reset link."); }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] p-6">
      <div className="bg-[#0b0b0b] p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        {status === "loading" && <p>Resetting authenticator... please wait.</p>}
        {status === "error" && <p className="text-red-400">{message}</p>}
        {status === "success" && <p className="text-green-400">{message}</p>}
      </div>
    </div>
  );
}
