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

  const renderSection = (section, idx) => {
    // ✅ NEW: Media strip (visual block under hero)
    if (section.type === "mediaStrip") {
      return (
        <section
          key={idx}
          className="py-16 px-[8%] lg:px-[12%] border-t border-gray-800 bg-black"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-semibold text-[#B08D57]">
                  {section.title}
                </h2>
                {section.note && (
                  <p className="text-gray-400 mt-2 max-w-2xl">{section.note}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.items?.map((card, i) => (
                <div
                  key={i}
                  className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <p className="text-gray-200 font-semibold">{card.title}</p>
                    {card.text && (
                      <p className="text-gray-400 text-sm mt-1">{card.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // ✅ NEW: Large image + text (alternating premium sections)
    if (section.type === "imageText") {
      const reversed = section.reverse === true;
      const bgClass = section.bg === "dark" ? "bg-[#111]" : "bg-black";

      return (
        <section
          key={idx}
          className={`py-16 px-[8%] lg:px-[12%] border-t border-gray-800 ${bgClass}`}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={reversed ? "lg:order-2" : ""}>
              <img
                src={section.image}
                alt={section.title}
                className="rounded-2xl shadow-xl w-full h-[320px] object-cover border border-gray-800"
                loading="lazy"
              />
            </div>

            <div className={reversed ? "lg:order-1" : ""}>
              <h2 className="text-3xl font-semibold text-[#B08D57] mb-4">
                {section.title}
              </h2>

              {section.text && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {section.text}
                </p>
              )}

              {section.bullets?.length ? (
                <ul className="grid sm:grid-cols-2 gap-3">
                  {section.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-4 py-3 text-gray-300"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    // Existing sections (kept)
    if (section.type === "highlights") {
      return (
        <section
          key={idx}
          className="py-16 px-[8%] lg:px-[12%] bg-[#111] border-t border-gray-800"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#B08D57] mb-6">
              {section.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {section.items?.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800"
                >
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "events") {
      return (
        <section
          key={idx}
          className="py-16 px-[8%] lg:px-[12%] border-t border-gray-800"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#B08D57] mb-2">
              {section.title}
            </h2>
            {section.note && (
              <p className="text-gray-400 mb-6">{section.note}</p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {section.items?.map((e, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800"
                >
                  <p className="text-gray-200 font-semibold">{e.name}</p>
                  <p className="text-gray-400 text-sm mt-1">{e.season}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "logistics") {
      return (
        <section
          key={idx}
          className="py-16 px-[8%] lg:px-[12%] bg-[#111] border-t border-gray-800"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#B08D57] mb-6">
              {section.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {section.items?.map((row, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800"
                >
                  <p className="text-gray-200 font-semibold">{row.label}</p>
                  <p className="text-gray-400 mt-2">{row.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (section.type === "cta") {
      return (
        <section
          key={idx}
          className="py-16 px-[8%] lg:px-[12%] border-t border-gray-800"
        >
          <div className="max-w-6xl mx-auto bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#B08D57]">
                {section.title}
              </h2>
              <p className="text-gray-400 mt-2">{section.text}</p>
            </div>

            <Link
              to={section.buttonLink || "/contact"}
              className="btn btn-gold btn--hero text-black font-semibold px-6 py-3 rounded-full"
            >
              {section.buttonText || "Contact Us"}
            </Link>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="bg-black text-white">
      {/* ✅ HERO */}
      <section className="relative bg-[#0a0a0a] mt-10 py-20 px-[8%] lg:px-[12%]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <img
            src={service.image || service.icon}
            alt={service.title}
            className="rounded-2xl shadow-xl w-full lg:w-1/2 object-cover h-[320px] md:h-[420px] border border-gray-800"
            loading="lazy"
          />

          <div className="lg:w-1/2">
            <span className="uppercase tracking-widest text-sm text-[#B08D57]">
              Premium Chauffeur Service
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold mt-3 mb-4">
              {service.title}
            </h1>

            {service.tagline && (
              <p className="text-[#D4AF37] font-semibold mb-4">
                {service.tagline}
              </p>
            )}

            <p className="text-gray-300 leading-relaxed text-lg">
              {service.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="btn btn-gold btn--hero text-black font-semibold px-7 py-3 rounded-full"
              >
                Book Now
              </Link>

              <Link
                to="/fleet"
                className="border border-[#B08D57] text-[#B08D57] hover:bg-[#B08D57] hover:text-black transition px-7 py-3 rounded-full font-semibold"
              >
                View Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FULL DESCRIPTION */}
      <section className="py-16 px-[8%] lg:px-[12%] border-t border-gray-800">
        <div className="max-w-5xl mx-auto space-y-6 text-gray-300 leading-relaxed text-lg">
          {service.longDescription
            ?.trim()
            .split("\n")
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      </section>

      {/* ✅ SECTIONS */}
      {service.sections?.map(renderSection)}

      {/* Back Button */}
      <div className="text-center pb-20 pt-6">
        <Link
          to="/services"
          className="inline-block btn btn-gold btn--hero text-black font-semibold px-8 py-3 rounded-full transition duration-300"
        >
          ← Back to All Services
        </Link>
      </div>
    </div>
  );
}

export default Services;