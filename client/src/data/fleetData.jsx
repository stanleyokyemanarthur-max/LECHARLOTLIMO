import React from "react";
import { useNavigate } from "react-router-dom";


const fleetData = [
  {
    id: 1,
    slug: "luxury-sedan",
    name: "Luxury Sedan",
    category: "1-4 Passenger",
    mainImage: "/images/-Cadillac.png",
    gallery: [
      "/images/esca-int1.jpg",
      "/images/esca-int.jpg",
      "/images/escaPM.png",
    ],
    description:
      "Our Luxury Sedan offers refined comfort for business and leisure travelers. It’s equipped with premium leather seats, ambient lighting, and a whisper-quiet cabin for a truly relaxing ride.",
    capacity: "1-4 passengers",
    luggage: "2-3 medium sized bags",
    features: [
      "Luxurious leather seating",
      "Rear climate control",
      "Tinted privacy windows",
      "Complimentary bottled water",
      "Wi-Fi connectivity",
    ],
  },
  {
    id: 2,
    slug: "luxury-suv",
    name: "Luxury SUV",
    category: "6-7 Passenger",
    mainImage: "/images/Chvy.png",
    gallery: [
      "/images/seat-chvy.jpg",
      "/images/int-chvy.png",
      "/images/sub.png",
    ],
    description:
      "The Luxury SUV combines space and power with elegance. Perfect for group travel or family trips, it features ample luggage capacity and modern entertainment options.",
    capacity: "6-7 passengers",
    luggage: "8-10 small or 7-8 large bags",
    features: [
      "Spacious leather interior",
      "Tri-zone climate control",
      "Premium sound system",
      "Rear armrest with drink holders",
      "Ambient lighting",
    ],
  },
  {
    id: 3,
    slug: "sprinter-van",
    name: "Sprinter Van",
    category: "11-14 Passenger",
    mainImage: "/images/blak.png",
    gallery: [
      "/images/BATH-.jpg",
      "/images/Benz-.jpg",
      "/images/Sprinter-.jpg",
    ],
    description:
      "The Mercedes Sprinter Van offers unmatched group comfort, featuring plush forward-facing seats, climate control, and smooth suspension for long journeys.",
    capacity: "11-14 passengers",
    luggage: "10-12 large or 12-14 small bags",
    features: [
      "Forward-facing seating",
      "Premium sound and lighting",
      "Wi-Fi and charging ports",
      "Ample luggage space",
      "Tinted windows for privacy",
    ],
  },
  {
    id: 4,
    slug: "stretch-limo-6",
    name: "Stretch Limo (6 Passenger)",
    category: "6 Passenger",
    mainImage: "/images/Gmcc.png",
    gallery: [
      "/images/gmcint.jpg",
      "/images/ultimate-.jpg",
      "/images/GMC suv.png",
    ],
    description:
      "Our 6-passenger Stretch Limo delivers an iconic limousine experience, featuring a minibar, fiber-optic lighting, and luxurious leather seating for your special events.",
    capacity: "6 passengers",
    luggage: "3-4 large or 4-5 small bags",
    features: [
      "Leather bench seating",
      "Ambient bar lighting",
      "Mini bar with glassware",
      "Privacy partition",
      "Surround sound system",
    ],
  },
  {
    id: 5,
    slug: "stretch-limo-10",
    name: "Stretch Limo (10 Passenger)",
    category: "10 Passenger",
    mainImage: "/images/suburban.png",
    gallery: [
      "/images/seat-chvy.jpg",
      "/images/int-chvy.png",
      "/images/sub.png",
    ],
    description:
      "A larger version of our classic limousine, the 10-passenger Stretch Limo combines elegance and entertainment with upgraded lighting, seating, and space.",
    capacity: "10-14 passengers",
    luggage: "3-4 large or 4-5 small bags",
    features: [
      "Extended leather seating",
      "Bar lighting system",
      "Sound and entertainment control",
      "Privacy partition",
      "Rear climate and lighting controls",
    ],
  },
];

export default fleetData;
