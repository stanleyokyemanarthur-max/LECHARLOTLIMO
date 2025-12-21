import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";



function ReservationForm() {
  const navigate = useNavigate();

  const fleet = [
    { src: "/images/-Cadillac.png", title: "Cadillac Escalade" },
    { src: "/images/Gmcc.png", title: "GMC Yukon Denali" },
    { src: "/images/Chevy.jpg", title: "Chevrolet Suburban" },
    { src: "/images/van.png", title: "Sprinter Van" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111111] via-[#1a1a1a] to-[#222222] text-white font-['Lora'] pt-32 pb-32 px-6 md:px-12">
      
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-widest text-[#d4af37]">
          Reserve Your Ride
        </h1>
        <div className="w-24 h-[3px] bg-[#d4af37] mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
          Make your reservation effortlessly — whether it’s for airport transfers,
          corporate events, or special occasions. Select your preferred vehicle and
          enjoy a journey of comfort, elegance, and punctuality with our professional chauffeurs.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-24">
        <button
          onClick={() => navigate("/reserve")}
          className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-semibold py-4 px-12 rounded-full shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-500 tracking-wide"
        >
          Reserve Instantly
        </button>
        <div className="text-center md:text-left">
          <p className="text-gray-300 uppercase tracking-wide mb-2">or call us now</p>
          <a
            href="tel:+18004310313"
            className="text-[#d4af37] text-xl font-bold hover:underline"
          >
            (404) 405-3738
          </a>
        </div>
      </div>

      {/* Fleet Carousel */}
      <div className="max-w-6xl mx-auto mb-24">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {fleet.map((car, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-500 hover:scale-105">
                <img
                  src={car.src}
                  alt={car.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#ffd700] tracking-wider">
                    {car.title}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer Call-To-Action */}
      <div className="text-center mt-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-6 tracking-widest">
          Ready for a Premium Ride?
        </h2>
        <button
          onClick={() => navigate("/reserve")}
          className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-bold py-4 px-16 rounded-full shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-500 tracking-wide"
        >
          Reserve Now
        </button>
      </div>
    </div>
  );
}

export default ReservationForm;
