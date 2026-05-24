import React from "react";
import { useNavigate } from "react-router-dom";
import EliteMembership from "../Components/EliteMembership";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CalendarCheck, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";


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
  const sectionVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  const itemUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };

  const itemLeft = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };

  const itemRight = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };


  return (


    <div className="text-white font-poppins bg-[#0a0a0a]">
      {/* Hero Banner */}
      <section
        className="relative h-[85vh] flex items-end overflow-hidden"
        style={{
          backgroundImage: "url('/images/cinema.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 sm:bg-black/30"></div>

        {/* Hero Content */}
        <div
          className="relative z-10 w-full text-center px-4
               pb-16 sm:pb-20 lg:pb-2
               animate-heroFloat"
        >
          {/* <h1 className="uppercase text-xs sm:text-sm lg:text-xl tracking-widest text-white mb-2 font-bricolage">
            Le Charlot <span className="text-[#D4AF37]">Limousine</span>
          </h1>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="text-white">Executive Chauffeur Service</span>
            <span className="block sm:inline"> in Atlanta.</span>
          </h2>

          <p className="text-gray-300 mt-4 text-sm sm:text-base lg:text-xl max-w-3xl mx-auto">
            From airport transfers to corporate arrivals, Le Charlot Limousine delivers
            precision, privacy, and prestige — every mile, every moment.
          </p>

          <p className="mt-3 text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.35em] text-[#B08D57]">
            Serving Atlanta • Buckhead • Alpharetta • Sandy Springs
          </p> */}

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/reservation-form")}
              className="px-7 py-3 sm:px-8 sm:py-4
              btn-gold btn text-black
                   rounded-full font-medium shadow-lg
                   hover:opacity-90 transition"
            >
              Reserve Your Ride
            </button>

            <button
              onClick={() => navigate("/fleet")}
              className="px-7 py-3 sm:px-8 sm:py-4
                   border btn text-[#B08D57]
                   rounded-full font-medium
                   btn-gold  hover:text-black transition"
            >
              View Our Fleet
            </button>
          </div>
        </div>
      </section>


      {/* Our Story */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img src="/images/3ec.jpg" alt="Luxury Fleet" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="uppercase text-xs md:text-sm tracking-widest rolex-gold-text mb-2">Our Story</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Crafting Unforgettable <span className="rolex-gold-text">Experiences</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            At Le Charlot Limousine, we don’t just move people; we move moments. Our fleet, expertly maintained and paired with professional chauffeurs, is designed to create unforgettable journeys across Atlanta and surrounding areas.
          </p>
          <p className="text-gray-400 leading-relaxed mb-6">
            Founded in Atlanta with mission to offer a more discreet, elevated alternative to traditional rideshare.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B08D57] text-xl"></i>
              Exclusive Fleet of Luxury & Executive Cars
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B08D57] text-xl"></i>
              Professionally trained Chauffeurs with executive-level etiquette
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-check-double-line text-[#B08D57] text-xl"></i>
              Personalized VIP Services & Corporate Travel
            </li>
          </ul>
          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-6 px-8 py-4 btn-gold btn  transition-all rounded-full font-medium text-lg shadow-lg"
          >
            Make Reservation
          </button>
        </div>
      </section>

      {/* The Le Charlot Experience (replaces Fleet Teaser) */}
      <motion.section
        className="py-20 lg:py-32 px-8 lg:px-[10%] bg-[#0a0a0a]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        {/* Header */}
        <motion.div className="text-center mb-14" variants={itemUp}>
          <p className="uppercase text-xs md:text-sm tracking-widest rolex-gold-text mb-2">
            The Le Charlot Experience
          </p>
          <h2 className="text-3xl md:text-5xl font-bold font-bricolage">
            Luxury you can feel, before you arrive.
          </h2>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
            We focus on precision, privacy, and comfort. From your first click to your final drop-off,
            everything is curated to feel effortless, polished, and premium.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <motion.div className="grid lg:grid-cols-3 gap-8" variants={sectionVariants}>
          {[
            {
              tag: "Precision",
              title: "Always on time",
              desc: "Your schedule matters. We plan ahead, confirm details, and operate with dispatcher-level attention.",
            },
            {
              tag: "Privacy",
              title: "Discreet by design",
              desc: "Quiet professionalism, respectful presence, and a smooth ride — ideal for executives and VIP clients.",
            },
            {
              tag: "Comfort",
              title: "Immaculate vehicles",
              desc: "Every ride is prepared and inspected so you step into a clean, elegant space that feels first-class.",
            },
          ].map((c, i) => (
            <motion.div
              key={i}
              variants={itemUp}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="bg-[#151515] rounded-3xl p-8 border border-[#2a2a2a] shadow-lg
                   hover:border-[#B08D57]/60 hover:shadow-[#B08D57]/10
                   transition"
            >
              <p className="text-[#B08D57] uppercase text-xs tracking-[0.25em] mb-3">{c.tag}</p>
              <h3 className="text-2xl font-bold mb-3 font-bricolage">{c.title}</h3>
              <p className="text-gray-400 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How it Works + Moments */}
        <div className="mt-16 grid lg:grid-cols-2 gap-10 items-start">
          {/* How it Works */}
          <motion.div
            variants={itemLeft}
            className="bg-[#111] rounded-3xl p-10 border border-[#2a2a2a]"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <p className="uppercase text-xs md:text-sm tracking-widest rolex-gold-text mb-2">
              How it works
            </p>
            <h3 className="text-2xl md:text-3xl font-bold font-bricolage mb-6">
              A smooth process, every time
            </h3>

            <div className="space-y-5">
              {[
                { n: 1, t: "Reserve in minutes", d: "Choose your ride details and confirm your pickup time." },
                { n: 2, t: "Payment received", d: "You’ll get an email confirming payment and reservation details." },
                { n: 3, t: "Dispatch confirmation", d: "We confirm the ride and you receive your final confirmation email." },
                { n: 4, t: "Chauffeur arrives", d: "Professional pickup, smooth transport, and a premium arrival." },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  variants={itemUp}
                  className="flex gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="w-9 h-9 rounded-full bg-[#B08D57] text-black flex items-center justify-center font-bold">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{s.t}</p>
                    <p className="text-gray-400 text-sm">{s.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Moments / Occasions */}
          <motion.div
            variants={itemRight}
            className="bg-[#111] rounded-3xl p-10 border border-[#2a2a2a]"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <p className="uppercase text-xs md:text-sm tracking-widest rolex-gold-text mb-2">
              Moments we elevate
            </p>
            <h3 className="text-2xl md:text-3xl font-bold font-bricolage mb-6">
              Built for your occasion
            </h3>

            <motion.div className="grid sm:grid-cols-2 gap-4" variants={sectionVariants}>
              {[
                { title: "Airport Transfers", desc: "Reliable pickups and smooth arrivals." },
                { title: "Corporate Travel", desc: "Quiet, polished, executive-ready." },
                { title: "Weddings & Events", desc: "Arrive with elegance and ease." },
                { title: "VIP Nights Out", desc: "Discreet service for premium evenings." },
                { title: "Hourly Charters", desc: "Flexible time blocks for your plans." },
                { title: "Group Transport", desc: "Comfort for guests and teams." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="bg-[#151515] rounded-2xl p-5 border border-[#2a2a2a]
                       hover:border-[#B08D57]/60 transition"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              variants={itemUp}
            >
              <motion.button
                onClick={() => navigate("/reservation-form")}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 px-7 py-3 btn-gold btn
                     text-black rounded-full font-semibold transition"
              >
                <CalendarCheck size={18} />
                Make a Reservation
              </motion.button>

              <motion.a
                href="tel:4044053738"
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#D4AF37]
                btn-gold btn hover:text-black transition"
              >
                <PhoneCall size={18} />
                Call Us
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>



      {/* Elite Membership */}
      <EliteMembership />

      {/* Why Choose Us */}
      <section className="py-20 lg:py-32 px-8 lg:px-[10%] bg-[#1a1a1a] grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase text-xs md:text-sm tracking-widest text-[#B08D57] mb-2">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-bricolage">
            Driven by <span className="text-[#B08D57]">Excellence & Elegance</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every ride with Le Charlot Limousine in Atlanta is a promise of refinement, comfort, and precision. We take care of every detail, from vehicle cleanliness to chauffeur etiquette, so you can enjoy the journey in absolute luxury.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B08D57]"></i>
              Professionally Trained Chauffeurs
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B08D57]"></i>
              24/7 Availability for Global Travel
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B08D57]"></i>
              Fleet of Luxury SUVs & Sprinters
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B08D57]"></i>
              Personalized VIP & Corporate Services
            </li>
            <li className="flex items-center gap-3">
              <i className="ri-star-fill text-[#B08D57]"></i>
              Discreet service for VIP clients
            </li>
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-700">
          <img src="/images/private.jpg" alt="Chauffeur Service" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%] grid lg:grid-cols-2 gap-12">
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Mission</h3>
          <p className="text-gray-400 leading-relaxed">
            To deliver a world-class chauffeured experience marked by elegance, precision, and hospitality throughout Atlanta. Seamless, refined transportation for clients who value discretion, comfort, and flawless service.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#B08D57] flex items-center justify-center font-bold text-white shadow-md">1</div>
        </div>
        <div className="bg-[#222] rounded-[20px] p-8 relative hover:scale-[1.03] transition-transform duration-500 shadow-lg">
          <h3 className="text-3xl font-bold mb-4 font-bricolage">Our Values</h3>
          <p className="text-gray-400 leading-relaxed">
            To be recognized as the most distinguished luxury transportation brand in Atlanta, elevating every journey into a personalized first-class experience with elite chauffeurs and unmatched client care.
          </p>
          <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-[#B08D57] flex items-center justify-center font-bold text-white shadow-md">2</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 px-8 lg:px-[12%]">
        <div className="text-center mb-16">
          <p className="uppercase text-sm tracking-[5px] text-[#B08D57] mb-2">Client Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold font-bricolage">Trusted by Atlanta Clients</h2>
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
                    <i className="fa-solid fa-quote-left text-4xl text-[#B08D57]"></i>
                    <div className="flex space-x-1">
                      {Array(5).fill().map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-[#B08D57]"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic mb-6">{t.text}</p>
                </div>
                <p className="font-bricolage text-[#B08D57] text-lg mt-auto">{t.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-32 bg-[#000] text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-bricolage rolex-gold-text">
          Experience Luxury Today
        </h2>
        <p className="text-gray-400 mb-8">Your private chauffeur in Atlanta is just a click away.</p>
        <button
          onClick={() => navigate("/reservation-form")}
          className="px-10 py-4 btn-gold btn transition-all rounded-full font-bold text-lg shadow-xl"
        >
          Reserve Your Ride
        </button>
        <a
          href="tel:4044053738"
          className="inline-flex  items-center gap-3 mt-8 px-8 py-4 rounded-full btn btn-gold  text-[#B08D57] text-xs tracking-widest uppercase hover:bg-[#B08D57] hover:text-black transition-all duration-300"
        >
          <PhoneCall size={18} />
          Call Us Now!
        </a>
      </section>
    </div>
  );
}

export default About;
