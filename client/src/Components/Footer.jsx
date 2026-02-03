import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, Edit, CalendarCheck } from "lucide-react";

function Footer() {
  return (
    <>
     <footer className="bg-[#0c0c0c] text-white px-[8%] lg:px-[12%] pt-24">
  <div className="max-w-7xl mx-auto">

    {/* Top section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-14 pb-16 border-b border-white/10">

      {/* BRAND */}
      <div>
        <div className="relative h-14 w-60 mb-6">
          <img
            src="/images/lecharlotgold.png"
            alt="Le Charlot Logo"
            className="absolute -top-10 left-0 w-60 h-auto object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <p className="text-sm leading-relaxed text-white/60 max-w-sm">
          Chauffeur-driven luxury designed for discerning clients.
          Airport transfers, executive travel, and special occasions —
          delivered with precision and discretion.
        </p>

        {/* Social */}
        <div className="flex gap-4 mt-8">
          {["instagram-line", "twitter-x-fill", "facebook-fill"].map((icon, i) => (
            <a
              key={i}
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#B08D57] transition-all duration-300"
            >
              <i className={`ri-${icon}`}></i>
            </a>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h4 className="text-sm tracking-[0.3em] uppercase text-[#B08D57] mb-8">
          Contact
        </h4>

        <div className="space-y-4 text-sm text-white/70">
          <a href="tel:+14049009088" className="flex items-center gap-3 hover:text-white transition">
            <Phone size={18} className="text-[#B08D57]" />
            (404) 405-3738
          </a>

          <a href="mailto:info@LeCharlotLimousine.com" className="flex items-center gap-3 hover:text-white transition">
            <Mail size={18} className="text-[#B08D57]" />
            info@LeCharlotLimousine.com
          </a>

          <Link to="/contact" className="flex items-center gap-3 hover:text-white transition">
            <Edit size={18} className="text-[#B08D57]" />
            Contact Form
          </Link>
        </div>

        <Link
          to="/reservation-form"
          className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-full border border-[#D4AF37] text-[#B08D57] text-xs tracking-widest uppercase hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
        >
          <CalendarCheck size={18} />
          Schedule a Ride
        </Link>
      </div>

      {/* LINKS */}
      <div>
        <h4 className="text-sm tracking-[0.3em] uppercase text-[#B08D57] mb-8">
          Quick Links
        </h4>

        <ul className="space-y-3 text-sm text-white/60">
          {["About", "Services", "Fleet", "Contact"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase()}`}
                className="hover:text-[#B08D57] transition"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* Bottom */}
    <div className="py-8 text-center text-xs text-white/40 tracking-wide">
  © {new Date().getFullYear()} Le Charlot{" "}
  <span className="text-[#B08D57]">Limousine</span>. All rights reserved.
</div>


  </div>
</footer>

    </>

  )
}

export default Footer
