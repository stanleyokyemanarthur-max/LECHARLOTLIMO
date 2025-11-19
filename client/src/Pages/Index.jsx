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
      <div className='hero w-full h-screen overflow-hidden'>
        {loading && (<Spinner />)}
        <Swiper
          modules={[Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade" // ✅ fixed typo
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          speed={1500}
          className='hero-swiper w-full h-full'
        >
          {/* Slide 1 */}
          <SwiperSlide key="slide1">
            <motion.div
              className='hero-slide hero-slide1 w-full h-full flex items-center px-[12%]'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
            >
              <div className='hero-content text-white lg:w-[60%]'>
                <span className='font-bricolage text-xs sm:text-sm lg:text-md uppercase tracking-widest bg-[#B8860B] px-2 py-1 rounded-sm'>
                  Comfort & Class
                </span>
                <h1 className='font-bricolage text-3xl sm:text-5xl md:text-6xl xl:text-7xl xxl:text-8xl font-medium hero-title'>
                  Drive in Style, Arrive in Comfort
                </h1>
                <p className='my-2 text-lg lg:text-2xl font-bricolage hero-subtitle text-gray-300'>
                  Every mile with us is a promise of sophistication and peace of mind.
                </p>
                <p className='my-5 xl:my-7 lg:w-[60%] hero-pere text-gray-300'>
                  Whether it’s airport pickup or a red-carpet event, our chauffeurs ensure your arrival<br/>
                  feels as premium as the destination.
                </p>
                <div className='hero-btns flex flex-wrap gap-4 mt-5 lg:mt-8'>
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="make-reservation-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#B8860B] px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 "
                  >
                    <span className="relative z-10 font-bricolage tracking-wide uppercase">
                      Make Reservation&nbsp; <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide key="slide2">
            <motion.div
              className='hero-slide hero-slide2 w-full h-full flex items-center px-[12%]'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
            >
              <div className='hero-content text-white lg:w-[60%]'>
                <span className='font-bricolage text-xs sm:text-sm lg:text-md uppercase tracking-widest bg-[#B8860B] px-2 py-1 rounded-sm'>
                  Exclusive Luxury
                </span>
                <h1 className='font-bricolage text-3xl sm:text-5xl md:text-6xl xl:text-7xl xxl:text-8xl font-medium hero-title'>
                  Enjoy seamless journeys crafted with elegance, and class.
                </h1>
                <p className='my-2 text-lg lg:text-2xl font-bricolage hero-subtitle text-gray-300'>
                  Experience the perfect fusion of elegance and performance on every ride.
                </p>
                <p className='my-5 xl:my-7 lg:w-[60%] hero-pere text-gray-300'>
                  From business trips to special occasions, our premium cars redefine your journey<br/>
                  with unmatched class and comfort.
                </p>
                <div className='hero-btns flex flex-wrap gap-4 mt-5 lg:mt-8'>
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="make-reservation-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#B8860B] px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 "
                  >
                    <span className="relative z-10 font-bricolage tracking-wide uppercase">
                      Make Reservation&nbsp; <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide key="slide3">
            <motion.div
              className='hero-slide hero-slide3 w-full h-full flex items-center px-[12%]'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
            >
              <div className='hero-content text-white lg:w-[60%]'>
                <span className='font-bricolage text-xs sm:text-sm lg:text-md uppercase tracking-widest bg-[#B8860B] px-2 py-1 rounded-sm'>
                  Elite Service
                </span>

                <h1 className='font-bricolage text-3xl sm:text-5xl md:text-6xl xl:text-7xl xxl:text-8xl font-medium hero-title'>
                  Luxury Rides for Every Occasion
                </h1>

                <p className='my-2 text-lg lg:text-2xl font-bricolage hero-subtitle text-gray-300'>
                  Choose from our collection of premium, chauffeur-driven vehicles.
                </p>

                <p className='my-5 xl:my-7 lg:w-[60%] hero-pere text-gray-300'>
                  Le Charlot Limousine delivers elegance, comfort, and reliability.<br/>
                  Enjoy a seamless travel experience designed to match your style and needs.
                </p>

                <div className='hero-btns flex flex-wrap gap-4 mt-5 lg:mt-8'>
                  <button
                    onClick={() => navigate("/reservation-form")}
                    className="make-reservation-btn group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#B8860B] px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 "
                  >
                    <span className="relative z-10 font-bricolage tracking-wide uppercase">
                      Make Reservation&nbsp; <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </button>
                </div>
              </div>

            </motion.div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ABOUT SECTION  */}
      <div className="about text-white lg:px-[10%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-auto sm:h-[450px] lg:h-[600px]">
            <img
              src="/images/airport.jpeg"   // ✅ Replace with your actual image
              alt="About us"
              className="rounded-3xl w-full h-full object-contain md:object-cover"
            />
           
          </div>
          <div>
            <p className="uppercase text-xs md:text-sm tracking-widest text-[#B8860B] mb-2">
              LE CHARLOT LIMOUSINE
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-bricolage">
              Luxury is more than a vehicle it’s the way you’re treated.
            </h2>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              At Le Charlot Limousine, our mission is to deliver more than transportation —
              we craft unforgettable journeys defined by elegance, comfort, and personalized care.
            </p>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              Led by Pierre Charlot, our team of professional chauffeurs combines top-tier
              service with warmth and discretion, ensuring every ride feels like first class.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-[#B8860B]">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">Service with a Smile</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex
                   items-center justify-center text-[#B8860B]">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">On-Time Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= Banner Section ================= */}
      <div className="banner-section lg:px-[12%] px-[8%] py-[60px] lg:py-[100px] text-center text-white">
        <p className="uppercase text-sm tracking-[5px] text-[#B8860B] mb-2">
          Reserve Now
        </p>

        <h2 className="text-4xl md:text-5xl text-[#B8860B] font-bold mb-4 font-bricolage">
          We Offer Flexible & Quick Booking Methods
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-6">
          We value the time and quality of travel for each of our clients. Explore our luxury cars
          and book a ride for the ultimate experience.
        </p>

        <div className="mt-6">
          <p className="text-lg md:text-xl font-semibold text-[#B8860B] mb-2">
            For Instant Booking: <span className="text-white">(404) 405-3738</span>
          </p>
          <p className="text-gray-300 mb-6">
            For complete reservation please click below
          </p>

          <button onClick={() => navigate("/reservation-form")} className="bg-[#B8860B] text-black font-semibold py-3 px-8 rounded-full transition duration-300">
             Reservation
          </button>
        </div>
      </div>


      {/* ================= Safety & Features Section ================= */}
      <section className="bg-black text-white py-16 px-[8%] lg:px-[12%]">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-semibold mb-3 font-bricolage">
            We Make Sure Your Every Trip is Safe & Special
          </h3>
          <p className="text-gray-400 text-sm md:text-base">
            Experience premium comfort, style, and reliability wherever you go.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">🚘</p>
            <p className="font-medium">Luxury Cars</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">🕐</p>
            <p className="font-medium">24/7 Support</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">⚡</p>
            <p className="font-medium">Instant Booking</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">🧼</p>
            <p className="font-medium">Sanitized</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">💳</p>
            <p className="font-medium">Flexible Payments</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-medium text-lg mb-1 text-[#B8860B]">👔</p>
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
          <p className="uppercase text-sm tracking-[5px] text-[#B8860B] mb-2">
            Our Philosophy
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            Our Vision & Mission
          </h2>
        </div>

        <div className="our-service-wrapper">
          <div className="grid w-full gap-12 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

            {/* Vision */}
            <div className="service-item relative text-white rounded-[20px] bg-[#222222] p-6 w-full">
              <h5 className="font-semibold text-3xl mb-3 font-bricolage">
                Our Vision
              </h5>
              <p className="text-[#999] text-md leading-relaxed">
                To redefine luxury transportation by providing safe, seamless, and exceptional experiences that exceed expectations for every journey.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-[#B8860B] flex items-center justify-center text-white text-lg font-bold shadow-md">
                  1
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="service-item relative text-white rounded-[20px] bg-[#222222] p-6 w-full">
              <h5 className="font-semibold text-3xl mb-3 font-bricolage">
                Our Mission
              </h5>
              <p className="text-[#999] text-md leading-relaxed">
                To deliver premium transportation services with professionalism, reliability, and comfort, ensuring that every client feels valued and cared for.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-[#B8860B] flex items-center justify-center text-white text-lg font-bold shadow-md">
                  2
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="service-item relative text-white rounded-[20px] bg-[#222222] p-6 w-full">
              <h5 className="font-semibold text-3xl mb-3 font-bricolage">
                Our Values
              </h5>
              <p className="text-[#999] text-md leading-relaxed">
                Integrity, excellence, and customer focus guide everything we do. We aim to create memorable journeys built on trust, safety, and attention to detail.
              </p>
              <div className="curv absolute left-0 bottom-0">
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-[#B8860B] flex items-center justify-center text-white text-lg font-bold shadow-md">
                  3
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>




      {/* Testimonials */}
      <section className='testimonials lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]'>
        <div className="testimonials-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-[#B8860B] mb-2">
            Testimonials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 font-bricolage">
            Trusted by Thousands
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
                <span className="text-4xl text-white mr-4 fa-solid fa-quote-left"></span>
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className="text-white text-xl fa-solid fa-star"></span>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="text-white text-lg mb-6 font-bricolage">
                I visited Miami for vacation and the chauffeur service made it unforgettable. Great music, comfort, and vibes all the way.
              </div>

              {/* User Info */}
              <div className="flex items-center mt-6">
                <div className="curv">
                  <div className="">
                    <img src='/images/ian.jpg' alt="user" className="rounded-full h-16 w-16  object-cover mr-4 " />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#B8860B]">Tyler R</p>
                  <p className="text-[#999] text-sm font-bricolage">Traveler, Miami FL</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                {/* Opening Quote */}
                <i className="fa-solid fa-quote-left text-4xl text-[#B8860B] mr-4"></i>

                {/* Stars */}
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <i key={i} className="fa-solid fa-star text-xl text-[#B8860B]"></i>
                  ))}
                </div>
              </div>

              {/* Review Text with Closing Quote */}
              <div className="text-white text-lg mb-6 font-bricolage italic relative">
                Booking online was super easy, and the car was in perfect condition when we arrived. I’ll definitely book again!
                <i className="fa-solid fa-quote-right absolute -bottom-4 right-2 text-3xl text-[#B8860B]"></i>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-10">
                <div className="curv">
                  <div>
                    <img
                      src="/images/set (2).jpg"
                      alt="user"
                      className="rounded-full h-16 w-16 object-cover mr-4"
                    />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#B8860B]">Mr Raymond Mendes</p>
                  <p className="text-[#999] text-sm font-bricolage">Leisure Traveler</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">
              {/* Quote + Stars */}
              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl text-white mr-4 fa-solid fa-quote-left"></span>
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className="text-white text-xl fa-solid fa-star"></span>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="text-white text-lg mb-6 font-bricolage">
                We hired their limo for our wedding day absolutely flawless experience.
                The car looked stunning and the chauffeur went above and beyond.
              </div>

              {/* User Info */}
              <div className="flex items-center mt-6">
                <div className="curv">
                  <div className="">
                    <img src='/images/math.jpg' alt="user" className="rounded-full h-16 w-16 mr-4" />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#B8860B]">Sophia </p>
                  <p className="text-[#999] text-sm font-bricolage">Bride, Chicago IL</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="rounded-[38px] bg-[#222] text-left p-8 shadow-md flex flex-col justify-between">

              <div className="flex items-start justify-between mb-6">
                <span className="text-4xl text-white mr-4 fa-solid fa-quote-left"></span>
                <div className="flex space-x-1">
                  {Array(5).fill().map((_, i) => (
                    <span key={i} className="text-white text-xl fa-solid fa-star"></span>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="text-white text-lg mb-6 font-bricolage">
                We booked a limo for our anniversary and it was perfect! The driver was professional and the ride felt truly luxurious.
              </div>

              {/* User Info */}
              <div className="flex items-center mt-6">
                <div className="curv">
                  <div className="">
                    <img src='/images/har.jpg' alt="user" className="rounded-full h-16 w-16 mr-4" />
                  </div>
                </div>
                <div className="ps-[100px]">
                  <p className="font-bricolage text-xl text-[#B8860B]">Michael & Renee T</p>
                  <p className="text-[#999] text-sm font-bricolage">Los Angeles, CA</p>
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
                <p className="text-gray-400 text-sm leading-relaxed font-bricolage">
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
