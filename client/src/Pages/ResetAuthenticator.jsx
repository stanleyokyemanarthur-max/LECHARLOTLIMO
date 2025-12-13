// ResetAuthenticator.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetAuthenticator() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0: loading, 1: QR, 2: verify, 3: success
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempToken, setTempToken] = useState("");

  // --- Fetch QR and reset TOTP ---
  useEffect(() => {
    const resetTOTP = async () => {
      try {
        // Reset TOTP
        const res = await fetch(`https://selfless-renewal-production-793e.up.railway.app/api/auth/reset-totp/${token}`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to reset TOTP");

        setTempToken(data.tempToken || ""); // optional token for setup verification

        // Fetch QR and secret from backend
        const qrRes = await fetch("https://selfless-renewal-production-793e.up.railway.app/api/auth/enable-totp", {
          headers: { Authorization: `Bearer ${data.tempToken || ""}` },
        });
        const qrData = await qrRes.json();
        if (!qrRes.ok) throw new Error(qrData.message || "Failed to load QR");

        setQrCode(qrData.qrCode);
        setSecret(qrData.secret);
        setStep(1);
      } catch (err) {
        setMessage(err.message);
      }
    };

    resetTOTP();
  }, [token]);

  // --- 6-digit input component ---
  const SixDigitInput = ({ onComplete }) => {
    const [values, setValues] = useState(["", "", "", "", "", ""]);
    const refs = Array.from({ length: 6 }, () => useRef());

    const handleChange = (i, val) => {
      if (!/^\d?$/.test(val)) return;
      const newValues = [...values];
      newValues[i] = val;
      setValues(newValues);

      if (val && i < 5) refs[i + 1].current?.focus();
      if (newValues.every((v) => v !== "")) onComplete(newValues.join(""));
    };

    const handleBackspace = (i, e) => {
      if (e.key === "Backspace" && !values[i] && i > 0) refs[i - 1].current?.focus();
    };

    return (
      <div className="flex gap-2 justify-center">
        {values.map((v, i) => (
          <input
            key={i}
            ref={refs[i]}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleBackspace(i, e)}
            maxLength={1}
            className="w-12 h-12 text-center text-2xl bg-[#0f0f0f] border border-[#222] rounded text-white"
          />
        ))}
      </div>
    );
  };

  const handleVerify = async () => {
    if (code.length !== 6) return setMessage("Enter the 6-digit code from your app");
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://selfless-renewal-production-793e.up.railway.app/api/auth/verify-totp-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tempToken}` },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");
      setStep(3);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setMessage("Secret copied to clipboard");
    } catch {
      setMessage("Copy failed, highlight and copy manually");
    }
  };

  const maskedSecret = (s) => s?.replace(/(.{4})/g, "$1 ").trim();

  // --- Card Wrapper ---
  const Card = ({ children }) => (
    <div className="bg-[#0b0b0b] border border-[#2b2b2b] shadow-lg rounded-2xl p-6 max-w-xl w-full mx-auto">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#080808] to-[#0f0f0f]">
      <div className="space-y-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-[#B8860B] text-center">Reset Authenticator</h2>

        <Card>
          {step === 0 && <p className="text-center text-gray-300">Loading...</p>}

          {step === 1 && (
            <>
              <p className="text-sm text-gray-300 mb-4 text-center">
                Scan the QR code with your authenticator app or use the secret key below
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-[#0f0f0f] rounded-lg border border-[#222]">
                  {qrCode ? (
                    <img src={qrCode} alt="QR" className="w-48 h-48 object-contain" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-500">No QR</div>
                  )}
                </div>
                <div className="bg-[#0b0b0b] border border-[#222] rounded p-3 font-mono text-white flex items-center justify-between w-full">
                  <div>{secret ? maskedSecret(secret) : "—"}</div>
                  <button onClick={handleCopySecret} className="px-2 py-1 bg-[#222] rounded text-sm text-gray-300">Copy</button>
                </div>
                <button onClick={() => setStep(2)} className="px-5 py-2 bg-[#B8860B] text-black rounded font-semibold">Next</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-300 mb-4 text-center">Enter the 6-digit code from your app</p>
              <SixDigitInput onComplete={setCode} />
              <div className="mt-4 flex justify-center gap-4">
                <button onClick={handleVerify} disabled={loading} className="px-5 py-2 bg-[#B8860B] text-black rounded font-semibold">
                  {loading ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
              {message && <p className="mt-3 text-red-400 text-center">{message}</p>}
            </>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-xl font-semibold text-white mb-2">Authenticator Enabled!</p>
              <p className="text-gray-300 mb-4">You can now use your authenticator app to login.</p>
              <button onClick={() => navigate("/login")} className="px-5 py-2 bg-[#B8860B] text-black rounded font-semibold">Go to Login</button>
            </div>
          )}

          {message && step === 0 && <p className="mt-3 text-red-400 text-center">{message}</p>}
        </Card>
      </div>
    </div>
  );
}
