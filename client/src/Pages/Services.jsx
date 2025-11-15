import React from "react";
import { useParams, Link } from "react-router-dom";
import servicesData from "../data/servicesData";

function Services() {
  const { slug } = useParams();
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black">
        <p className="text-lg">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] py-20 px-[8%] lg:px-[12%]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <img
            src={service.image || service.icon}
            alt={service.title}
            className="rounded-2xl shadow-xl w-full lg:w-1/2 object-cover"
          />
          <div className="lg:w-1/2">
            <span className="uppercase tracking-widest text-sm text-yellow-500">
              Premium Limousine Service
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-6">
              {service.title}
            </h1>
            <p className="text-gray-300 leading-relaxed text-lg">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Full Service Description */}
      <section className="py-16 px-[8%] lg:px-[12%] border-t border-gray-800">
        <div className="max-w-5xl mx-auto space-y-6 text-gray-300 leading-relaxed text-lg">
          {service.longDescription
            .trim()
            .split("\n")
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      </section>

      {/* Image + Text Side-by-Side Section */}
      <section className="py-20 px-[8%] lg:px-[12%] bg-[#111]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-5">
            <h2 className="text-3xl font-semibold text-yellow-500">
              Our Commitment to Excellence
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Every Le Charlot Limousine experience is built on reliability,
              comfort, and professionalism. From the moment you step into one of
              our vehicles, you’re surrounded by refined elegance and
              world-class service.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              We go beyond transportation — we create experiences tailored to
              your needs. Whether you’re traveling to an airport, a corporate
              event, or celebrating a personal milestone, our mission is to make
              every journey seamless and memorable.
            </p>
          </div>
          <img
            src="/images/commit.jpg"
            alt="Luxury Limousine Interior"
            className="rounded-2xl shadow-lg w-full lg:w-1/2 object-cover"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-[8%] lg:px-[12%] border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold text-yellow-500 mb-3">
            Why Choose Le Charlot Limousine
          </h2>
          <p className="text-gray-400 text-lg">
            Discover what makes us the trusted choice for luxury ground
            transportation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Professional Chauffeurs",
              text: "Our drivers are trained professionals dedicated to punctuality, safety, and discretion, ensuring a smooth and enjoyable journey every time.",
            },
            {
              title: "Luxury Fleet",
              text: "Choose from a selection of elegant, top-tier vehicles — from sleek sedans to spacious limousines, each maintained in pristine condition.",
            },
            {
              title: "Unmatched Comfort",
              text: "Experience plush interiors, advanced amenities, and a serene atmosphere that makes travel not just easy, but indulgent.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg hover:shadow-yellow-600/10 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Back Button */}
      <div className="text-center pb-20">
        <Link
          to="/services"
          className="inline-block bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-3 rounded-full transition duration-300"
        >
          ← Back to All Services
        </Link>
      </div>
    </div>
  );
}

export default Services;
