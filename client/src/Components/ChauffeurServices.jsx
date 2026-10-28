import React from "react";
import { Link } from "react-router-dom";

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
    image: "/images/fboimg.jpeg",
    description:
      "Celebrate prom night in a glamorous limo with your friends, ensuring a memorable and safe experience.",
  },
];

function ChauffeurServices() {
  return (
    <section className="lc-home-services py-16 text-center">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Title */}
        <p className="lc-kicker">Designed around the occasion</p>
        <h2 className="lc-section-title mb-3">Chauffeur services</h2>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-7 text-white/65">
          From airport journeys to special occasions, explore the services available across Metro Atlanta.
        </p>

        {/* Services Grid */}
        <div className="lc-home-services__grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/service/${service.slug}`}
              className="lc-home-service-card relative group block"
            >
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none"
              />
              <div className="lc-home-service-card__label">
                <h3>{service.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="mt-9">
          <Link
            to="/services"
            className="lc-button lc-button--outline"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ChauffeurServices;
