import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Armchair,
  Radio,
  Music,
  GlassWater,
  Sparkles, // ✅ Replaces Mirror
} from "lucide-react"; // Lucide icon set


const fleetData = [
  {
    id: 1,
    slug: "luxury-sedan",
    title: "Luxury Sedan",
    subtitle: "1-4 PASSENGER",
    image: "/images/-Cadillac.png",
    specs: [
      { icon: <Users className="w-4 h-4 text-yellow-600" />, text: "1-4 passengers" },
      { icon: <Briefcase className="w-4 h-4 text-yellow-600" />, text: "2-3 medium sized bags" },
      { icon: <Armchair className="w-4 h-4 text-yellow-600" />, text: "Plush leather seating" },
      { icon: <Sparkles className="w-4 h-4 text-yellow-600" />, text: "Dual Illuminating Vanity Mirrors" },
    ],
  },
  {
    id: 2,
    slug: "luxury-suv",
    title: "SUV",
    subtitle: "SUV 6-7 PASSENGER",
    image: "/images/Chvy.png",
    specs: [
      { icon: <Users className="w-4 h-4 text-yellow-600" />, text: "6-7 passengers" },
      { icon: <Briefcase className="w-4 h-4 text-yellow-600" />, text: "Luggage 8-10 Small or 7-8 Large" },
      { icon: <Armchair className="w-4 h-4 text-yellow-600" />, text: "Plush leather seating" },
      { icon: <GlassWater className="w-4 h-4 text-yellow-600" />, text: "Rear Armrest and Drink Holders" },
    ],
  },
  {
    id: 3,
    slug: "sprinter-van",
    title: "Sprinter Van",
    subtitle: "SPRINTER VAN (11 OR 14 PASSENGER)",
    image: "/images/black.png",
    specs: [
      { icon: <Users className="w-4 h-4 text-yellow-600" />, text: "11-14 passengers" },
      { icon: <Briefcase className="w-4 h-4 text-yellow-600" />, text: "Luggage 10-12 Large or 12-14 Small" },
      { icon: <Armchair className="w-4 h-4 text-yellow-600" />, text: "Forward Facing Seating" },
      { icon: <Radio className="w-4 h-4 text-yellow-600" />, text: "AM/FM Radio" },
    ],
  },
  {
    id: 4,
    slug: "stretch-limo-6",
    title: "Stretch Limo 6",
    subtitle: "STRETCH LIMO – 6 PASSENGER",
    image: "/images/Gmcc.png",
    specs: [
      { icon: <Users className="w-4 h-4 text-yellow-600" />, text: "6 passengers" },
      { icon: <Briefcase className="w-4 h-4 text-yellow-600" />, text: "Luggage 3-4 Large or 4-5 Small" },
      { icon: <Armchair className="w-4 h-4 text-yellow-600" />, text: "Plush leather seating" },
      { icon: <Music className="w-4 h-4 text-yellow-600" />, text: "AM/FM Stereo & CD Player" },
    ],
  },
  {
    id: 5,
    slug: "stretch-limo-10",
    title: "Stretch Limo 10",
    subtitle: "STRETCH LIMO – 10 PASSENGER",
    image: "/images/suburban.png",
    specs: [
      { icon: <Users className="w-4 h-4 text-yellow-600" />, text: "10-14 passengers" },
      { icon: <Briefcase className="w-4 h-4 text-yellow-600" />, text: "Luggage 3-4 Large or 4-5 Small" },
      { icon: <Armchair className="w-4 h-4 text-yellow-600" />, text: "Plush leather seating" },
      { icon: <Music className="w-4 h-4 text-yellow-600" />, text: "AM/FM Stereo & CD Player" },
    ],
  },
];


function FleetPage() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6 md:px-12">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Our Luxurious Fleet
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our selection of premium vehicles. Whether you need a sedan,
          SUV, limo, or van, each vehicle offers unmatched comfort and luxury.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {fleetData.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition flex flex-col overflow-hidden"
          >
            <img
              src={car.image}
              alt={car.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1 uppercase">
                  {car.title}
                </h2>
                <p className="text-sm text-yellow-600 font-semibold mb-4 uppercase tracking-wide">
                  {car.subtitle}
                </p>

                <ul className="text-gray-700 text-sm space-y-2 mb-6">
                  {car.specs.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate(`/fleet/${car.slug}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition"
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
