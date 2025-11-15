const ChauffeurData = [
  // 1. Airport Transportation
  {
    id: 1,
    title: "Airport Transportation",
    slug: "airport-transportation",
    hero: {
      image: "/images/Air.jpg",
      description: [
        "Reliable airport transportation with timely pickups and drop-offs.",
        "Professional chauffeurs ensure a smooth and comfortable journey.",
        "Enjoy a stress-free experience with luggage assistance, flight tracking, and meet & greet service."
      ],
      cta: { text: "Book Airport Transfer", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Fleet & Service",
        image: "/images/fleet.png",
        text: [
          "Sedans, SUVs, and Vans available for individual travelers or groups.",
          "Professional chauffeurs provide punctual, safe, and comfortable service."
        ]
      },
    ]
  },

  // 2. FBO Airport Transportation
  {
    id: 2,
    title: "FBO Airport Transportation",
    slug: "fbo-airport-transportation",
    hero: {
      image: "/images/fbo.jpg",
      description: [
        "Empire Limousine provides VIP ground transportation to and from FBO terminals.",
        "Our chauffeurs are trained for private, professional service for corporate and private travelers."
      ],
      cta: { text: "Make a Reservation", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Professional Fleet",
        image: "/images/fbo_fleet.jpg",
        text: [
          "Luxury sedans, SUVs, Sprinter Limos, and Motor Coaches.",
          "Customizable for groups of any size, with VIP amenities included."
        ]
      },
      {
        title: "Worldwide Service",
        image: "/images/fbo_chauffeur.jpg",
        text: [
          "We serve over 500+ cities globally through our professional affiliate network.",
          "Chauffeurs are English-speaking, well-dressed, and ready for a safe and comfortable journey."
        ]
      }
    ]
  },

  // 3. Corporate Limousine Service
  {
    id: 3,
    title: "Corporate Limousine Service",
    slug: "corporate-limousine-service",
    hero: {
      image: "/images/chauf.jpg",
      description: [
        "Arrive at meetings and events in style with professional chauffeurs.",
        "Executive-class vehicles provide comfort, reliability, and a professional impression."
      ],
      cta: { text: "Book Corporate Service", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Fleet & Amenities",
        image: "/images/corporate_fleet.jpg",
        text: [
          "Luxury Sedans, Executive SUVs, and Stretch Limos available.",
          "Wi-Fi, charging ports, and bottled water included to enhance productivity on the go."
        ]
      },
      {
        title: "Corporate Advantage",
        image: "/images/corporate_extra.jpg",
        text: [
          "Punctual and seamless service ensures you reach meetings on time.",
          "Chauffeurs are trained to maintain discretion and professionalism at all times."
        ]
      }
    ]
  },

  // 4. Weddings
  {
    id: 4,
    title: "Weddings",
    slug: "wedding-limousine-service",
    hero: {
      image: "/images/weds.jpg",
      description: [
        "Make your big day even more special with elegant limousine transportation for the couple and guests.",
        "Empire Limousine coordinates with your event planner to ensure a seamless experience."
      ],
      cta: { text: "Book Wedding Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Class or Style",
        image: "/images/wedding_limo.jpg",
        text: [
          "Arrive in style with a stretch limo or sedan.",
          "Newlyweds can enjoy a 10% discount on airport transfers with a honeymoon package."
        ]
      },
      {
        title: "Fleet & Service",
        image: "/images/wedding_fleet.jpg",
        text: [
          "Sedans, SUVs, vans, stretch limousines, mini coach buses, or full-size coach buses for your guests.",
          "Professional chauffeurs provide personalized service to make your wedding day unforgettable."
        ]
      }
    ]
  },

  // 5. Night in Town
  {
    id: 5,
    title: "Night in Town",
    slug: "night-in-town",
    hero: {
      image: "/images/night.jpg",
      description: [
        "Experience the city nightlife in safety and style.",
        "Empire Limousine is your designated driver for dinners, shows, concerts, and city tours."
      ],
      cta: { text: "Book Night Out", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Vehicle Options",
        image: "/images/night_vehicle.jpg",
        text: [
          "6 or 10 passenger limousines, vans, sedans, SUVs, Mercedes Sprinter Vans.",
          "Party Bus (24-36 passengers) or Mini Coach Bus available for larger groups."
        ]
      },
      {
        title: "Reservation Info",
        image: "/images/night_reservation.jpg",
        text: [
          "100% non-refundable deposit required upon booking.",
          "Call early—weekends and popular events book quickly."
        ]
      }
    ]
  },

  // 6. Proms
  {
    id: 6,
    title: "Proms",
    slug: "prom-limousine-service",
    hero: {
      image: "/images/proms.jpg",
      description: [
        "Make your prom night unforgettable with Empire Limousine.",
        "Arrive in style with professional chauffeurs ensuring a safe and glamorous experience."
      ],
      cta: { text: "Book Prom Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Prom Day Experience",
        image: "/images/prom_limo.jpg",
        text: [
          "Stretch limousines, party limousines, or party buses to match your style and budget.",
          "Chauffeurs provide safe, reliable, and professional service for a memorable night."
        ]
      },
      {
        title: "Coverage & Locations",
        image: "/images/prom_locations.jpg",
        text: [
          "Services available across US, UK, and Canada, including New York, New Jersey, California, Connecticut, and Pennsylvania.",
          "Choose the vehicle that fits your taste and enjoy luxury and comfort throughout the evening."
        ]
      }
    ]
  }
];

export default ChauffeurData;
