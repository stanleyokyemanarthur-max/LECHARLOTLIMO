// src/Pages/FleetDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fleetData from "../data/fleetData";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Plus,
  ArrowLeft,
  Users,
  Briefcase,
  Armchair,
  Radio,
  Music,
  GlassWater,
  Sparkles,
} from "lucide-react";

// --- Auto-slide gallery ---
function AutoSlideGallery({ images, vehicleName }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative mt-0 w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <Motion.img
          key={images[current]}
          src={images[current]}
          alt={`${vehicleName} photo ${current + 1} of ${images.length}`}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Show vehicle image ${idx + 1} of ${images.length}`}
            aria-pressed={idx === current}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
              idx === current ? "bg-[#D4AF37]" : "bg-gray-400"
            }`}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#111111]" />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- FAQ Accordion with smooth open ---
const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Motion.div
              key={index}
              layout
              initial={false}
              className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                id={`faq-question-${index}`}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex justify-between items-center p-5 text-left  transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Plus
                    className={`w-5 h-5 text-[#D4AF37] transform transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                  <span className={`text-gray-200 transition-colors ${isOpen ? "text-[#D4AF37]" : ""}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transform transition-transform ${
                    isOpen ? "rotate-90 text-[#D4AF37]" : "text-[#D4AF37]"
                  }`}
                />
              </button>

              {isOpen && (
                <Motion.div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                  className="px-5 pb-5 text-gray-400 leading-relaxed"
                >
                  {faq.answer}
                </Motion.div>
              )}
            </Motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main FleetDetails Page ---
export default function FleetDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fleet = fleetData.find((car) => car.slug === slug);

  if (!fleet) {
    return (
      <section className=" flex flex-col items-center justify-center min-h-screen text-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Vehicle not found</h1>
        <button
          onClick={() => navigate("/fleet")}
          className="btn btn-gold text-black font-semibold px-6 py-2 rounded-lg transition"
        >
          Back to Fleet
        </button>
      </section>
    );
  }

  const faqs = [
    {
      question: "Can I request a specific vehicle color?",
      answer:
        "Please contact us to confirm available vehicle colors.",
    },
    {
      question: "Is there Wi-Fi available in the vehicle?",
      answer:
        "Yes, most of our premium vehicles come equipped with complimentary Wi-Fi for your convenience.",
    },
    {
      question: "Do you offer hourly booking options?",
      answer:
        " our services are available for hourly, daily, and long-term bookings to suit your needs.",
    },
  ];

  const iconMap = [Users, Armchair, Music, GlassWater, Sparkles, Briefcase, Radio];

  return (
    <main className="lc-vehicle-detail min-h-screen text-gray-300">
      <button
        type="button"
        onClick={() => navigate("/fleet")}
        className="lc-vehicle-back flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Fleet
      </button>

      {/* Top Layout: Car + Gallery */}
      <div className="lc-vehicle-gallery flex flex-col md:flex-row items-center md:items-start gap-10">
        <Motion.img
          src={fleet.mainImage}
          alt={fleet.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          loading="eager"
          decoding="async"
          className="lc-vehicle-main-image w-full md:w-1/2 object-contain"
        />
        <div className="w-full md:w-1/2">
          <AutoSlideGallery images={fleet.gallery} vehicleName={fleet.name} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/reserve")}
          className="lc-button"
        >
          Reserve this vehicle <span aria-hidden="true">↗</span>
        </button>
      </div>

      {/* Vehicle Details */}
      <div className="lc-vehicle-copy">
        <p className="lc-kicker">{fleet.category}</p>
        <h1 className="mb-4 text-4xl font-semibold text-white md:text-5xl">
          {fleet.name}
        </h1>

        <p className="mb-10 max-w-3xl text-gray-400 leading-relaxed">{fleet.description}</p>

        <div className="lc-vehicle-specs grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Capacity & Luggage
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>👥 {fleet.capacity}</li>
              <li>🧳 {fleet.luggage}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
            <ul className="space-y-3 text-gray-300">
              {fleet.features.map((feature, idx) => {
                const Icon = iconMap[idx % iconMap.length];
                return (
                  <li key={idx} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      

        {/* FAQ Section */}
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Chauffeur Section */}
      <div className="max-w-6xl mx-auto mt-24 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Chauffeur Services for Every Occasion
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Whether you’re heading to a business meeting, airport, wedding, or night out,
            our professional chauffeurs ensure a seamless, comfortable, and stylish
            journey. Experience exceptional service and unmatched luxury in every mile.
          </p>
          <button onClick={() => navigate("/reserve")} className="btn btn-gold min-h-12 text-black font-semibold py-3 px-8 rounded-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]">
            Book Your Ride
          </button>
        </div>

        <div className="flex-1">
          <Motion.img
            src="/images/Flying.jpg"
            alt="Chauffeur service airport"
            loading="lazy"
            decoding="async"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>
      </div>
    </main>
  );
}
