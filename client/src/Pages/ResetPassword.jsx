// Pages/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const {token} = useParams();
  const navigate = useNavigate();
  

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        Invalid or missing reset token.
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8)
      return setError("Password must be at least 8 characters");

    if (password !== confirm)
      return setError("Passwords do not match");

    setLoading(true);

    try {
      const res = await fetch(
        "https://lecharlotlimo.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/login");
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={submitHandler}
        className="bg-black/60 border border-[#D4AF37] p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl text-[#D4AF37] text-center mb-6">
          Set New Password
        </h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-4 p-3 rounded bg-black/40 border border-gray-600 text-white"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mt-4 p-3 rounded bg-black/40 border border-gray-600 text-white"
        />

        <button
          disabled={loading}
          className="w-full mt-6 bg-[#D4AF37] text-black py-3 rounded-xl"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
