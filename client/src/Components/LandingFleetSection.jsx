import React from "react";
import { useNavigate } from "react-router-dom";

function LandingFleetSection() {
  const navigate = useNavigate();


  return (
    <section className="bg-white py-16 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">

  {/* Left Text */}
  <div className="md:w-1/2 text-center md:text-left space-y-6">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
      Luxurious Fleet <br />
      <span className="rolex-gold-text">For Ultimate Satisfaction</span>
    </h2>

    <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
      Premier Chauffeured experience where time,comfort, and discretion are held paramount.
      Explore our luxury cars and book a
      ride for the ultimate experience.
    </p>

    <button
      onClick={() => navigate("/fleet")}
      className=" btn btn-gold text-black font-semibold px-8 py-3 rounded-full text-base md:text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg"
    >
      Explore our Fleet
    </button>
  </div>

  {/* Right Image + Thumbnails */}
{/* Right Image Stack */}
<div className=" w-full relative flex justify-center md:justify-end items-center
                h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">

  {/* Fleet Lineup (Background) */}
  <img
    src="/images/fleet.jpeg"
    alt="Fleet Lineup"
    className="absolute top-0 right-0 z-0 w-[95%] md:w-full rounded-full max-w-2xl
               object-contain opacity-95 pointer-events-none
               translate-y-0 md:-translate-y-2 lg:-translate-y-4"
  />

  {/* Featured Vehicle (Foreground) */}
  {/* <img
    src="/images/Chvy.png"
    alt="Featured Vehicle"
    className="absolute bottom-0 right-2 md:right-6 lg:right-10 z-10
               w-[78%] sm:w-[70%] md:w-[62%] lg:w-[58%] max-w-xl
               object-contain drop-shadow-2xl pointer-events-none
               translate-y-2 md:translate-y-4"
  /> */}

</div>

</section>

  );
}

export default LandingFleetSection;
