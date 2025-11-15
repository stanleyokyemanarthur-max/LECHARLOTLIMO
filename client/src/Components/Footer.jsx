import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
      <footer className="text-white lg:px-[12%] px-[8%] pt-16 flex justify-center items-center bg-[#111]">
        <div className="border-b border-[#222] pb-8 w-full text-white px-4 md:px-8">
          <div className="flex flex-col md:flex-row space-x-10 space-y-10 md:space-y-0">

            {/* Logo + About */}
            <div className="flex-1">
              <Link to="/" className="text-4xl font-bold logo font-bricolage">
                Le.Charlot<span className="text-[#d8c305c5]">Limousine</span>
              </Link>
              <p className="text-[#999] mt-2 md:w-[90%] w-full">
                Rent a car imperdiet sapien porttitor bibendum elementum. Commodo erat
                nesuen facilisis mauris.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="border border-[#d8c305c5] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
                >
                  <i className="ri-instagram-line"></i>
                </a>
                <a
                  href="#"
                  className="border border-[#d8c305c5] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
                >
                  <i className="ri-twitter-x-fill"></i>
                </a>
                <a
                  href="#"
                  className="border border-[#d8c305c5] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#d8c305c5] hover:text-black transition-colors"
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
                    className="hover:text-[#d8c305c5] relative transition duration-300 font-bricolage"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-[#d8c305c5] elative transition duration-300 font-bricolage"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Cars"
                    className="hover:text-[#d8c305c5] relative transition duration-300 font-bricolage"
                  >
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Blog"
                    className="hover:text-[#d8c305c5] relative transition duration-300 font-bricolage"
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex-1">

              <div className="flex-1">
                <h4 className="text-2xl font-semibold mb-4">Contact Us</h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-2 text-[#999] px-3 py-2 rounded-lg "
                  >
                    📞 +1 234 567 890
                  </a>

                  <a
                    href="mailto:contact@lecharlot.com"
                    className="flex items-center gap-2 text-[#999] px-3 py-2 rounded-lg   "
                  >
                    ✉ contact@lecharlot.com
                  </a>

                  <a
                    href="/contact"
                    className="flex items-center gap-2 text-[#999] px-3 py-2 rounded-lg   "
                  >
                    📝 Contact Form
                  </a>

                  {/* Optional CTA Button */}
                  <Link
                    to="/reservation-form"
                    className="mt-4 inline-flex items-center justify-center bg-[#d8c305c5]  text-black font-semibold px-6 py-3 rounded-full  duration-300 shadow-lg"
                  >
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
                Le.Charlot<span className="text-[#d8c305c5]">Limousine</span>
              </a>
            </p>
          </div>
        </div>

      </footer>
    </>

  )
}

export default Footer