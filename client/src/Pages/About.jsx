import React from "react";
import { useNavigate } from "react-router-dom";
import EliteMembership from "../Components/EliteMembership";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function About() {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Jim W.",
      text: "Impressive service from start to finish. My chauffeur was punctual, discreet, and the vehicle was spotless. The perfect experience for airport transfers — truly first-class.",
    },
    {
      name: "Fatima B.",
      text: "Le Charlot Limousine delivers a level of comfort and professionalism you don’t find often. Smooth ride, elegant vehicle, and exceptional attention to detail. Highly recommended.",
    },
    {
      name: "Caleb C.",
      text: "From the moment we booked, everything felt effortless. The chauffeur was polished and respectful, and the experience was pure luxury. We arrived in style — exactly what we wanted.",
    },
  ];

  return (
    <div className="text-white font-poppins bg-[#0a0a0a]">
      {/* Hero Banner */}
      <section
        className="relative h-[85vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/cinema.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="uppercase text-sm lg:text-xl tracking-widest text-white mb-2 font-bricolage">
            Le Charlot <span className="text-[#D4AF37]">Limousine</span>
          </h1>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold">
            <span className="text-white">Executive Chauffeur Service</span> in Atlanta.
          </h2>
          <p className="text-gray-300 mt-4 lg:text-xl max-w-3xl mx-auto">
            From airport transfers to corporate arrivals, Le Charlot Limousine delivers precision, privacy, and prestige — every mile, every moment.
          </p>
          <p className="mt-3 text-xs lg:text-sm uppercase tracking-[0.35em] text-[#D4AF37]">
            Serving Atlanta • Buckhead • Alpharetta • Sandy Springs
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/reservation-form")}
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#D4AF37] transition-all rounded-full font-medium text-lg shadow-lg"
            >
              Reserve Your Ride
            </button>
            <button
              onClick={() => navigate("/fleet")}
              className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] rounded-full font-medium text-lg hover:bg-[#D4AF37] hover:text-black transition-all"
            >
              View Our Fleet
            </button>
          </div>
        </div>
      </section>

      {/* Fleet Teaser Section */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] bg-[#0a0a0a]">
        <div className="text-center mb-12">
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#D4AF37] mb-2">
            Our Signature Fleet
          </p>
          <h2 className="text-3xl md:text-5xl font-bold font-bricolage">
            Every journey deserves perfection
          </h2>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            Each vehicle in our fleet is hand-selected for comfort, elegance, and performance. Whether it’s a wedding, airport transfer, or corporate event, your journey is our priority.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Vehicle 1 */}
          <div className="bg-[#222] rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500">
            <img src="/images/-Cadillac.png" alt="Luxury Sedan" className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Cadillac Escalade</h3>
              <p className="text-gray-400">Perfect for airport transfers and business travel. Seats 3 passengers comfortably.</p>
            </div>
          </div>

          {/* Vehicle 2 */}
          <div className="bg-[#222] rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500">
            <img src="/images/newgmc.png" alt="Executive SUV" className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">GMC Yukon Denali</h3>
              <p className="text-gray-400">Spacious and elegant for corporate groups or family travel. Seats up to 6 passengers.</p>
            </div>
          </div>

          {/* Vehicle 3 */}
          <div className="bg-[#222] rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500">
            <img src="/images/newchvy.png" alt="Luxury Sprinter" className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Chevrolet Suburban</h3>
              <p className="text-gray-400">Ideal for VIP groups or corporate transfers. Seats up to 8 passengers in comfort.</p>
            </div>
          </div>
          {/* Vehicle 4 */}
          <div className="bg-[#222] rounded-3xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-500">
            <img src="/images/van.png" alt="Luxury Sprinter" className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Luxury Sprinter</h3>
              <p className="text-gray-400">Ideal for group travel or VIP events. Seats up to 12 passengers in total comfort.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img src="/images/3ec.jpg" alt="Luxury Fleet" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#D4AF37] mb-2">Our Story</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Crafting Unforgettable <span className="text-[#D4AF37]">Experiences</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            At Le Charlot Limousine, we don’t just move people; we move moments. Our fleet, expertly maintained and paired with professional chauffeurs, is designed to create unforgettable journeys across Atlanta and surrounding areas.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Founded on discretion, elegance, and precision, our services cater to clients who value refinement and sophistication.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#D4AF37] text-xl"></i>
              Exclusive Fleet of Luxury & Executive Cars
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#D4AF37] text-xl"></i>
              Professional Chauffeurs with Years of Experience
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#D4AF37] text-xl"></i>
              Personalized VIP Services & Corporate Travel
            </li>
          </ul>
          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] transition-all rounded-full font-medium text-lg shadow-lg"
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
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#D4AF37] mb-2">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Driven by <span className="text-[#D4AF37]">Excellence & Elegance</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every ride with Le Charlot Limousine in Atlanta is a promise of refinement, comfort, and precision. We take care of every detail, from vehicle cleanliness to chauffeur etiquette, so you can enjoy the journey in absolute luxury.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#D4AF37]"></i>
              Professionally Trained Chauffeurs
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#D4AF37]"></i>
              24/7 Availability for Global Travel
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#D4AF37]"></i>
              Fleet of Luxury SUVs & Sprinters
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#D4AF37]"></i>
              Personalized VIP & Corporate Services
            </li>
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img src="/images/Experience.jpg" alt="Chauffeur Service" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%] grid lg:grid-cols-2 gap-12">
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Mission</h3>
          <p className="text-gray-400 leading-relaxed">
            To deliver a world-class chauffeured experience marked by elegance, precision, and hospitality throughout Atlanta. Seamless, refined transportation for clients who value discretion, comfort, and flawless service.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-white shadow-md">1</div>
        </div>
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Values</h3>
          <p className="text-gray-400 leading-relaxed">
            To be recognized as the most distinguished luxury transportation brand in Atlanta, elevating every journey into a personalized first-class experience with elite chauffeurs and unmatched client care.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-white shadow-md">2</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%]">
        <div className="text-center mb-16">
          <p className="uppercase text-sm tracking-[5px] text-[#D4AF37] mb-2">Client Testimonials</p>
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
                    <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37]"></i>
                    <div className="flex space-x-1">
                      {Array(5).fill().map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-[#D4AF37]"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-6">{t.text}</p>
                </div>
                <p className="font-bricolage text-[#D4AF37] text-lg mt-auto">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-[#000] text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bricolage text-[#D4AF37]">
          Experience Luxury Today
        </h2>
        <p className="text-gray-400 mb-8">Your private chauffeur in Atlanta is just a click away.</p>
        <button
          onClick={() => navigate("/reservation-form")}
          className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] transition-all rounded-full font-bold text-lg shadow-xl"
        >
          Reserve Your Ride
        </button>
      </section>
    </div>
  );
}

export default About;
