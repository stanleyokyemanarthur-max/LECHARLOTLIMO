// EnableAuthenticator.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";

export default function EnableAuthenticator() {
  const reduxToken = useSelector((s) => s.auth?.token);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || null;


  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingQR, setFetchingQR] = useState(false);


  // Refs for six-digit input
  const inputRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));

  /** Fetch QR & secret for TOTP setup */
  const loadQR = async () => {
    if (!reduxToken && !email) return setMessage("Login first to enable authenticator.");
    try {
      setFetchingQR(true);
      const url = reduxToken
        ? "https://selfless-renewal-production-793e.up.railway.app/api/auth/enable-totp"
        : "https://selfless-renewal-production-793e.up.railway.app/api/auth/enable-totp-email";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(reduxToken ? { Authorization: `Bearer ${reduxToken}` } : {}),
        },
        body: !reduxToken ? JSON.stringify({ email }) : null,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load QR");

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setMessage("");
    } catch (err) {
      console.error("Error loading QR:", err);
      setMessage(err.message || "Failed to load QR code");
    } finally {
      setFetchingQR(false);
    }
  };

  useEffect(() => {
    loadQR();
  }, [reduxToken, email]);

  /** Step navigation */
  const handleNext = () => setStep(2);
  const handleResend = async () => {
    await loadQR();
    setMessage("QR refreshed. Scan or use the secret key.");
  };
  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setMessage("Secret copied to clipboard");
    } catch {
      setMessage("Could not copy — please copy manually.");
    }
  };

  /** Reset authenticator (logged-in user). Sends email OTP and redirects to verify-otp */
  const handleReset = async () => {
    if (!reduxToken) return setMessage("You must be logged in to reset your authenticator.");
    if (!confirm("Resetting will remove your authenticator and send a verification code to your email. Continue?")) return;
    try {
      const res = await fetch("https://lecharlotlimo.onrender.com/api/auth/reset-totp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${reduxToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Reset failed");
      navigate("/verify-totp-login", {
        state: { email: data.email }
      });
    } catch (err) {
      console.error("Reset TOTP failed:", err);
      setMessage(err.message || "Failed to reset authenticator");
    }
  };

  /** Verify TOTP code */
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) return setMessage("Enter the 6-digit code from your app.");

    setLoading(true);
    try {
      const url = reduxToken ? '/api/auth/verify-totp-setup' : '/api/auth/verify-totp-setup-email';
      const fullUrl = `https://selfless-renewal-production-793e.up.railway.app${url}`;
      const body = reduxToken ? { code } : { code, email };
      const res = await fetch(fullUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(reduxToken ? { Authorization: `Bearer ${reduxToken}` } : {}) }, body: JSON.stringify(body) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Verification failed');


      setStep(3);
      // If backend returned updated user or token, set them
      if (data.token) dispatch(setCredentials({ user: data.user || data, token: data.token }));
    } catch (err) {
      setMessage(err.message || 'Verification failed');
    } finally { setLoading(false); }
  };


  /** Mask secret for display */
  const maskedSecret = (s) => s?.replace(/(.{4})/g, "$1 ").trim();

  /** Six-digit input component */
  const SixDigitInput = ({ value, onComplete }) => {
    const [values, setValues] = useState(Array(6).fill(''));
    useEffect(() => setValues(value ? value.split('') : Array(6).fill('')), [value]);
    useEffect(() => { if (step === 2 && inputRefs.current[0]?.current) inputRefs.current[0].current.focus(); }, [step]);

    const handleChange = (i, val) => {
      if (!/^\d?$/.test(val)) return;
      const newValues = [...values];
      newValues[i] = val;
      setValues(newValues);
      if (val && i < 5) inputRefs.current[i + 1].current?.focus();
      if (newValues.every(v => v !== '')) onComplete(newValues.join(''));
    };

    const handleBackspace = (i, e) => {
      if (e.key === "Backspace" && !values[i] && i > 0) inputRefs.current[i - 1].current?.focus();
    };

    const handlePaste = (e) => {
      const paste = e.clipboardData.getData("text").trim().slice(0, 6).split("");
      const newValues = [...values];
      for (let i = 0; i < 6; i++) if (paste[i]) newValues[i] = paste[i];
      setValues(newValues);
      if (newValues.every(v=>v !== '')) onComplete(newValues.join('')); inputRefs.current[Math.min(paste.length,5)].current?.focus(); e.preventDefault();
    };

    return (
      <div className="flex gap-2" onPaste={handlePaste}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={inputRefs.current[i]}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleBackspace(i, e)}
            maxLength={1}
            className="w-12 h-12 text-center text-2xl bg-[#0f0f0f] border border-[#222] rounded text-white focus:outline-none focus:border-[#B8860B]"
          />
        ))}
      </div>
    );
  };

  /** Card wrapper */
  const Card = ({ children, className = "" }) => (
    <div className={"bg-[#0b0b0b] border border-[#2b2b2b] shadow-lg rounded-2xl p-6 max-w-xl w-full " + className}>
      {children}
    </div>
  );

  /** Render UI */
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#080808] to-[#0f0f0f] mt-16">
      <div style={{ width: "100%", maxWidth: 920 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#B8860B]">Enable Authenticator App</h2>
          <button onClick={() => navigate(-1)} className="text-sm px-3 py-1 rounded bg-transparent border border-[#3a3a3a] text-white hover:bg-[#1a1a1a]">Cancel</button>
        </div>

        <Card>
          {/* Step 1: QR Scan */}
          {step === 1 && (
            <>
              <p className="text-sm text-gray-300 mb-4">
                Scan the QR code below with Google Authenticator or Authy. Tap <span className="font-semibold">+</span> and choose <span className="font-semibold">Scan a QR code</span>.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 flex flex-col items-center">
                  <div className="p-4 bg-[#0f0f0f] rounded-lg border border-[#222]">
                    {fetchingQR ? (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-500">Loading...</div>
                    ) : qrCode ? (
                      <img src={qrCode} alt="QR Code" className="w-48 h-48 object-contain" />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-gray-500">{message || "Generating QR..."}</div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={handleNext} disabled={!qrCode} className="bg-[#B8860B] text-black px-5 py-2 rounded-lg font-semibold hover:opacity-95">Next</button>
                    <button onClick={handleResend} disabled={fetchingQR} className="px-4 py-2 bg-transparent border border-[#333] rounded text-white">Refresh QR</button>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Can't scan?</h3>
                  <p className="text-sm text-gray-300 mb-3">Use the setup key instead:</p>
                  <div className="bg-[#0b0b0b] border border-[#222] rounded p-3 font-mono text-white flex items-center justify-between">
                    <div>{secret ? maskedSecret(secret) : "—"}</div>
                    <button onClick={handleCopySecret} className="px-2 py-1 bg-[#222] rounded text-sm text-gray-300">Copy</button>
                  </div>
                </div>
              </div>
              {message && <p className="mt-4 text-red-400">{message}</p>}
            </>
          )}

          {/* Step 2: Verify code */}
          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold text-white mb-2">Verify Authenticator App</h3>
              <p className="text-sm text-gray-300 mb-4">Enter the 6-digit code from your authenticator app.</p>
              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <SixDigitInput value={code} onComplete={setCode} />
                <div className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-transparent border border-[#333] rounded text-white">Back</button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={loading}
                      className="text-sm underline text-gray-300 hover:text-white"
                      title="Can't access your authenticator? Reset via email"
                    >
                      Can't access authenticator? Reset
                    </button>

                    <button type="submit" disabled={loading || code.length !== 6} className="px-5 py-2 bg-[#B8860B] text-black rounded font-semibold">
                      {loading ? "Working..." : "Verify & Enable"}
                    </button>
                  </div>
                </div>
              </form>
              {message && <p className="mt-3 text-red-400">{message}</p>}
            </>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#B8860B] to-[#bfa21b] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#031" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">Authenticator Enabled</h3>
                <p className="text-gray-300 mt-1">Your authenticator app has been added and will be required at login.</p>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => navigate("/mybookings")} className="px-4 py-2 bg-transparent border border-[#333] rounded text-white">Go to My Bookings</button>
                  <button onClick={() => navigate(-1)} className="px-4 py-2 bg-[#B8860B] text-black rounded font-semibold">Done</button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
