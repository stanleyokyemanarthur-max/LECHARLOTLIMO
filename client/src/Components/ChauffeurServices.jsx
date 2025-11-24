import React from "react";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Airport Services",
    slug: "airport-services",
    image: "/images/Air.jpg",
    description:
      "Enjoy professional airport transfer service with timely pickups and drop-offs, ensuring your journey begins or ends in complete comfort.",
  },
  {
    id: 2,
    title: "Wine Tours",
    slug: "wine-tours",
    image: "/images/wine.jpg",
    description:
      "Private jet travelers receive VIP ground transportation to and from FBO terminals with our premium fleet.",
  },
  {
    id: 3,
    title: "Concerts",
    slug: "concerts",
    image: "/images/concert.jpg",
    description:
      "Arrive at meetings and events in style with professional chauffeurs and executive-class vehicles.",
  },
  {
    id: 4,
    title: "Weddings",
    slug: "wedding-limousine-service",
    image: "/images/Peacwed.jpg",
    description:
      "Make your big day even more special with elegant limousine transportation for the couple and guests.",
  },
  {
    id: 5,
    title: "Night Outs",
    slug: "night-in-town",
    image: "/images/night.jpg",
    description:
      "Enjoy the nightlife with safe, stylish, and luxurious limousine transportation for your group.",
  },
  {
    id: 6,
    title: "Proms",
    slug: "prom-limousine-service",
    image: "/images/Prom 25.jpg",
    description:
      "Celebrate prom night in a glamorous limo with your friends, ensuring a memorable and safe experience.",
  },
  {
    id: 7,
    title: "Anniversaries",
    slug: "anniversary-services",
    image: "/images/anni.jpg",
    description:
      "Celebrate prom night in a glamorous limo with your friends, ensuring a memorable and safe experience.",
  },
  {
    id: 8,
    title: "Sporting Events",
    slug: "sporting-events",
    image: "/images/sport.jpg",
    description:
      "Celebrate prom night in a glamorous limo with your friends, ensuring a memorable and safe experience.",
  },
  {
    id: 9,
    title: "FBO Executive Chauffeur Service",
    slug: "fbo-executive-chauffeur-service",
    image: "/images/fbo.png",
    description:
      "Celebrate prom night in a glamorous limo with your friends, ensuring a memorable and safe experience.",
  },
];

function ChauffeurServices() {
  return (
    <section className="py-16 bg-white text-center">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Our Chauffeur Services
        </h2>
        <div className="w-16 h-1 bg-yellow-500 mx-auto mb-8 rounded-full"></div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.a
              key={service.id}
              href={`/service/${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="relative group overflow-hidden rounded-lg shadow-lg block"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-80 py-3">
                <h3 className="text-yellow-700 font-medium text-lg">{service.title}</h3>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Button */}
        <div className="mt-10">
          <a
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-700 text-black font-medium px-6 py-4 rounded hover:bg-yellow-600 transition"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}

export default ChauffeurServices;
