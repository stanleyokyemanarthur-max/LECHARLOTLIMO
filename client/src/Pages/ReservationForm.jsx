import React from "react";
import { useNavigate } from "react-router-dom";

function ReservationForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0b] via-[#121212] to-[#1a1a1a] text-white font-['Lora']">

      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6">
        <img
          src="/images/cenematic.png"
          alt="Luxury Chauffeur Service"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-widest text-[#B8860B] mb-6">
            Reserve Your Ride
          </h1>

          <div className="w-24 h-[3px] bg-[#B8860B] mx-auto mb-8 rounded-full"></div>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12">
            Airport transfers, executive travel, corporate events, and special
            occasions — experience discreet luxury, punctual service, and
            professional chauffeurs tailored to your journey.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <button
              onClick={() => navigate("/reserve")}
              className="bg-gradient-to-r from-[#d4af37] to-[#B8860B] text-black font-semibold py-4 px-14 rounded-full shadow-2xl hover:scale-105 transition-all duration-500 tracking-wide"
            >
              Reserve Instantly
            </button>

            <div className="text-center md:text-left">
              <p className="text-gray-400 uppercase tracking-wide mb-1">
                Or call us
              </p>
              <a
                href="tel:+14044053738"
                className="text-[#B8860B] text-xl font-bold hover:underline"
              >
                (404) 405-3738
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FLEET SECTION */}
      <section className="max-w-7xl mx-auto py-32 px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#B8860B] tracking-widest mb-4">
            Our Fleet
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Each vehicle is meticulously maintained and chauffeured by
            professionals to ensure comfort, privacy, and excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "Chevrolet Suburban",
              desc: "Executive authority and spacious comfort — ideal for airport transfers and business travel.",
            },
            {
              title: "Cadillac Escalade",
              desc: "Elite luxury with commanding presence — perfect for VIPs and special occasions.",
            },
            {
              title: "GMC Premium SUV",
              desc: "Refined performance and smooth comfort for everyday executive transportation.",
            },
            {
              title: "Mercedes Sprinter Van",
              desc: "Luxury group transport with spacious interiors and first-class seating.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-[#d4af37]/30 rounded-3xl p-10 bg-black/30 backdrop-blur-sm hover:border-[#B8860B] transition-all duration-500"
            >
              <h3 className="text-2xl font-semibold text-[#B8860B] mb-4 tracking-wide">
                {item.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 text-center bg-gradient-to-b from-[#111111] to-black">
        <h2 className="text-4xl md:text-5xl font-bold text-[#B8860B] mb-8 tracking-widest">
          Ready for a Premium Ride?
        </h2>
        <button
          onClick={() => navigate("/reserve")}
          className="bg-gradient-to-r from-[#B8860B] to-[#B8860B] text-black font-bold py-4 px-20 rounded-full shadow-2xl hover:scale-105 transition-all duration-500 tracking-wide"
        >
          Reserve Now
        </button>
      </section>

    </div>
  );
}

export default ReservationForm;
