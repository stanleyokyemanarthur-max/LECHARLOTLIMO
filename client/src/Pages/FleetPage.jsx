import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Armchair,
  Radio,
  Music,
  GlassWater,
  Sparkles,
} from "lucide-react";

// Fleet data: store the icon component type, not JSX
const fleetData = [
  {
    id: 1,
    slug: "cadillac-escalade",
    title: "Cadillac Escalade",
    subtitle: "EXECUTIVE SUV ",
    image: "/images/escasuv.jpg",
    specs: [
      { icon: Users, text: "1–6 passengers" },
      { icon: Briefcase, text: "6-10 suitcases" },
      { icon: Armchair, text: "Captain’s leather seating" },
      { icon: Sparkles, text: "Quiet luxury cabin" },
    ],
  },
  {
    id: 2,
    slug: "chevrolet-suburban",
    title: "Chevrolet Suburban",
    subtitle: "FULL-SIZE SUV ",
    image: "/images/chevro.jpg",
    specs: [
      { icon: Users, text: "1-6 passengers" },
      { icon: Briefcase, text: "6-10 suitcases" },
      { icon: Armchair, text: "Captain’s leather seats" },
      { icon: GlassWater, text: "Rear climate & comfort features" },
    ],
  },
  {
    id: 3,
    slug: "sprinter-van",
    title: "Mercedes-Benz Sprinter",
    subtitle: "EXECUTIVE VAN ",
    image: "/images/benzz.jpg",
    specs: [
      { icon: Users, text: "11–15 passengers" },
      { icon: Briefcase, text: "10–12 large suitcases" },
      { icon: Armchair, text: "Forward-facing high-back seating" },
      { icon: Radio, text: "Onboard audio system" },
    ],
  },
  {
    id: 4,
    slug: "gmc-yukon-denali",
    title: "GMC Yukon Denali",
    subtitle: "LUXURY SUV",
    image: "/images/degmc.jpg",
    specs: [
      { icon: Users, text: "1–7 passengers" },
      { icon: Briefcase, text: "6–10 suitcases" },
      { icon: Armchair, text: "Captain’s leather seating" },
      { icon: Music, text: "Premium sound system" },
    ],
  },
];


function FleetPage() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0a0a0a] mt-12 min-h-screen py-28 px-6 md:px-12 text-white">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bricolage font-bold mb-3 rolex-gold-text">
          Our Luxurious Fleet
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore our premium fleet, crafted to deliver unmatched comfort, elegance, and reliability.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {fleetData.map((car) => (
          <div
            key={car.id}
            className="relative bg-gradient-to-tr from-[#111] to-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-500"
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={car.image}
                alt={car.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 mix-blend-overlay"></div>
            </div>

            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-2xl font-bold mb-1 uppercase">{car.title}</h2>
                <p className="rolex-gold-text font-semibold mb-4 uppercase tracking-wide">
                  {car.subtitle}
                </p>

                <ul className="text-gray-300 text-sm space-y-2 mb-6">
                  {car.specs.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-[#B08D57]" />
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                onClick={() => navigate(`/fleet/${car.slug}`)}
                className="btn btn-gold btn--hero  text-black font-bold py-3 rounded-full shadow-lg transition-all"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FleetPage;
