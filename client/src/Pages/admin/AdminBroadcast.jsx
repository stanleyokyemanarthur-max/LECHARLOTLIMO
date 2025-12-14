import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminBroadcast() {
  const [channel, setChannel] = useState("email"); // email | sms | both
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    // Validate required fields
    if (!message || (channel !== "sms" && !subject)) {
      return toast.error("Please fill all required fields", { theme: "colored" });
    }

    try {
      setLoading(true);

      // Send broadcast request to backend
      await axios.post(
        "https://selfless-renewal-production-793e.up.railway.app/api/admin/broadcast",
        { channel, subject, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Success notification
      toast.success("Message sent successfully!", { autoClose: 3000, theme: "colored" });

      // Reset fields
      setSubject("");
      setMessage("");
      setChannel("email"); // Reset channel to default
    } catch (err) {
      toast.error("Failed to send broadcast", { theme: "colored" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-12">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-[#B8860B] mb-6">
          Send Message to All Users
        </h1>

        {/* Channel */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full text-white"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Email & SMS</option>
          </select>
        </div>

        {/* Subject (Email only) */}
        {channel !== "sms" && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Email Subject</label>
            <input
              type="text"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full text-white"
            />
          </div>
        )}

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            rows={6}
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full text-white"
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-[#B8860B] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#b5a004] w-full"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
