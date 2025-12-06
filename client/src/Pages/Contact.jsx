import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/contact", form);

      if (res.data.success) {
        setSuccess("Your message has been sent successfully!");
        setForm({
          name: "",
          email: "",
          number: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Banner */}
      <div className="banner-section flex justify-center items-center h-[358px] lg:h-[550px]">
        <div className="banner-section-content text-center z-10">
          <h1 className="uppercase text-sm lg:text-xl text-white font-bricolage">
            GET <span className="text-[#B8860B]">IN TOUCH</span>
          </h1>
          <h1 className="text-4xl lg:text-5xl xl:text-8xl font-semibold font-bricolage text-[#B8860B]">
            <span className="text-white font-bricolage">CONTACT</span> US
          </h1>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="contact-wrapper lg:px-[12%] px-[8%] pb-[158px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full gap-12">

          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl relative group overflow-hidden">
            <i className="ri-map-pin-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl lg:text-2xl font-semibold mt-8 mb-2">
              Our Address
            </h1>
            <p className="text-[#999]">Atlanta, Georgia</p>
          </div>

          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl relative group overflow-hidden">
            <i className="ri-mail-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl lg:text-2xl font-semibold mt-8 mb-2">
              Email Us
            </h1>
            <p className="text-[#999]"> info@lecharlotlimousine.com</p>
          </div>

          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl relative group overflow-hidden">
            <i className="ri-time-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl lg:text-2xl font-semibold mt-8 mb-2">
              Opening Hours
            </h1>
            <p className="text-[#999]">Mon-Sun: 9:00 AM - 6:00 PM</p>
          </div>

          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl relative group overflow-hidden">
            <i className="ri-phone-line text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl lg:text-2xl font-semibold mt-8 mb-2">
              Call Us
            </h1>
            <p className="text-[#999]">(404) 900-9088</p>
          </div>

        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:px-[12%] px-[8%] pb-[150px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Form */}
          <div>
            <h1 className="text-white text-3xl font-semibold mb-8 text-center lg:text-left">
              Get In Touch
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 contact-inputs">

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
              </div>

              {/* Number + Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Number"
                  value={form.number}
                  onChange={(e) =>
                    setForm({ ...form, number: e.target.value })
                  }
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />

                <input
                  type="text"
                  placeholder="Message Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
              </div>

              {/* Message */}
              <textarea
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="bg-[#222] fieldtext text-white rounded-md px-6 py-4 w-full"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#B8860B] hover:bg-white hover:text-black text-white px-14 py-4 text-xl rounded-full transition"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              {/* Alerts */}
              {success && (
                <p className="text-green-500 pt-2">{success}</p>
              )}
              {error && (
                <p className="text-red-500 pt-2">{error}</p>
              )}
            </form>
          </div>

          {/* Google Map */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18..."
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </div>
    </>
  );
}

export default Contact;
