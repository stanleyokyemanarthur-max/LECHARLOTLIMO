import React from "react";
import { motion } from "framer-motion";
import { Crown, Gift, Coffee, Music, Plane, Clock, Star } from "lucide-react";
import { useSelector } from "react-redux";

export default function EliteMembership() {
    const { userInfo } = useSelector((state) => state.auth);

    const features = [
        { icon: <Gift size={26} />, text: "Free birthday ride every year" },
        { icon: <Star size={26} />, text: "Free ride after every 10 bookings" },
        { icon: <Music size={26} />, text: "Saved music & drink preferences" },
        { icon: <Coffee size={26} />, text: "Warm coffee for early flights" },
        { icon: <Plane size={26} />, text: "Real-time flight monitoring" },
        { icon: <Clock size={26} />, text: "Complimentary wake-up call" },
    ];

    return (
        <section
            className="relative py-28 px-6 text-white"
            style={{
                backgroundImage: `url('/images/elite.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Premium overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

            <div className="relative max-w-5xl mx-auto text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12"
                >
                    <Crown size={65} className="mx-auto mb-4 text-[#B8860B]" />

                    {/* Bilingual Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-[#B8860B] tracking-wide">
                        Le Charlot Elite Membership
                    </h2>
                    <h3 className="text-xl md:text-2xl text-gray-300 italic mt-1">
                        L’adhésion Élité Le Charlot
                    </h3>

                    {/* Market Leadership Subtitle */}
                    <p className="text-gray-200 mt-4 text-lg max-w-2xl mx-auto">
                        Georgia’s #1 Luxury Chauffeur Experience
                        <br />
                        La première expérience de chauffeur de luxe en Géorgie
                    </p>
                </motion.div>


                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-6 mt-12">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.12,
                                ease: "easeOut",
                            }}
                            className="flex items-center gap-4 bg-black/40 border border-[#B8860B]/30 rounded-xl p-4 
                                       shadow-md hover:bg-black/50 backdrop-blur-sm transition"
                        >
                            <div className="text-[#B8860B]">{item.icon}</div>
                            <p className="text-gray-200">{item.text}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Buttons */}
                {userInfo ? (
                    <button
                        className="mt-20 bg-gray-700 text-gray-300 cursor-default px-8 py-3 rounded-xl border border-gray-600"
                        disabled
                    >
                        You’re Already a Member
                    </button>
                ) : (
                    <button
                        onClick={() => (window.location.href = "/signup")}
                        className="mt-20 bg-[#B8860B] text-black font-semibold px-8 py-3 rounded-xl shadow-lg 
                                   hover:bg-[#d4a019] transition-all"
                    >
                        Join the Elite Membership
                    </button>
                )}
            </div>
        </section>
    );
}
