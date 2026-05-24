import React from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../data/servicesData.js";

function AllServices() {
  const navigate = useNavigate();

  return (
    <div className="bg-black mt-18 text-white py-20 px-[8%] lg:px-[12%]">
      <div className="text-center mb-16">
        <p className="uppercase text-sm tracking-[5px] text-[#B08D57] mb-2">
          Our Expertise
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
          Our Services
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Le Charlot Limousine offers premium chauffeur services across Metro Atlanta—built for comfort, timing, and discretion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="bg-[#1c1c1c] p-6 rounded-2xl shadow-md hover:bg-[#262626] transition-all duration-300 border border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={service.icon}
                alt={service.title}
                className="w-10 h-10 object-contain opacity-90"
              />
              <h3 className="text-2xl font-semibold font-bricolage">
                {service.title}
              </h3>
            </div>

            {service.tagline && (
              <p className="text-[#D4AF37] text-sm font-semibold mb-2">
                {service.tagline}
              </p>
            )}

            <p className="text-gray-400 text-md mb-6 leading-relaxed">
              {service.description}
            </p>

            <button
              onClick={() => navigate(`/services/${service.slug}`)}
              className="btn btn-gold btn--hero text-black font-semibold px-5 py-2 rounded-full transition"
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllServices;