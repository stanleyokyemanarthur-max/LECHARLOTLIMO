import React from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../Components/PageHero";
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
    <main className="lc-page">
      <PageHero
        eyebrow="The fleet"
        title="A considered collection."
        description="Explore the vehicles available for your journey, with capacity and comfort details to help you choose."
      />

      {/* Grid */}
      <div className="lc-fleet-grid">
        {fleetData.map((car) => (
          <article
            key={car.id}
            className="lc-fleet-card group"
          >
            <div className="lc-fleet-card__image">
              <img
                src={car.image}
                alt={`${car.title} chauffeur vehicle`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transform-none"
              />
              <span className="lc-fleet-card__index" aria-hidden="true">
                {String(car.id).padStart(2, "0")}
              </span>
            </div>

            <div className="lc-fleet-card__body">
              <div>
                <p className="lc-kicker">{car.subtitle}</p>
                <h2 className="lc-fleet-card__title">{car.title}</h2>

                <ul className="lc-fleet-card__specs">
                  {car.specs.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                        <span>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/fleet/${car.slug}`)}
                className="lc-button lc-button--outline mt-7 w-full"
              >
                Explore vehicle <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default FleetPage;
