import React from "react";
import { useNavigate } from "react-router-dom";


const fleetData = [
  {
    id: 1,
    slug: "cadillac-escalade",
    name: "Cadillac Escalade",
    category: "Executive SUV · 1–4 Passenger",
    mainImage: "/images/escasuv.jpg",
    gallery: [
      "/images/esca-int1.jpg",
      "/images/esca-int.jpg",
      "/images/escaPM.png",
    ],
    description:
      "The Cadillac Escalade is a flagship luxury SUV designed for executive airport transfers and high-profile travel. Featuring premium captain’s leather seats, a refined suspension, and a whisper-quiet cabin, it delivers comfort, privacy, and presence on every journey.",
    capacity: "1–4 passengers",
    luggage: "2–3 medium-sized suitcases",
    features: [
      "Premium captain’s leather seating",
      "Tri-zone automatic climate control",
      "Tinted privacy glass",
      "Complimentary bottled water",
      "Smooth, quiet ride with advanced suspension",
    ],
  },
  {
    id: 2,
    slug: "chevrolet-suburban",
    name: "Chevrolet Suburban",
    category: "Full-Size SUV · 5–7 Passenger",
    mainImage: "/images/chevro.jpg",
    gallery: [
      "/images/seat-chvy.jpg",
      "/images/int-chvy.png",
      "/images/sub.png",
    ],
    description:
      "The Chevrolet Suburban is the industry standard for group airport transfers and corporate transportation. With captain’s chairs, expansive legroom, and exceptional cargo capacity, it comfortably accommodates both passengers and luggage.",
    capacity: "5–7 passengers",
    luggage: "6–8 large suitcases or 8–10 small bags",
    features: [
      "Captain’s leather seating configuration",
      "Rear climate control for passenger comfort",
      "Large rear cargo area",
      "Premium sound system",
      "Privacy-tinted windows",
    ],
  },
  {
    id: 3,
    slug: "sprinter-van",
    name: "Mercedes-Benz Sprinter Van",
    category: "Executive Van · 11–14 Passenger",
    mainImage: "/images/benzz.jpg",
    gallery: [
      "/images/BATH-.jpg",
      "/images/Benz-.jpg",
      "/images/Sprinter-.jpg",
    ],
    description:
      "The Mercedes-Benz Sprinter Van is ideal for corporate groups, event transportation, and team travel. It features forward-facing high-back seating, generous headroom, and a smooth ride designed for longer journeys.",
    capacity: "11–14 passengers",
    luggage: "10–12 large suitcases or 12–14 small bags",
    features: [
      "Forward-facing high-back seating",
      "Independent rear climate control",
      "USB charging ports",
      "Ample rear luggage storage",
      "Tinted windows for privacy",
    ],
  },
  {
    id: 4,
    slug: "gmc-yukon-denali",
    name: "GMC Yukon Denali",
    category: "Luxury SUV · 5–6 Passenger",
    mainImage: "/images/degmc.jpg",
    gallery: [
      "/images/gmcint.jpg",
      "/images/ultimate-.jpg",
      "/images/GMC suv.png",
    ],
    description:
      "The GMC Yukon Denali blends refined luxury with powerful performance. Configured with captain’s leather seats and a spacious interior, it’s a discreet yet premium option for corporate and VIP transportation.",
    capacity: "5–6 passengers",
    luggage: "4–5 large suitcases",
    features: [
      "Captain’s leather seating",
      "Heated and ventilated seats",
      "Advanced climate control",
      "Quiet, smooth ride quality",
      "Premium interior finishes",
    ],
  },
  {
    id: 5,
    slug: "stretch-limo-10",
    name: "Stretch Limousine",
    category: "Stretch Limo · 8–10 Passenger",
    mainImage: "/images/suburban.png",
    gallery: [
      "/images/seat-chvy.jpg",
      "/images/int-chvy.png",
      "/images/sub.png",
    ],
    description:
      "Our classic stretch limousine is designed for special occasions, celebrations, and VIP events. Featuring perimeter leather seating, mood lighting, and a privacy partition, it offers a traditional limousine experience.",
    capacity: "8–10 passengers",
    luggage: "Limited luggage capacity (recommended for events)",
    features: [
      "Perimeter leather bench seating",
      "Privacy partition",
      "Fiber-optic and LED mood lighting",
      "Premium sound system",
      "Rear climate controls",
    ],
  },
];


export default fleetData;
