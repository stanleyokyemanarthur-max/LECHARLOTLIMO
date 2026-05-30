import React, { useState, useRef, useEffect, } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';  // ✅ FIXED
import 'swiper/css';
import 'swiper/css/autoplay';
import { motion, AnimatePresence } from "framer-motion";
import { EffectFade } from "swiper/modules";
import { Pagination, Autoplay } from 'swiper/modules';
import "react-datepicker/dist/react-datepicker.css";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import blogdata from '../Blog.json'
import BookingForm from '../Components/BookingForm';
import Spinner from '../Components/Spinner';
import { useNavigate } from 'react-router-dom';
import LandingFleetSection from '../Components/LandingFleetSection';
import "swiper/css/effect-fade";
import ChauffeurServices from '../Components/ChauffeurServices';
import EliteMembership from '../Components/EliteMembership';
import { Car, Clock, Zap, Droplet, CreditCard, UserCheck } from "lucide-react";
function Index() {
  const [pickUpDate, setPickUpDate] = useState(null);
  const datePickerRef = useRef(null);

  const navigate = useNavigate();


  // ✅ Page loading spinner
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page preloading (e.g. images, content, etc.)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // show spinner for ~2 seconds
    return () => clearTimeout(timer);
  }, []);



  // ✅ Google Places setup
  const libraries = ["places"];
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // use env key
    libraries,
  });

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="hero pt-[env(safe-area-inset-top)] mt-24 md:mt-12 xl:mt-8">
        {loading && <Spinner />}

        <Swiper
          modules={[Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          speed={2200}
          className="hero-swiper"
        >
          <SwiperSlide>
            <motion.div
              className="hero-slide"
              style={{ "--hero-bg": "url('/images/glovs.jpeg')" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-eyebrow">COMFORT · CLASS · PRECISION</span>

                  <h1 className="hero-title">
                    Executive Chauffeur <br />Service in Atlanta.
                  </h1>

                  <p className="hero-subcopy">
                    Premium airport and corporate transportation with professional chauffeurs,
                    pristine vehicles, and seamless booking.
                  </p>

                  <p className="hero-italic">Discretion. Presence. Confidence.</p>

                  <div className="hero-actions">
                    <button
                      onClick={() => navigate("/reservation-form")}
                      className="btn btn-gold btn--hero"
                    >
                      Reserve Your Chauffeur ↗
                    </button>

                    <button
                      onClick={() => navigate("/fleet")}
                      className="hero-btn hero-btn--link"
                    >
                      View Fleet ↗
                    </button>
                  </div>

                  <div className="hero-features">
                    <span>✓ Licensed &amp; Insured</span>
                    <span>✓ Professional Chauffeurs</span>
                    <span>✓ 24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="hero-bottom">
                <span>↓</span>
                <span>Discover the Experience</span>
              </div>
            </motion.div>
          </SwiperSlide>
          <SwiperSlide>
            <motion.div
              className="hero-slide"
              style={{ "--hero-bg": "url('/images/gloves.png')" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-eyebrow">COMFORT · CLASS · PRECISION</span>

                  <h1 className="hero-title">
                    Drive in Style <br />Arrive Distinguished.
                  </h1>

                  <p className="hero-subcopy">
                  Chauffeur-driven luxury crafted for those who value discretion, comfort, and impeccable service.
                  </p>
                  <p className="hero-subcopy">
                  Premium airport and corporate transportation across 
                  Atlanta and its metro areas.
                
                  </p>

                  <p className="hero-italic">Discretion. Presence. Confidence.</p>

                  <div className="hero-actions">
                    <button
                      onClick={() => navigate("/reservation-form")}
                      className="btn btn-gold btn--hero"
                    >
                      Reserve Your Chauffeur ↗
                    </button>

                    <button
                      onClick={() => navigate("/fleet")}
                      className="hero-btn hero-btn--link"
                    >
                      View Fleet ↗
                    </button>
                  </div>

                  <div className="hero-features">
                    <span>✓ Licensed &amp; Insured</span>
                    <span>✓ Professional Chauffeurs</span>
                    <span>✓ 24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="hero-bottom">
                <span>↓</span>
                <span>Discover the Experience</span>
              </div>
            </motion.div>
          </SwiperSlide>
          <SwiperSlide>
            <motion.div
              className="hero-slide"
              style={{ "--hero-bg": "url('/images/chau.jpg')" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <div className="hero-inner">
                <div className="hero-content">
                  <span className="hero-eyebrow">COMFORT · CLASS · PRECISION</span>

                  <h1 className="hero-title">
                   A Seamless Journey, <br />Defined by Excellence
                  </h1>

                  <p className="hero-subcopy">
                  From airport transfers to corporate engagements, every detail is curated to exceed expectations.
                  </p>

                  <p className="hero-italic">Discretion. Presence. Confidence.</p>

                  <div className="hero-actions">
                    <button
                      onClick={() => navigate("/reservation-form")}
                      className="btn btn-gold btn--hero"
                    >
                      Reserve Your Chauffeur ↗
                    </button>

                    <button
                      onClick={() => navigate("/fleet")}
                      className="hero-btn hero-btn--link"
                    >
                      View Fleet ↗
                    </button>
                  </div>

                  <div className="hero-features">
                    <span>✓ Licensed &amp; Insured</span>
                    <span>✓ Professional Chauffeurs</span>
                    <span>✓ 24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="hero-bottom">
                <span>↓</span>
                <span>Discover the Experience</span>
              </div>
            </motion.div>
          </SwiperSlide>

          {/* Add more slides by changing only --hero-bg */}
        </Swiper>
      </div>

      <div>
        <EliteMembership />
      </div>

      {/* ABOUT SECTION  */}
      {/* <div className="about bg-[#0c0c0c] text-white lg:px-[10%] px-[8%] py-[70px] lg:py-[110px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          
          <div className="relative h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden">
            <img
              src="/images/charlot.jpeg"
              alt="Le Charlot Limousine Experience"
              className="w-full h-full object-cover scale-[1.03]"
            />
          
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

         
          <div>
            <p className="uppercase text-[16px] font-bold tracking-[0.35em] rolex-gold-text mb-5">
              Le Charlot Limousine
            </p>

            <h2 className="font-['4layfair_Dis4lay'] text-4xl md:text-4xl leading-tight font-semibold mb-6">
              Where Every Journey<br />
              Is Treated First-Class.
            </h2>

            <p className="text-white leading-relaxed mb-6 text-sm lg:text-base max-w-xl">
              At Le Charlot Limousine, we deliver more than transportation — we curate refined travel
              experiences defined by elegance, comfort,
              and impeccable attention to detail.
            </p>

            <p className="text-white leading-relaxed mb-10 text-sm lg:text-base max-w-xl">
              Proudly serving the <span className=' rolex-gold-text'>Atlanta and the surrounding Metropolitan Area</span>, our professional chauffeurs led
              by Pierre Charlot, combine discretion, warmth,
              and punctuality to ensure every ride feels effortless and distinguished.
            </p>

        
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <i className="ri-check-double-line rolex-gold-text"></i>
                <span className="text-sm tracking-wide text-white">
                  Service Delivered with Grace
                </span>
              </div>

              <div className="flex items-center gap-4">
                <i className="ri-check-double-line rolex-gold-text"></i>
                <span className="text-sm tracking-wide text-white">
                  Precision & On-Time Commitment
                </span>
              </div>
            </div>
          </div>

        </div>
      </div> */}
<section className="w-full bg-[#0B0B0B] py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Image Side */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <img
              src="/images/headmug.jpeg"
              alt="Founder - Pierre Charlot"
              className="w-full h-[500px] object-cover object-top"
            />
          </div>

          {/* subtle glow */}
          <div className="absolute -inset-4 bg-[#D4AF37]/10 blur-3xl rounded-3xl -z-10"></div>
        </div>

        {/* Text Side */}
        <div className="text-[#EDEDED] space-y-6">
          
          <div>
            <h2 className="text-3xl md:text-4xl font-[Playfair_Display] text-[#D4AF37]">
              About the Founder
            </h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-[#7a5a12] via-[#f2d27a] to-[#8a6316] mt-3"></div>
          </div>

          <p className="leading-relaxed text-[#CFC7B2]">
            Inspired by the timeless elegance, hospitality, and attention to detail associated
            with French culture, Pierre Charlot founded <span className="text-[#D4AF37] font-medium">Le Charlot Limousine</span> with a simple vision:
            to bring a higher standard of service to luxury transportation in Atlanta.
          </p>

          <p className="leading-relaxed text-[#CFC7B2]">
            Drawing inspiration from his French heritage, Pierre believes that true luxury is not defined solely by the vehicle,
            but by the experience. Professionalism, punctuality, discretion, Elegance, hospitality, Uncompromising service and genuine care are the principles that guide every journey
          </p>

          <p className="leading-relaxed text-[#CFC7B2]">
            Whether serving executives, families, airport travelers, or guests attending special events,
            Le Charlot Limousine is committed to delivering a seamless experience marked by comfort,
            reliability, and exceptional service.
          </p>

          <div className="pt-2">
            <p className="italic text-[#D4AF37]">
              “At Le Charlot Limousine, every detail matters—because excellence is never an accident; it is a standard.”
            </p>
          </div>

        </div>
      </div>
    </section>
      {/* ================= Banner Section ================= */}
      <div className="banner-section bg-[#0c0c0c] lg:px-[12%] px-[8%] py-[80px] lg:py-[120px] text-center text-white">

        <p className="uppercase text-[16px] font-bold tracking-[0.4em] rolex-gold-text mb-6">
          Reservations
        </p>

        <h2 className="font-['4layfair_Dis4lay'] text-4xl md:text-4xl leading-tight font-semibold mb-6">
          Reserve Your Chauffeured Experience
        </h2>

        <p className="text-white max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
          Whether booking in advance or arranging last-minute travel,
          our reservation process is designed to be seamless, discreet,
          and tailored to your needs.
        </p>

        <div className="mt-10 flex flex-col md:flex-col md:items-center md:justify-center gap-4">
          <div className="text-center mb-7 md:text-left">
            <p className="text-sm tracking-wide text-white"></p>
            <a href="tel:4044053738" className="text-xl md:text-xl font-medium text-white btn  transition-colors">
              <span className='text-md'>Immediate Assistance:</span>
              404-405-3738
            </a>
          </div>

          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-4 md:mt-4 inline-flex items-center justify-center gap-3 rounded-full border btn-gold px-10 py-4 text-xs tracking-widest uppercase  hover:text-black transition-all duration-300"
          >
            Begin Reservation
          </button>
        </div>

      </div>



      {/* ================= Safety & Features Section ================= */}
      <section className="bg-black text-white py-16 px-[8%] lg:px-[12%]">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-semibold mb-3 font-bricolage">
            Every Trip is designed with your Safety & Comfort in mind.
          </h3>
          <p className="text-white text-sm md:text-base">
            Experience premium comfort, style, and reliability wherever you go.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Car size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">Luxury Cars</p>
          </div>

          <div className="flex flex-col items-center">
            <Clock size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">24/7 Support</p>
          </div>

          <div className="flex flex-col items-center">
            <Zap size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">Instant Booking</p>
          </div>

          <div className="flex flex-col items-center">
            <Droplet size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">Sanitized</p>
          </div>

          <div className="flex flex-col items-center">
            <CreditCard size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">Flexible Payments</p>
          </div>

          <div className="flex flex-col items-center">
            <UserCheck size={32} className="rolex-gold-text mb-2" />
            <p className="font-medium">Professional Drivers</p>
          </div>
        </div>
      </section>


      {/* Car*/}
      <LandingFleetSection />
      <ChauffeurServices />
      {/* Brands */}
      {/* <div className="bg-[#222222] w-full lg:px-[12%] px-[8%] py-[50px]">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={6} // ✅ was "sliderPerView"
          spaceBetween={20} // ✅ use curly braces, not parentheses
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }} // ✅ autoplay needs an object
          className="brands-swiper flex justify-center items-center"
          breakpoints={{
            1399: {
              slidesPerView: 6, // ✅ spelling fixed
            },
            767: {
              slidesPerView: 4,
            },
            575: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 1,
            },
          }}
        >
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-01.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-02.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-08.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-10.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-11.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-14.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-15.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="brand-image h-[120px] w-full md:w-[120px] flex justify-center items-center">
              <img
                src="/images/brand-16.webp"
                alt="brand-image"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </SwiperSlide>

        </Swiper>

      </div> */}

      {/* Vision, Mission, Values Section */}
      <div className="our-service lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="our-service-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] rolex-gold-text mb-2">
            Our Philosophy
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            Our Mision & Values
          </h2>
        </div>

        <div className="our-service-wrapper">
          <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2">
            {/* Mission */}
            <div className="service-item relative text-white rounded-[20px] bg-[#222222] p-6 w-full">
              <h1 className="font-semibold text-3xl mb-3 font-bricolage">
                Our Mission
              </h1>
              <p className="text-white text-md leading-relaxed">
                Our mission is to deliver a world-class chauffeured experience marked by elegance, precision, and exceptional hospitality. We provide seamless, refined transportation for high-earning professionals who value discretion, comfort, and flawless service in every mile.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full btn btn-gold btn--hero flex items-center justify-center text-white text-lg font-bold shadow-md">
                  1
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="service-item relative text-white rounded-[20px] bg-[#222222] p-6 w-full">
              <h1 className="font-semibold text-3xl mb-3 font-bricolage">
                Our Values
              </h1>
              <p className="text-white text-md leading-relaxed">
                We operate with an uncompromising commitment to precision, discretion, and accountability.
Every detail is anticipated. Every standard is enforced. Every journey is executed with discipline and control.

We understand that our clients do not measure value in cost, but in time, reliability, and trust.
For that reason, we deliver a level of service defined by consistency, professionalism, and quiet excellence—without exception.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full btn btn-gold btn--hero flex items-center justify-center text-white text-lg font-bold shadow-md">
                  2
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>



      {/* Testimonials */}
      <section className='testimonials lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]'>
        <div className="testimonials-content mb-20 text-center text-white">
          <p className="uppercase text-3xl md:text-4xl tracking-[5px] rolex-gold-text mb-2">
            What Our Clients Say
          </p>
          <h2 className="text-sm font-bold mb-3 font-bricolage">
            Trusted by Atlanta Clients
          </h2>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            1399: { slidesPerView: 3 },
            991: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
        >
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Le Charlot Limousine is the gold standard. Discreet, punctual, and always immaculate — I trust them with every executive arrival.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/india.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Abhinav, Private Wealth Advisor</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                From the first call to the final drop-off, the experience was flawless. My clients were impressed — and so was I.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/japan.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Lee M., Event Planner</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Pierre&apos;s French accent and warm personality make every trip unforgettable. He dresses sharply, the vehicle is immaculate, and he even stocked the refreshments I asked for. Truly a five-star experience.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/blaq.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Olivia H., Atlanta</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                I&apos;ve never experienced such class in Georgia. Pierre monitors flights, offers wake-up calls, and even had a warm latte ready for me at pickup. His professionalism and bedside manner are unmatched.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/birace.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Daniella ,Alpharetta </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                We love the smooth ride, the music selection, and the elegance Pierre brings. He even let us choose the refreshments ahead of time. Hands down the best black-car service we&apos;ve ever used.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/ceo.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Raymond M., Buckhead </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl rolex-gold-text mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl rolex-gold-text"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Pierre&apos;s service is refined, respectful, and incredibly polished. His French accent, sharp attire, and kindness set the tone for a luxurious experience. Highly recommended.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl rolex-gold-text"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/nigeri.jpeg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl rolex-gold-text">Robert P., Midtown </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

      </section>

      {/* <div className="blog lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
     
        <div className="blog-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#d8c305c5] mb-2">
            - Our Blog
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            Latest <span className="font-bricolage text-[#d8c305c5]">News & Articles</span>
          </h2>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogdata.slice(0, 3).map((blog) => (
            <div
              key={blog.id}
              className="blog-item bg-[#1f1f22] group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              
              <div className="blog-image overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="group-hover:scale-110 transition-all duration-500 w-full h-[250px] object-cover"
                />
              </div>

              
              <div className="blog-content p-6">
                <div className="date bg-[#d8c305c5] w-fit px-4 py-1.5 text-sm text-white font-bricolage rounded-md mb-4">
                  {blog.date}
                </div>
                <h4 className="text-lg lg:text-2xl font-bricolage text-white font-semibold uppercase mb-3">
                  {blog.name}
                </h4>
                <p className="text-white text-sm leading-relaxed font-bricolage">
                  {blog.description?.slice(0, 120)}...
                </p>
                <button className="mt-4 text-[#d8c305c5] font-semibold font-bricolage hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div> */}

    </>

  );
}

export default Index;
