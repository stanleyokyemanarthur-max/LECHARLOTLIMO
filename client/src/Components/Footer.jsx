import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Edit, CalendarCheck } from "lucide-react";

function Footer() {
  return (
    <>
      <footer className="text-white lg:px-[12%] px-[8%] pt-16 flex justify-center items-center bg-[#111]">
        <div className="border-b border-[#222] pb-8 w-full text-white px-4 md:px-8">
          <div className="flex flex-col md:flex-row space-x-10 space-y-10 md:space-y-0">

            {/* Logo + About */}
            <div className="flex-1">
              <Link to="/" className="text-4xl flex font-bold logo font-bricolage">
                LeCharlot<span className="text-[#B8860B]">Limousine</span>
              </Link>
              <p className="text-[#999] mt-2 md:w-[90%] w-full">
               Book a luxury ride with ease. Experience comfort, class, and premium service for your events, airport transfers, and special occasions.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="border border-[#B8860B] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
                >
                  <i className="ri-instagram-line"></i>
                </a>
                <a
                  href="#"
                  className="border border-[#B8860B] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
                >
                  <i className="ri-twitter-x-fill"></i>
                </a>
                <a
                  href="#"
                  className="border border-[#B8860B] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
                >
                  <i className="ri-facebook-fill"></i>
                </a>
              </div>
            </div>

            {/* Extra columns (links, contact, etc.) */}
            {/* You can add more <div className="flex-1"> sections here for navigation or contact info */}
            <div className="flex-1">
              <h4 className="text-2xl font-semibold mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-[#999] footer-menu relative">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#B8860B] relative transition duration-300 font-bricolage"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-[#B8860B] elative transition duration-300 font-bricolage"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#B8860B] relative transition duration-300 font-bricolage"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fleet"
                    className="hover:text-[#B8860B] relative transition duration-300 font-bricolage"
                  >
                    Fleet
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-4 text-[#B8860B]">
                  Contact Us
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 text-gray-300 px-4 py-2 rounded-lg"
                  >
                    <Phone size={20} className="text-[#B8860B]" />
                    (404) 900-9088
                  </a>

                  <a
                    href="mailto:contact@lecharlot.com"
                    className="flex items-center gap-3 text-gray-300 px-4 py-2 rounded-lg"
                  >
                    <Mail size={20} className="text-[#B8860B]" />
                    info@LeCharlotLimousine.com
                  </a>

                  <a
                    href="/contact"
                    className="flex items-center gap-3 text-gray-300 px-4 py-2 rounded-lg "
                  >
                    <Edit size={20} className="text-[#B8860B]" />
                    Contact Form
                  </a>

                  <Link
                    to="/reservation-form"
                    className="mt-4 inline-flex items-center justify-center gap-2 bg-[#B8860B] text-black font-semibold px-6 py-3  hover:bg-[#d4a019] transition-all"
                  >
                    <CalendarCheck size={20} />
                    Schedule a Ride
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#999] text-center text-base relative py-6">
            <p className="font-bricolage">
              © 2025. All Rights Reserved.{" "}
              <a href="#" className="text-white font-bricolage">
                Le Charlot<span className="text-[#B8860B]">Limousine</span>
              </a>
            </p>
          </div>
        </div>

      </footer>
    </>

  )
}

export default Footer
