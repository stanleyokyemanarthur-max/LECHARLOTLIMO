import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminBroadcast() {
  const [channel, setChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message || (channel !== "sms" && !subject)) {
      return toast.error("Please fill all required fields", { theme: "colored" });
    }

    try {
      setLoading(true);

      await axios.post(
        "https://lecharlotlimo.onrender.com/api/admin/broadcast",
        { channel, subject, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Message sent successfully!", { autoClose: 3000, theme: "colored" });

      setSubject("");
      setMessage("");
      setChannel("email");
    } catch (err) {
      toast.error("Failed to send broadcast", { theme: "colored" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 lg:px-0" style={{ background: 'linear-gradient(145deg, #1A1A1A, #121212)' }}>
      <h1 className="text-3xl font-extrabold text-[#B8860B] mb-10 tracking-wide">Admin Broadcast</h1>

      <div className="bg-gray-800 bg-opacity-90 w-full max-w-4xl rounded-3xl shadow-2xl p-10 space-y-7 border border-gray-700">
        {/* Channel */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-2 font-medium">Select Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Email & SMS</option>
          </select>
        </div>

        {/* Subject */}
        {channel !== "sms" && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-300 mb-2 font-medium">Email Subject</label>
            <input
              type="text"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition"
            />
          </div>
        )}

        {/* Message */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-300 mb-2 font-medium">Message</label>
          <textarea
            rows={6}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B8860B] transition"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full bg-[#B8860B] hover:bg-[#d4af37] text-black font-bold py-3 rounded-2xl shadow-lg transform hover:scale-105 transition duration-200"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}
