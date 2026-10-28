import React from "react";
import { useNavigate } from "react-router-dom";

function LandingFleetSection() {
  const navigate = useNavigate();


  return (
    <section className="flex flex-col items-center justify-between gap-10 overflow-hidden border-y border-white/10 bg-[#101010] px-6 py-16 text-white sm:px-8 md:flex-row md:px-16">

  {/* Left Text */}
  <div className="space-y-6 text-center md:w-1/2 md:text-left">
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">Our Fleet</p>
    <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
      Luxurious Fleet <br />
      <span className="text-[#D4AF37]">For Your Journey</span>
    </h2>

    <p className="mx-auto max-w-md text-base leading-relaxed text-white/75 md:mx-0 md:text-lg">
      Explore the vehicles available for chauffeur-driven travel across Atlanta
      and the surrounding metropolitan area.
    </p>

    <button
      type="button"
      onClick={() => navigate("/fleet")}
      className="lc-button"
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
    alt="Le Charlot Limousine vehicle fleet"
    className="absolute top-0 right-0 z-0 w-[95%] md:w-full rounded-full max-w-2xl
               object-contain opacity-95 pointer-events-none
               translate-y-0 md:-translate-y-2 lg:-translate-y-4"
    loading="lazy"
    decoding="async"
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
