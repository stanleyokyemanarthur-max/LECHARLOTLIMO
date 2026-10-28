import React, { useState } from "react";
import { API_ORIGIN } from "../config/api";
import axios from "axios";
import PageHero from "../Components/PageHero";
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

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      number: form.number.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.subject || !trimmedForm.message) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_ORIGIN}/api/contact`,
        trimmedForm
      );

      if (!res.data.success) {
        throw new Error("Your message could not be sent. Please try again.");
      }

      toast.success("Your message has been sent successfully!");
      setForm({ name: "", email: "", number: "", subject: "", message: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <main className="lc-page">
      <PageHero
        eyebrow="Contact"
        title="Let’s plan your journey."
        description="Speak with our team about your trip, service area, or reservation details."
      />

      {/* Contact Info Cards */}
      <div className="lc-contact-grid">
          <div className="lc-contact-card">
            <span className="lc-contact-card__number">01</span>
            <h2>Service area</h2>
            <p>Atlanta, Georgia</p>
          </div>
          <div className="lc-contact-card">
            <span className="lc-contact-card__number">02</span>
            <h2>Email</h2>
            <a href="mailto:info@lecharlotlimousine.com">info@lecharlotlimousine.com</a>
          </div>
          <div className="lc-contact-card">
            <span className="lc-contact-card__number">03</span>
            <h2>Availability</h2>
            <p>Daily, 24 hours</p>
          </div>
          <div className="lc-contact-card">
            <span className="lc-contact-card__number">04</span>
            <h2>Call</h2>
            <a href="tel:+14044053738">(404) 405-3738</a>
          </div>
      </div>

      {/* Contact Form */}
      <section className="lc-contact-layout">
          <div>
            <p className="lc-kicker">Send an enquiry</p>
            <h2 className="lc-section-title mb-8">How can we help?</h2>
            <form onSubmit={handleSubmit} className="space-y-5 contact-inputs" aria-busy={loading}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm text-white/80">Name <span aria-hidden="true">*</span></label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={100} value={form.name} disabled={loading} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-white/20 bg-[#181818] px-4 py-4 text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm text-white/80">Email address <span aria-hidden="true">*</span></label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} disabled={loading} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-white/20 bg-[#181818] px-4 py-4 text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm text-white/80">Phone (optional)</label>
                  <input id="contact-phone" name="number" type="tel" autoComplete="tel" maxLength={30} value={form.number} disabled={loading} onChange={(e) => setForm({ ...form, number: e.target.value })} className="w-full rounded-md border border-white/20 bg-[#181818] px-4 py-4 text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm text-white/80">Subject <span aria-hidden="true">*</span></label>
                  <input id="contact-subject" name="subject" type="text" required maxLength={150} value={form.subject} disabled={loading} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-md border border-white/20 bg-[#181818] px-4 py-4 text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" />
              </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm text-white/80">Message <span aria-hidden="true">*</span></label>
                <textarea id="contact-message" name="message" rows="5" required maxLength={5000} value={form.message} disabled={loading} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-md border border-white/20 bg-[#181818] px-4 py-4 text-white placeholder:text-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-gold btn--hero flex min-h-12 items-center justify-center gap-2 rounded-full px-10 py-3 text-base font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          <aside className="lc-contact-note">
            <p className="lc-kicker">Le Charlot Limousine</p>
            <h2 className="lc-section-title mb-4">Atlanta, Georgia</h2>
            <p className="max-w-lg leading-7 text-white/75">
              We serve Atlanta and the surrounding metropolitan area. Contact
              our team to discuss pickup and destination details for your trip.
            </p>
            <a href="tel:+14044053738" className="lc-button lc-button--outline mt-6">
              Call (404) 405-3738
            </a>
          </aside>
      </section>
      </main>
    </>
  );
}

export default Contact;
