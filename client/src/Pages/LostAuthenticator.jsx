import React, { useState } from "react";

export default function LostAuthenticator() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://lecharlotlimo.onrender.com/api/auth/request-totp-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      setMessage(data.message || "Reset link sent to your email.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#080808] to-[#0f0f0f] p-6">
      <div className="bg-[#0b0b0b] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-[#B8860B] mb-4 text-center">Lost Authenticator?</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-3 rounded bg-[#0f0f0f] border border-[#222] text-white"
            required
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="p-3 bg-[#B8860B] text-black rounded font-semibold hover:bg-[#a77b0d] transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
