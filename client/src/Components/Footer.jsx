import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Fleet", to: "/fleet" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const serviceLinks = [
  { label: "Airport services", to: "/service/airport-services" },
  { label: "FBO chauffeur service", to: "/service/fbo-executive-chauffeur-service" },
  { label: "Wedding transportation", to: "/service/wedding-limousine-service" },
  { label: "Prom transportation", to: "/service/prom-limousine-service" },
];

function Footer() {
  return (
    <footer className="lc-site-footer px-6 text-white sm:px-8 lg:px-[8%]">
      <div className="mx-auto max-w-7xl">
        <div className="lc-site-footer__main">
          <div className="lc-site-footer__brand">
            <Link
              to="/"
              aria-label="Le Charlot Limousine home"
              className="mb-4 inline-flex rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <img
                src="/images/logoiz.png"
                alt="Le Charlot Limousine"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="lc-site-footer__description">
              Chauffeur-driven airport transfers, executive travel, and special-occasion
              transportation across Metro Atlanta.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="lc-site-footer__heading">Explore</h2>
            <ul className="lc-site-footer__links">
              {navigationLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link className="lc-site-footer__link focus-visible:outline" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Chauffeur services">
            <h2 className="lc-site-footer__heading">Chauffeur services</h2>
            <ul className="lc-site-footer__links">
              {serviceLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link className="lc-site-footer__link focus-visible:outline" to={to}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="lc-site-footer__heading">Contact &amp; reservations</h2>
            <div className="lc-site-footer__contact">
              <a
                href="tel:+14044053738"
                className="lc-site-footer__link gap-3 focus-visible:outline"
              >
                <Phone size={16} className="text-[#D4AF37]" aria-hidden="true" />
                (404) 405-3738
              </a>
              <a
                href="mailto:info@lecharlotlimousine.com"
                className="lc-site-footer__link gap-3 focus-visible:outline"
              >
                <Mail size={16} className="text-[#D4AF37]" aria-hidden="true" />
                info@lecharlotlimousine.com
              </a>
              <Link
                to="/reserve"
                className="lc-site-footer__booking rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
              >
                Begin a reservation <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <p className="lc-site-footer__bottom">
          © {new Date().getFullYear()} Le Charlot Limousine. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
