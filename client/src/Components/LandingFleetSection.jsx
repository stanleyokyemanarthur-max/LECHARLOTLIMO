import React from "react";
import { useNavigate } from "react-router-dom";

function LandingFleetSection() {
  const navigate = useNavigate();

  const fleetThumbs = [
    "/images/-Cadillac.png",
    "/images/Chevy.jpg",
    "/images/gmc.png",
    "/images/Sprinter.jpg",
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
      {/* Left Text */}
      <div className="md:w-1/2 text-center md:text-left space-y-">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
          Luxurious Fleet <br />
          <span className="text-yellow-600">for Ultimate Satisfaction</span>
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
          Premier Chauffeured Services in the USA. We value the time and quality
          of travel for each of our clients. Explore our luxury cars and book a
          ride for the ultimate experience.
        </p>

        <button
          onClick={() => navigate("/fleet")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full text-base md:text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Explore our Fleet
        </button>
      </div>

      {/* Right Images */}
      <div className="md:w-1/2 flex flex-col items-center relative">
        {/* Featured vehicle */}
        <img
          src="/images/suburban.png"
          alt="Featured Vehicle"
          className="w-[85%] md:w-[80%] max-w-xl object-contain drop-shadow-2xl mb-6"
        />

        {/* Thumbnails in one clean line */}
        <div className="flex justify-center items-center gap-6 md:gap-8">
          {fleetThumbs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Vehicle ${i}`}
              className="w-28 h-20 md:w-32 md:h-24 object-contain hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingFleetSection;
