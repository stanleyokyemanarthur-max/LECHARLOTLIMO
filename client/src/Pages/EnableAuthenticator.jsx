import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";

function EnableAuthenticator() {
  const { user, token } = useSelector((state) => state.auth);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailFromLogin = location.state?.email; // if coming from TOTP login

  // Fetch QR code and secret on mount (only for enabling TOTP)
  useEffect(() => {
    if (!token) return; // Only fetch if user logged in
    const fetchQR = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/enable-totp", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || "Failed to generate QR code.");
          return;
        }
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } catch (err) {
        setMessage("Network error. Failed to fetch QR code.");
      }
    };
    fetchQR();
  }, [token]);

  // Handles both TOTP setup verification and TOTP login verification
  const handleVerify = async () => {
    if (!code) return setMessage("Enter the 6-digit code.");

    setLoading(true);
    setMessage("");

    try {
      let url = "";
      let body = {};
      let headers = { "Content-Type": "application/json" };

      if (emailFromLogin) {
        // TOTP login verification
        url = "http://localhost:5000/api/auth/verify-totp-login";
        body = { email: emailFromLogin, code };
      } else {
        // Enable TOTP verification
        url = "http://localhost:5000/api/auth/verify-totp-setup";
        body = { code };
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Verification failed. Try again.");
        return;
      }

      if (emailFromLogin) {
        // Login successful: store user and redirect
        dispatch(setCredentials({ user: data, token: data.token }));
        if (data.role === "admin") navigate("/admin/dashboard");
        else if (data.role === "driver") navigate("/driver/dashboard");
        else navigate("/");
      } else {
        // TOTP enabled successfully
        setMessage("Authenticator App Enabled Successfully!");
      }
    } catch (err) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-40 text-white max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {emailFromLogin ? "Enter Authenticator Code" : "Enable Authenticator App"}
      </h1>

      {!emailFromLogin && (
        <div className="mb-4">
          {qrCode ? (
            <>
              <p>Scan this QR code with Google Authenticator or Authy:</p>
              <img src={qrCode} alt="QR Code" className="mt-3 w-48" />
              <p className="mt-2">
                Or manually add secret: <b>{secret}</b>
              </p>
            </>
          ) : (
            <p>Generating QR code...</p>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Enter 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="p-3 rounded bg-gray-800 border border-gray-600 w-full mb-4"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full px-4 py-2 bg-yellow-400 text-black rounded disabled:opacity-50"
      >
        {loading ? "Verifying..." : emailFromLogin ? "Verify & Login" : "Verify & Enable"}
      </button>

      {message && <p className="mt-3 text-yellow-300">{message}</p>}
    </div>
  );
}

export default EnableAuthenticator;
