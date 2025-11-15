import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <>
      {/* Banner */}
      <div className="banner-section flex justify-center items-center h-[358px] lg:h-[550px]">
        <div className="banner-section-content text-center z-10">
          <h6 className="uppercase text-sm lg:text-xl text-white font-bricolage">
            Le.Charlot<span className="text-yellow-600">Limousine</span>
          </h6>
          <h1 className="text-4xl lg:text-5xl xl:text-8xl font-semibold font-bricolage text-yellow-600">
            <span className="text-white font-bricolage">About</span> Us
          </h1>
        </div>
      </div>

      {/* About Section */}
      <div className="about text-white lg:px-[10%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-auto sm:h-[450px] lg:h-[600px]">
            <img
              src="/images/3ec.jpg"
              alt="Luxury vehicles from Le Charlot Limousine"
              className="rounded-3xl w-full h-full object-contain md:object-cover"
            />
          </div>
          <div>
            <p className="uppercase text-xs md:text-sm tracking-widest text-yellow-600 mb-2">
              - LE.CHARLOT LIMOUSINE
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-bricolage">
              We Are More Than <br />
              <span className="text-yellow-600 font-bricolage">
                A Car Rental Company
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              At Le Charlot Limousine, we don’t just move people — we move moments.
              Our services are crafted for clients who appreciate refinement,
              reliability, and the quiet power of exceptional service. From airport
              transfers to private events, we make luxury transportation effortless.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-[#d8c305c5]">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">Exclusive Fleet of Luxury & Executive Cars</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-yellow-600">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">Professional Chauffeurs with Years of Experience</span>
              </div>
            </div>
            <button onClick={() => navigate("/reservation-form")} className="bg-yellow-600 hover:bg-black text-white px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-colors duration-300">
              Make Reservation <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="banner lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="banner-content text-center">
          <p className="uppercase text-sm tracking-[5px] text-white mb-2">
          
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white font-bricolage">
            Book Your Luxury Ride <br />
          </h2>
        </div>
      </div>

      {/* About Section 2 */}
      <div className="about text-white lg:px-[10%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative w-auto sm:h-[450px] lg:h-[600px]">
            <img
              src="/images/airport.jpeg"
              alt="Chauffeur service at the airport"
              className="rounded-3xl w-full h-full object-contain md:object-cover"
            />
          </div>
          <div>
            <p className="uppercase text-xs md:text-sm tracking-widest text-yellow-600 mb-2">
              - LE.CHARLOT LIMOUSINE
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-bricolage">
              Luxury is more than a vehicle <br />
              <span className="text-yellow-600 font-bricolage">
                it’s the way you’re treated
              </span>
            </h2>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              Every guest is a VIP at Le Charlot. From the first call to the final drop-off,
              we focus on providing warmth, punctuality, and absolute comfort. Our chauffeurs
              are trained to anticipate your needs — whether that’s a quiet ride, a scenic
              route, or timely airport arrival.
            </p>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              Founded by Pierre Charlot, our company embodies a vision of excellence and
              sophistication, ensuring that every ride reflects the prestige and comfort
              our clients deserve.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-yellow-600">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">Service with a Personal Touch</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-yellow-600">
                  <i className="ri-check-double-line"></i>
                </div>
                <span className="text-white">Guaranteed On-Time Arrivals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW SECTION - Why Choose Us */}
      <div className="about text-white lg:px-[10%] px-[8%] py-[50px] lg:py-[90px] bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div>
            <p className="uppercase text-xs md:text-sm tracking-widest text-yellow-600 mb-2">
              - WHY CHOOSE US
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 font-bricolage">
              Driven by <br />
              <span className="text-yellow-600 font-bricolage">Excellence & Elegance</span>
            </h2>
            <p className="text-gray-400 leading-relaxed my-6 text-sm lg:text-base">
              Choosing Le Charlot Limousine means choosing an experience that blends luxury
              with precision. We operate with a simple promise — your comfort, safety,
              and time are our top priorities. Whether you’re traveling for business,
              leisure, or a special celebration, we tailor every detail to meet your expectations.
            </p>
            <ul className="space-y-3 text-sm lg:text-base">
              <li className="flex items-center gap-3">
                <i className="ri-star-fill text-yellow-600"></i> Professionally Trained Chauffeurs
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-star-fill text-yellow-600"></i> 24/7 Availability for Global Travel
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-star-fill text-yellow-600"></i> Fleet of Luxury Sedans, SUVs & Sprinters
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-star-fill text-yellow-600"></i> Personalized VIP & Corporate Services
              </li>
            </ul>
          </div>

          {/* Image Section */}
          <div className="relative w-auto sm:h-[450px] lg:h-[550px]">
            <img
              src="/images/Experience.jpg"
              alt="Professional chauffeur standing beside a luxury car"
              className="rounded-3xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Vision, Mission, Values Section */}
      <div className="our-service lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
        <div className="our-service-content mb-20 text-center text-white">
          <p className="uppercase text-sm tracking-[5px] text-yellow-600 mb-2">
            - Our Philosophy
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
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
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
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
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
                <div className="service-item-curv section-item-curv w-6 h-6 rounded-full bg-yellow-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  3
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default About;
