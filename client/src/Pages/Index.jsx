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
      {/* HERO SECTION */}
      <div className="hero w-full h-screen overflow-hidden pt-[env(safe-area-inset-top)] mt-24 md:mt-12 xl:mt-8">
        {loading && <Spinner />}

        <Swiper
          modules={[Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          loop
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          speed={1800}
          className="hero-swiper w-full h-full"
        >
          {/* ================= SLIDE 1 ================= */}
          <SwiperSlide>
            <motion.div
              className="hero-slide hero-slide1 w-full h-full flex items-center px-[10%]"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              <div className="max-w-3xl text-white">
                <span className="block mb-6 text-[13px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">
                  ATL Airport • Corporate • Events
                </span>

                <h1 className="font-['Playfair_Display'] text-2xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight font-semibold mb-6">
                  Executive Chauffeur Service, <br />Redefined
                </h1>

                <p className="text-lg lg:text-xl text-white leading-relaxed max-w-xl mb-10">
                  From airport arrivals to boardroom entrances, Le Charlot Limousine delivers precision, privacy, and prestige — every mile, every moment.
                </p>

                <div className="flex gap-4 flex-wrap">
                  {/* Primary Button */}
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm uppercase tracking-widest bg-[#D4AF37] text-black hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                  >
                    Reserve Your Ride
                    <i className="bi bi-arrow-up-right transition-transform duration-300 group-hover:translate-x-1"></i>
                  </button>

                  {/* Secondary Button */}
                  <button
                    onClick={() => navigate("/fleet")}
                    className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm uppercase tracking-widest border-2 border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                  >
                    View Our Fleet
                    <i className="bi bi-arrow-up-right transition-transform duration-300 group-hover:translate-x-1"></i>
                  </button>
                </div>

              </div>
            </motion.div>
          </SwiperSlide>

          {/* ================= SLIDE 2 ================= */}
          <SwiperSlide>
            <motion.div
              className="hero-slide hero-slide2 w-full h-full flex items-center px-[10%]"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              <div className="max-w-3xl text-white">
                <span className="block mb-6 text-[13px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">
                  Comfort · Class · Precision
                </span>

                <h1 className="font-['Playfair_Display'] text-4xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight font-semibold mb-6">
                  Drive in Style. <br />Arrive Distinguished
                </h1>

                <p className="text-lg lg:text-xl text-white leading-relaxed max-w-xl mb-10">
                  Chauffeur-driven luxury crafted for those who value discretion, comfort, and impeccable service.
                </p>

                <div className="flex gap-4 flex-wrap">
                  {/* Primary Button */}
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm uppercase tracking-widest bg-[#D4AF37] text-black hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                  >
                    Book with Confidence
                    <i className="bi bi-arrow-up-right transition-transform duration-300 group-hover:translate-x-1"></i>
                  </button>
                </div>

              </div>
            </motion.div>
          </SwiperSlide>

          {/* ================= SLIDE 3 ================= */}
          <SwiperSlide>
            <motion.div
              className="hero-slide hero-slide3 w-full h-full flex items-center px-[10%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            >
              <div className="max-w-3xl text-white">
                <span className="block mb-6 text-[13px] font-bold tracking-[0.4em] uppercase text-[#D4AF37]">
                Licensed · Insured · Professional chauffeurs 
                </span>

                <h1 className="font-['Playfair_Display'] text-4xl sm:text-2xl lg:text-3xl xl:text-5xl leading-tight font-semibold mb-6">
                  A Seamless Journey, <br />Defined by Excellence
                </h1>

                <p className="text-lg lg:text-xl text-white leading-relaxed max-w-xl mb-10">
                  From airport transfers to corporate engagements, every detail is curated to exceed expectations.
                </p>

                <div className="flex gap-4 flex-wrap">
                  {/* Primary Button */}
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="group inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm uppercase tracking-widest bg-[#D4AF37] text-black hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                  >
                    Book Executive Travel
                    <i className="bi bi-arrow-up-right transition-transform duration-300 group-hover:translate-x-1"></i>
                  </button>

                </div>

              </div>
            </motion.div>
          </SwiperSlide>
        </Swiper>
      </div>



      <div>
        <EliteMembership />
      </div>

      {/* ABOUT SECTION  */}
      <div className="about bg-[#0c0c0c] text-white lg:px-[10%] px-[8%] py-[70px] lg:py-[110px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}
          <div className="relative h-[420px] sm:h-[500px] lg:h-[620px] rounded-3xl overflow-hidden">
            <img
              src="/images/airport.jpeg"
              alt="Le Charlot Limousine Experience"
              className="w-full h-full object-cover scale-[1.03]"
            />
            {/* soft overlay */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* CONTENT */}
          <div>
            <p className="uppercase text-[13px] font-bold tracking-[0.35em] text-[#D4AF37] mb-5">
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
              Proudly serving the <span className=' text-[#D4AF37]'>Atlanta Metropolitan Area</span>, our professional chauffeurs led
              by Pierre Charlot, combine discretion, warmth, 
              and punctuality to ensure every ride feels effortless and distinguished.
            </p>

            {/* VALUES */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <i className="ri-check-double-line text-[#D4AF37]"></i>
                <span className="text-sm tracking-wide text-white">
                  Service Delivered with Grace
                </span>
              </div>

              <div className="flex items-center gap-4">
                <i className="ri-check-double-line text-[#D4AF37]"></i>
                <span className="text-sm tracking-wide text-white">
                  Precision & On-Time Commitment
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= Banner Section ================= */}
      <div className="banner-section bg-[#0c0c0c] lg:px-[12%] px-[8%] py-[80px] lg:py-[120px] text-center text-white">

        <p className="uppercase text-[13px] font-bold tracking-[0.4em] text-[#D4AF37] mb-6">
          Reservations
        </p>

        <h2 className="font-['4layfair_Dis4lay'] text-4xl md:text-4xl leading-tight font-semibold mb-6">
          Reserve Your Chauffeur Experience
        </h2>

        <p className="text-white max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-10">
          Whether booking in advance or arranging last-minute travel,
          our reservation process is designed to be seamless, discreet,
          and tailored to your needs.
        </p>

        <div className="mt-10 flex flex-col md:flex-col md:items-center md:justify-center gap-4">
          <div className="text-center mb-7 md:text-left">
            <p className="text-sm tracking-wide text-white">Immediate Assistance</p>
            <a href="tel:4044053738" className="text-xl md:text-2xl font-medium text-white hover:text-[#D4AF37] transition-colors">
              (404) 405-3738
            </a>
          </div>

          <button
            onClick={() => navigate("/reservation-form")}
            className="mt-4 md:mt-4 inline-flex items-center justify-center gap-3 rounded-full border border-[#D4AF37] px-10 py-4 text-xs tracking-widest uppercase text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            Begin Reservation
          </button>
        </div>

      </div>



      {/* ================= Safety & Features Section ================= */}
      <section className="bg-black text-white py-16 px-[8%] lg:px-[12%]">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-semibold mb-3 font-bricolage">
            We Make Sure Your Every Trip is Safe & Special
          </h3>
          <p className="text-white text-sm md:text-base">
            Experience premium comfort, style, and reliability wherever you go.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Car size={32} className="text-[#D4AF37] mb-2" />
            <p className="font-medium">Luxury Cars</p>
          </div>

          <div className="flex flex-col items-center">
            <Clock size={32} className="text-[#D4AF37] mb-2" />
            <p className="font-medium">24/7 Support</p>
          </div>

          <div className="flex flex-col items-center">
            <Zap size={32} className="text-[#D4AF37] mb-2" />
            <p className="font-medium">Instant Booking</p>
          </div>

          <div className="flex flex-col items-center">
            <Droplet size={32} className="text-[#D4AF37] mb-2" />
            <p className="font-medium">Sanitized</p>
          </div>

          <div className="flex flex-col items-center">
            <CreditCard size={32} className="text-[#D4AF37] mb-2" />
            <p className="font-medium">Flexible Payments</p>
          </div>

          <div className="flex flex-col items-center">
            <UserCheck size={32} className="text-[#D4AF37] mb-2" />
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
          <p className="uppercase text-sm tracking-[5px] text-[#D4AF37] mb-2">
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
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-lg font-bold shadow-md">
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
                Our vision is to become Georgia’s most distinguished luxury transportation brand—recognized for our impeccable presentation, elite chauffeurs, and unforgettable client care. We aim to elevate every journey into a personalized, first-class experience.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-lg font-bold shadow-md">
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
          <p className="uppercase text-3xl md:text-4xl tracking-[5px] text-[#D4AF37] mb-2">
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
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Le Charlot Limousine is the gold standard. Discreet, punctual, and always immaculate — I trust them with every executive arrival.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">James R., Private Wealth Advisor</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                From the first call to the final drop-off, the experience was flawless. My clients were impressed — and so was I.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">Danielle M., Event Planner</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Pierre&apos;s French accent and warm personality make every trip unforgettable. He dresses sharply, the vehicle is immaculate, and he even stocked the refreshments I asked for. Truly a five-star experience.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">Olivia H., Atlanta</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                I&apos;ve never experienced such class in Georgia. Pierre monitors flights, offers wake-up calls, and even had a warm latte ready for me at pickup. His professionalism and bedside manner are unmatched.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">Raymond M., Buckhead</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                We love the smooth ride, the music selection, and the elegance Pierre brings. He even let us choose the refreshments ahead of time. Hands down the best black-car service we&apos;ve ever used.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">Daniella &amp; Marcus,Alpharetta </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#D4AF37] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#D4AF37]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Pierre&apos;s service is refined, respectful, and incredibly polished. His French accent, sharp attire, and kindness set the tone for a luxurious experience. Highly recommended.
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#D4AF37]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src=""
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#D4AF37]">Jasmine P., Midtown </p>
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
