import React from "react";
import { useParams } from "react-router-dom";
import ChauffeurData from "../data/chauffeurData.js";

function ServiceDetails() {
  const { slug } = useParams();
  const service = ChauffeurData.find((s) => s.slug === slug);

  if (!service)
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black">
        Service not found.
      </div>
    );

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-16 gap-8">
        <div className="lg:w-1/2 max-w-xl space-y-6 mx-auto lg:mx-0 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold">{service.title}</h1>
          <div className="space-y-4 text-gray-300 text-lg">
            {service.hero.description.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
          {service.hero.cta && (
            <a
              href={service.hero.cta.link}
              className="inline-block bg-yellow-600 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-500 transition mt-4"
            >
              {service.hero.cta.text}
            </a>
          )}
        </div>
        <div className="lg:w-1/2 max-w-xl mx-auto">
          <img
            src={service.hero.image}
            alt={service.title}
            className="rounded-lg shadow-lg w-full object-cover max-h-[400px]"
          />
        </div>
      </div>

      {/* Sections */}
      {service.sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col lg:flex-row items-center justify-center gap-8 px-6 lg:px-16 py-12 ${
            index % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="lg:w-1/2 max-w-lg mx-auto">
            <img
              src={section.image}
              alt={section.title}
              className="rounded-lg shadow-lg w-full object-cover max-h-[400px]"
            />
          </div>

          {/* Text */}
          <div className="lg:w-1/2 max-w-lg mx-auto text-gray-300 text-lg text-center lg:text-left space-y-4">
            <h2 className="text-2xl font-semibold text-yellow-500">{section.title}</h2>
            {section.text.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceDetails;
