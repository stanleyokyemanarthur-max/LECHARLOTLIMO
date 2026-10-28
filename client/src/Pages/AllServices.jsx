import React from "react";
import { useNavigate } from "react-router-dom";
import servicesData from "../data/servicesData.js";
import PageHero from "../Components/PageHero";

function AllServices() {
  const navigate = useNavigate();

  return (
    <main className="lc-page">
      <PageHero
        eyebrow="Our expertise"
        title="Journeys, thoughtfully arranged."
        description="Le Charlot Limousine offers chauffeur services across Metro Atlanta, with options for airport transfers, executive travel, and special occasions."
      />

      <div className="lc-service-grid">
        {servicesData.map((service) => (
          <article
            key={service.id}
            className="lc-service-card"
          >
            <div className="lc-service-card__icon">
              <img
                src={service.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="lc-kicker">{service.tagline || "Chauffeur service"}</p>
            <h2 className="lc-service-card__title">{service.title}</h2>

            <p className="lc-service-card__description">
              {service.description}
            </p>

            <button
              type="button"
              onClick={() => navigate(`/services/${service.slug}`)}
              className="lc-text-link"
            >
              Explore service <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}

export default AllServices;