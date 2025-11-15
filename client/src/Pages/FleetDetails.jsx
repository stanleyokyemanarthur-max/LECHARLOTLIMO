// src/Pages/FleetDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fleetData from "../data/fleetData";
import { motion, AnimatePresence } from "framer-motion";
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
function AutoSlideGallery({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="fleet interior/exterior"
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
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === current ? "bg-yellow-500" : "bg-gray-400"
            }`}
          />
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
            <motion.div
              key={index}
              layout
              initial={false}
              className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left  transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Plus
                    className={`w-5 h-5 text-yellow-500 transform transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                  <span className={`text-gray-200 transition-colors ${isOpen ? "text-yellow-500" : ""}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transform transition-transform ${
                    isOpen ? "rotate-90 text-yellow-500" : "text-yellow-500"
                  }`}
                />
              </button>

              {isOpen && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                  className="px-5 pb-5 text-gray-400 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
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
      <section className="flex flex-col items-center justify-center min-h-screen text-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Vehicle not found</h1>
        <button
          onClick={() => navigate("/fleet")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition"
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
        "While color requests depend on availability, we’ll do our best to accommodate your preferences.",
    },
    {
      question: "Is there Wi-Fi available in the vehicle?",
      answer:
        "Yes, most of our premium vehicles come equipped with complimentary Wi-Fi for your convenience.",
    },
    {
      question: "Do you offer hourly rental options?",
      answer:
        "Yes, our services are available for hourly, daily, and long-term bookings to suit your needs.",
    },
  ];

  const iconMap = [Users, Armchair, Music, GlassWater, Sparkles, Briefcase, Radio];

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-gray-300 py-16 px-6 md:px-12">
      <button
        onClick={() => navigate("/fleet")}
        className="flex items-center gap-2 mb-10 text-gray-400 hover:text-yellow-500 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Fleet
      </button>

      {/* Top Layout: Car + Gallery */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 max-w-6xl mx-auto mb-20">
        <motion.img
          src={fleet.mainImage}
          alt={fleet.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 object-contain rounded-2xl shadow-xl"
        />
        <div className="w-full md:w-1/2">
          <AutoSlideGallery images={fleet.gallery} />
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="max-w-5xl mx-auto p-8 md:p-12">
        <h1 className="text-3xl md:text-[34px] font-semibold text-white mb-2">
          {fleet.name}
        </h1>
        <p className="text-yellow-500 font-medium mb-6 uppercase tracking-wide">
          {fleet.category}
        </p>

        <p className="text-gray-400 leading-relaxed mb-10">{fleet.description}</p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
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
                    <Icon className="w-5 h-5 text-yellow-500" />
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Book Now Button */}
        <button onClick={() => navigate("/reserve")} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-md transition-transform hover:scale-105">
          Book Now
        </button>

        {/* FAQ Section */}
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Chauffeur Section */}
      <div className="max-w-6xl mx-auto mt-24 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Premium Luxury Sedan Chauffeur Services for Every Occasion
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Whether you’re heading to a business meeting, airport, wedding, or night out,
            our professional chauffeurs ensure a seamless, comfortable, and stylish
            journey. Experience exceptional service and unmatched luxury in every mile.
          </p>
          <button onClick={() => navigate("/reservation-form")} className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 px-8 rounded-md transition-transform hover:scale-105">
            Reserve Your Ride
          </button>
        </div>

        <div className="flex-1">
          <motion.img
            src="/images/Flying.jpg"
            alt="Chauffeur service airport"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
