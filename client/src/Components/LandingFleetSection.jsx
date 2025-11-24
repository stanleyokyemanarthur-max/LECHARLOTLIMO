import React from "react";
import { useNavigate } from "react-router-dom";

function LandingFleetSection() {
  const navigate = useNavigate();

  const fleetThumbs = [
    "/images/-Cadillac.png",
    "/images/Gmcc.png",
    "/images/van.png",
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">

  {/* Left Text */}
  <div className="md:w-1/2 text-center md:text-left space-y-6">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
      Luxurious Fleet <br />
      <span className="text-yellow-600">for Ultimate Satisfaction</span>
    </h2>

    <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
      Premier Chauffeured Services. We value the time and quality
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

  {/* Right Image + Thumbnails */}
  <div className="md:w-1/2 flex flex-col items-center relative">
    
    {/* Featured vehicle */}
    <img
      src="/images/Chvy.png"
      alt="Featured Vehicle"
      className="w-[85%] md:w-[80%] max-w-xl object-contain drop-shadow-2xl mb-6"
    />

    {/* Fleet Thumbnails */}
    <div className="w-full py-4">
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {fleetThumbs.map((src, i) => (
          <div
            key={i}
            className="w-44 h-28 md:w-48 md:h-32 lg:w-52 lg:h-36 overflow-hidden rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <img
              src={src}
              alt={`Vehicle ${i}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>

  </div>

</section>

  );
}

export default LandingFleetSection;
