import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        form
      );
=======
      const res = await axios.post("https://selfless-renewal-production-793e.up.railway.app/api/contact", form);
>>>>>>> 7aaedcd885ccc05afab9e92a789affd0c901837e

      if (res.data.success) {
        toast.success("Your message has been sent successfully!");

        // Clear form
        setForm({ name: "", email: "", number: "", subject: "", message: "" });

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send message. Please try again."
      );
    }

    setLoading(false);
  };



  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl">
            <i className="ri-map-pin-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl font-semibold mt-8 mb-2">
              Our Address
            </h1>
            <p className="text-[#999]">Atlanta, Georgia</p>
          </div>
          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl">
            <i className="ri-mail-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl font-semibold mt-8 mb-2">
              Email Us
            </h1>
            <p className="text-[#999]">info@lecharlotlimousine.com</p>
          </div>
          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl">
            <i className="ri-time-fill text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl font-semibold mt-8 mb-2">
              Opening Hours
            </h1>
            <p className="text-[#999]">Mon-Sun: 9:00 AM - 6:00 PM</p>
          </div>
          <div className="contact-item bg-[#222222] p-12 text-white rounded-xl">
            <i className="ri-phone-line text-[#B8860B] text-5xl"></i>
            <h1 className="font-bricolage text-2xl font-semibold mt-8 mb-2">
              Call Us
            </h1>
            <p className="text-[#999]">(404) 900-9088</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="lg:px-[12%] px-[8%] pb-[150px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-white text-3xl font-semibold mb-8 text-center lg:text-left">
              Get In Touch
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 contact-inputs">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Number"
                  value={form.number}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
                <input
                  type="text"
                  placeholder="Message Subject"
                  value={form.subject}
                  disabled={loading}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="bg-[#222] fieldtext text-white rounded-md px-4 py-5"
                />
              </div>

              <textarea
                rows="5"
                placeholder="Your Message"
                value={form.message}
                disabled={loading}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-[#222] fieldtext text-white rounded-md px-6 py-4 w-full"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-[#B8860B] hover:bg-white hover:text-black text-white px-14 py-4 text-xl rounded-full flex items-center justify-center gap-2 transition"
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                )}
                {loading ? "Sending..." : "Submit"}
              </button>
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
