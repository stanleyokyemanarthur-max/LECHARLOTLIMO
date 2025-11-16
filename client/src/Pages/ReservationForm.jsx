import React from "react";
import { useNavigate } from "react-router-dom";

function ReservationForm() {
  const navigate = useNavigate();

  const cars = [
    { src: "/images/-Cadillac.png" },
    { src: "/images/gmc.png" },
    { src: "/images/Chevy.jpg" },
    { src: "/images/Sprinter.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf7f2] to-white text-gray-900 pt-24 pb-24 font-['Inter']">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <h1 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-semibold text-gray-900 mb-4 tracking-wide">
          Reservation Form
        </h1>

        <div className="w-24 h-[2px] bg-[#d4af37] mx-auto mb-8"></div>

        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mb-14 text-base lg:text-lg">
          Make your reservation effortlessly — whether for airport transfers,
          corporate events, or special occasions. Select your preferred vehicle,
          confirm your travel details, and let our chauffeurs deliver an
          experience of comfort, elegance, and punctuality.
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col items-center justify-center gap-4 mb-20">
          <button
            onClick={() => navigate("/reserve")}
            className="bg-[#d4af37] text-black font-medium uppercase tracking-wide px-10 py-3 rounded-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            Reserve Instantly
          </button>

          <div className="text-gray-800 text-lg font-medium mt-2 tracking-wide">
            or Call Us Now
          </div>

          <div className="flex items-center gap-3 text-lg">
            <i className="bi bi-telephone text-[#d4af37]"></i>
            <a
              href="tel:+18004310313"
              className="text-gray-900 hover:text-[#d4af37] transition-colors duration-200"
            >
              (404) 405-3738
            </a>
          </div>
        </div>

        {/* Cars Section */}
        <div className=" py-14">
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-center gap-10 lg:gap-16">
            {cars.map((car, index) => (
              <div key={index} className="text-center">
                <img
                  src={car.src}
                  alt={`Car ${index + 1}`}
                  className="w-52 h-auto mx-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;
