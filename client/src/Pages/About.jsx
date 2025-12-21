import React from "react";
import { useNavigate } from "react-router-dom";
import EliteMembership from "../Components/EliteMembership";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

function About() {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Olivia H., Atlanta",
      text: "Pierre's French accent and warm personality make every trip unforgettable. Truly a five-star experience.",
    },
    {
      name: "Raymond M., Buckhead",
      text: "I’ve never experienced such class in Georgia. Pierre monitors flights, offers wake-up calls, and even had a warm latte ready.",
    },
    {
      name: "Daniella & Marcus, Alpharetta",
      text: "We love the smooth ride, the music selection, and the elegance Pierre brings. Hands down the best black-car service ever.",
    },
    {
      name: "Jasmine P., Midtown",
      text: "Pierre's service is refined, respectful, and incredibly polished. His French accent, sharp attire, and kindness set the tone.",
    },
  ];

  return (
    <div className="text-white font-poppins bg-[#0a0a0a]">
      {/* Hero Banner */}
      <section
        className="relative h-[500px] lg:h-[700px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/cinema.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for cinematic luxury feel */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="uppercase text-sm lg:text-xl tracking-widest text-white mb-2 font-bricolage">
            Le Charlot <span className="text-[#B8860B]">Limousine</span>
          </h1>
          <h2 className="text-4xl lg:text-6xl xl:text-8xl font-bold">
            <span className="text-white">About</span> Us
          </h2>
          <p className="text-gray-300 mt-4 lg:text-xl">
            Redefining luxury transportation, one journey at a time.
          </p>
          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-[#B8860B] to-yellow-500 hover:from-yellow-500 hover:to-[#B8860B] transition-all rounded-full font-medium text-lg shadow-lg"
          >
            Reserve Your Ride
          </button>
        </div>
      </section>


      {/* Our Story */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img
            src="/images/3ec.jpg"
            alt="Luxury Fleet"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#B8860B] mb-2">
            Our Story
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Crafting Unforgettable <span className="text-[#B8860B]">Experiences</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            At Le Charlot Limousine, we don’t just move people; we move moments. Our fleet, expertly maintained and paired with professional chauffeurs, is designed to create unforgettable journeys for every occasion.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Founded on the principles of discretion, elegance, and precision, our services cater to clients who value refinement and sophistication.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B8860B] text-xl"></i>
              Exclusive Fleet of Luxury & Executive Cars
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B8860B] text-xl"></i>
              Professional Chauffeurs with Years of Experience
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B8860B] text-xl"></i>
              Personalized VIP Services & Corporate Travel
            </li>
          </ul>
          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-[#B8860B] to-yellow-500 hover:from-yellow-500 hover:to-[#B8860B] transition-all rounded-full font-medium text-lg shadow-lg"
          >
            Make Reservation
          </button>
        </div>
      </section>

      {/* Elite Membership */}
      <EliteMembership />

      {/* Why Choose Us */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] bg-[#1a1a1a] grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#B8860B] mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Driven by <span className="text-[#B8860B]">Excellence & Elegance</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every ride with Le Charlot Limousine is a promise of refinement, comfort, and precision. We take care of every detail, from vehicle cleanliness to chauffeur etiquette, so you can enjoy the journey in absolute luxury.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B8860B]"></i>
              Professionally Trained Chauffeurs
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B8860B]"></i>
              24/7 Availability for Global Travel
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B8860B]"></i>
              Fleet of Luxury SUVs & Sprinters
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B8860B]"></i>
              Personalized VIP & Corporate Services
            </li>
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img
            src="/images/Experience.jpg"
            alt="Chauffeur Service"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%] grid lg:grid-cols-2 gap-12">
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Mission</h3>
          <p className="text-gray-400 leading-relaxed">
            To deliver a world-class chauffeured experience marked by elegance, precision, and hospitality. We provide seamless, refined transportation for clients who value discretion, comfort, and flawless service.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center font-bold text-white shadow-md">1</div>
        </div>
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Values</h3>
          <p className="text-gray-400 leading-relaxed">
            To be recognized as the most distinguished luxury transportation brand, elevating every journey into a personalized first-class experience with elite chauffeurs and unmatched client care.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center font-bold text-white shadow-md">2</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%]">
        <div className="text-center mb-16">
          <p className="uppercase text-sm tracking-[5px] text-[#B8860B] mb-2">Client Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold font-bricolage">Trusted by Thousands</h2>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          loop
          autoplay={{ delay: 4000 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-[#222] rounded-3xl p-8 shadow-lg flex flex-col justify-between h-full transform hover:scale-105 transition-transform duration-500">
                <div>
                  <div className="flex justify-between mb-6">
                    <i className="fa-solid fa-quote-left text-4xl text-[#B8860B]"></i>
                    <div className="flex space-x-1">
                      {Array(5).fill().map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-[#B8860B]"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-6">{t.text}</p>
                </div>
                <p className="font-bricolage text-[#B8860B] text-lg mt-auto">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-[#000] text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bricolage text-[#B8860B]">
          Experience Luxury Today
        </h2>
        <p className="text-gray-400 mb-8">Your private chauffeur is just a click away.</p>
        <button
          onClick={() => navigate("/reservation-form")}
          className="px-10 py-4 bg-gradient-to-r from-[#B8860B] to-yellow-500 hover:from-yellow-500 hover:to-[#B8860B] transition-all rounded-full font-bold text-lg shadow-xl"
        >
          Reserve Your Ride
        </button>
      </section>
    </div>
  );
}

export default About;
