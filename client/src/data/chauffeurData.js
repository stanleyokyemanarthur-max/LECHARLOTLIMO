const ChauffeurData = [
  // 1. Airport Transportation
  {
    id: 1,
    title: "Airport Services",
    slug: "airport-services",
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

  {
    id: 2,
    title: "Wine Tours",
    slug: "wine-tours",
    hero: {
      image: "/images/tour.jpg",
      description: [
        "Le Charlot Limousine offers immersive, private wine-tour experiences to some of the most celebrated vineyards and hidden-gem wineries in the region. Whether you're planning a romantic getaway, a sophisticated group outing, or a celebratory event, we craft each tour to match your preferences.",
        "From the moment your chauffeur arrives, you can unwind and savor the day—no crowded buses, rigid schedules, or concerns about driving after tastings. We handle the timing, the routes, and the comfort, so you can fully enjoy every pour, every conversation, and every breathtaking view along the way."
      ],
      cta: { text: "Make a Reservation", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Exceptional Chauffeurs & Elevated Service",
        image: "/images/glovs.jpeg",
        text: [
          "Our team partners with well-known wineries, boutique estates, and exclusive tasting rooms to ensure a curated journey rooted in refinement and discovery. Whether you prefer bold reds, crisp whites, or sparkling varietals, we help create a tasting path that suits your palate.",
          "Each chauffeur is hand-selected for professionalism, discretion, and hospitality. Expect a polished, well-dressed driver with exceptional knowledge of local wine routes, scenic backroads, and the best estates to visit. Your chauffeur remains attentive throughout the day—opening doors, adjusting schedules, coordinating with vineyards, and ensuring a seamless, relaxing tour from start to finish."
        ]
      },
      {
        title: "Luxury Fleet & VIP Amenities",
        image: "/images/fleet.png",
        text: [
          "Choose from our lineup of premium vehicles, including luxury sedans for intimate escapes, spacious SUVs for comfortable group travel, elegant Sprinter limousines for elevated celebrations, and executive coaches ideal for larger wine-tour events.",
          "Every vehicle is appointed with VIP amenities such as leather seating, climate control, chilled water, privacy features, and smooth suspension for long, scenic drives. For special occasions, we offer customized enhancements including celebration décor, champagne service, custom routes, and private vineyard experiences."
        ]
      }
    ]
  },


  {
    id: 3,
    title: "Concerts",
    slug: "concerts",
    hero: {
      image: "/images/chauf.jpg",
      description: [
        "Arrive Like a VIP: Le Charlot Limousines ensures you make a grand entrance at any concert with unmatched style and professionalism. Forget the stress of parking, traffic, or navigating crowded drop-off zones — your chauffeur handles every detail while you enjoy the anticipation of the show.",
        "Luxury From Door to Door: Our executive-class vehicles are designed to elevate your concert experience long before you arrive at the venue. Whether it's a solo outing, a romantic date, or a group celebration, we deliver a smooth, stylish ride that enhances the excitement of the night."
      ],
      cta: { text: "Book Corporate Service", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Premium Fleet for Concert Nights",
        image: "/images/lux1.jpg",
        text: [
          "A Vehicle for Every Vibe: Le Charlot Limousines offers a polished selection of Luxury Sedans, Executive SUVs, Stretch Limos, Sprinter Limos, and Party Coaches ideal for intimate nights out or large group concert trips.",
          "Comfort That Sets the Mood: Each vehicle is equipped with thoughtfully curated amenities such as onboard Wi-Fi, fast-charging ports, chilled bottled water, premium sound systems, ambient lighting, and plush seating ensuring the concert mood starts the moment you step inside.",
          "Perfect for All Music Lovers: Whether you’re attending a sold-out stadium show, a private performance, or a local music festival, our fleet is tailored to match the energy and prestige of the moment."
        ]
      },
      {
        title: "Professional Experience From Start to Encore",
        image: "/images/glovess.jpg",
        text: [
          "Seamless Timing & Stress-Free Arrival: Our chauffeurs are experts at venue logistics, ensuring timely pick-ups, efficient drop-offs, and coordinated meet-ups after the show. Avoid long walks, traffic delays, and confusing exit routes we make everything effortless.",
          "Chauffeurs Trained for VIP Care: Every Le Charlot Limousines chauffeur is trained to maintain strict discretion, professionalism, and attentive service throughout your trip. Their goal is to create a flawless, enjoyable experience so you can focus solely on the music and the moment.",
          "From Start to Finish: After the concert, your chauffeur will be ready for a smooth, safe ride home or to your next destination no waiting in crowds, no searching for rides, just a seamless conclusion to an unforgettable night."
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
      image: "/images/arrival.jpg",
      description: [
        "Make your big day even more special with elegant limousine transportation for the couple and guests.",
        "Le CharlotLimousine coordinates with your event planner to ensure a seamless experience."
      ],
      cta: { text: "Book Wedding Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Class or Style",
        image: "/images/class.jpg",
        text: [
          "Arrive in style with a stretch limo or sedan.",
          "Newlyweds can enjoy a 10% discount on airport transfers with a honeymoon package."
        ]
      },
      {
        title: "Fleet & Service",
        image: "/images/fleeet.jpg",
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
    title: "Night Outs",
    slug: "night-in-town",
    hero: {
      image: "/images/night.jpg",
      description: [
        "Experience the city nightlife in safety and style.",
        "Le Charlot Limousine is your designated driver for dinners, shows, concerts, and city tours."
      ],
      cta: { text: "Book Night Out", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Vehicle Options",
        image: "/images/fleeet.jpg",
        text: [
          "6 or 10 passenger limousines, vans, sedans, SUVs, Mercedes Sprinter Vans.",
          "Party Bus (24-36 passengers) or Mini Coach Bus available for larger groups."
        ]
      },
      {
        title: "Reservation Info",
        image: "/images/gloves.png",
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
      image: "/images/Un.jpg",
      description: [
        "Make your prom night unforgettable with Le Charlot Limousine.",
        "Arrive in style with professional chauffeurs ensuring a safe and glamorous experience."
      ],
      cta: { text: "Book Prom Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Prom Day Experience",
        image: "/images/dryve.jpg",
        text: [
          "Stretch limousines, party limousines, or party buses to match your style and budget.",
          "Chauffeurs provide safe, reliable, and professional service for a memorable night."
        ]
      },
      {
        title: "Coverage & Locations",
        image: "/images/carservice.jpg",
        text: [
          "Services available across Atlanta Georgia.",
          "Choose the vehicle that fits your taste and enjoy luxury and comfort throughout the evening."
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Anniversaries",
    slug: "anniversary-services",
    hero: {
      image: "/images/anni2.jpg",
      description: [
        "Celebrate your love story with Le Charlot Limousines. We transform your anniversary into an unforgettable experience with elegant vehicles, exceptional service, and a romantic atmosphere from the moment we pick you up.",
        "Our professional chauffeurs ensure a smooth, intimate, and luxurious ride  allowing you to relax, connect, and enjoy your special day without a single worry."
      ],
      cta: { text: "Book Prom Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Romantic Fleet Options for Every Celebration",
        image: "/images/fleeet.jpg",
        text: [
          "Choose from Stretch Limousines, Executive SUVs, Luxury Sedans, or Private Sprinter Limos — each designed to provide comfort, elegance, and a perfect setting for your anniversary celebration.",
          "Enhance the experience with premium amenities including ambient lighting, chilled champagne upon request, soft leather seating, and a peaceful, private environment ideal for celebrating your milestone together.",
          "Whether it’s your first anniversary or your fiftieth, we offer the perfect vehicle to match your vision, style, and budget."
        ]
      },
      {
        title: "Experience Designed for Romance",
        image: "/images/Luxury.jpg",
        text: [
          "Le Charlot chauffeurs deliver safe, reliable, and discreet service so you can fully enjoy each moment with your partner — from dinner dates to surprise destinations and scenic night drives.",
          "We handle every detail, including timely pickups, smooth routes, and door-to-door convenience, ensuring your evening is stress-free and beautifully planned.",
          "Serving clients across the US, UK, and Canada, including New York, New Jersey, California, Connecticut, and Pennsylvania, we make luxury anniversary travel accessible wherever your celebration takes place."

        ]
      }
    ]
  },
  {
    id: 8,
    title: "Sporting Events",
    slug: "sporting-events",
    hero: {
      image: "/images/sporte.jpg",
      description: [
        "Experience the thrill of game day without the stress of traffic, parking, or long walks. Le Charlot Limousines ensures that every sporting event you attend starts in style, comfort, and safety.",
        "Our professional chauffeurs provide VIP-level service, handling all logistics so you can focus on the excitement of the match. From pick-up to post-game drop-off, your experience is seamless and memorable."
      ],
      cta: { text: "Book Prom Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Luxury Fleet Tailored for Game Day",
        image: "/images/gameday.png",
        text: [
          "Le Charlot Limousines offers a curated selection of vehicles to match your group size and style. Choose from executive Sedans, spacious SUVs, elegant Stretch Limousines, or Party Buses designed for larger groups who want to celebrate together.",
          "Each vehicle is equipped with premium amenities: plush leather seating, climate control, ambient lighting, high-end sound systems, Wi-Fi connectivity, charging ports, and refreshments to keep spirits high before, during, and after the event.",
          "Whether it’s a solo outing, a date night, or a tailgate party with friends, our fleet guarantees comfort, style, and a first-class experience for every fan."
        ]
      },
      {
        title: "Seamless, Stress-Free Game Day Experience",
        image: "/images/gamee.png",
        text: [
          "Our chauffeurs are expertly trained to navigate traffic, stadium entrances, and parking logistics so you arrive relaxed and on time. We provide VIP-style curbside drop-off where possible, allowing you to step directly into the excitement without delays or hassles.",
          "Enjoy full discretion, safety, and professionalism from start to finish. Whether you’re celebrating with colleagues, family, or friends, every detail of your transportation is managed with precision and care.",
          "Le Charlot Limousines serves clients across the US, UK, and Canada, including New York, New Jersey, California, Connecticut, and Pennsylvania. From local matches to championship events, we ensure your journey is as exciting and memorable as the game itself."
        ]
      },
      {
        title: "Enhance Your Game Day Experience",
        image: "/images/gamess.png",
        text: [
          "Upgrade your ride with custom add-ons like pre-stocked refreshments, mini tailgate setups, or curated playlists to set the mood before the game begins.",
          "Perfect for corporate outings, bachelor/bachelorette parties, or family celebrations, Le Charlot Limousines ensures that your transportation is not just a ride but an integral part of your overall event experience.",
          "From arrival to post-game celebrations, our attention to detail guarantees that your sporting event day is unforgettable, luxurious, and entirely stress-free."
        ]
      }
    ]
  },
  {
    id: 9,
    title: "FBO Executive Chauffeur Service",
    slug: "fbo-executive-chauffeur-service",
    hero: {
      image: "/images/fbo.png",
      description: [
        "Arrive and depart in unmatched privacy, precision, and prestige with Le Charlot Limousines’ exclusive FBO Executive Chauffeur Service. Designed for discerning travelers, CEOs, entertainers, and UHNW individuals, our services provide seamless ground transportation directly from private terminals and Fixed-Base Operators worldwide.",
        "From coordinating with FBO staff to ensuring discreet tarmac pickups, our chauffeurs deliver an elite level of professionalism, comfort, and security. Your journey remains uninterrupted, private, and tailored to your schedule—no delays, no lines, no complications."
      ],
      cta: { text: "Book Prom Limousine", link: "/reservation-form" }
    },
    sections: [
      {
        title: "Elite Fleet & Amenities",
        image: "/images/elit.jpg",
        text: [
          "Travel in complete luxury with our curated fleet of executive vehicles, featuring premium Sedans, First-Class SUVs, luxury Sprinters, and high-end Business Vans ideal for individuals or corporate travel teams.",
          "Each vehicle offers a refined blend of elegance and functionality—hand-stitched leather interiors, advanced climate control, noise-isolated cabins, extended legroom, and full Wi-Fi connectivity. Enjoy amenities including bottled water, device chargers, ambient lighting, and optional onboard refreshments curated to your preference.",
          "Whether arriving from an international flight or preparing for a corporate meeting, our vehicles provide the perfect environment for relaxation, productivity, or uninterrupted privacy."
        ]
      },
      {
        title: "Chauffeur Expertise & Seamless Coordination",
        image: "/images/chaf expert.png",
        text: [
          "Our chauffeurs undergo specialized FBO handling training, enabling them to coordinate directly with private airport staff, pilots, and flight support teams to ensure flawless timing and discreet transfers.",
          "From tarmac pickups (where allowed) to private ramp access and secure drop-offs, every movement is executed with precision. Your chauffeur monitors flight status in real time, ensuring your vehicle is positioned and ready before you even touch the ground.",
          "We proudly serve major FBO networks across the US, UK, Canada, and Europe—including Signature Aviation, Atlantic Aviation, Jet Aviation, and more—providing consistent, elite-level service no matter your destination."
        ]
      },
      {
        title: "Personalized Enhancements & VIP Experience",
        image: "/images/drivesub.png",
        text: [
          "Enhance your FBO experience with personalized add-ons such as pre-stocked luxury refreshments, preferred newspapers, custom music selections, or secure document transport.",
          "Perfect for corporate executives, entertainment professionals, diplomatic travel, and luxury vacationers, our service transforms your ground transfer into a seamless extension of your private flight experience.",
          "With Le Charlot Limousines, every detail—from arrival to destination—is crafted to deliver discretion, punctuality, and a truly elevated travel experience."
        ]
      }
    ]
  }
];

export default ChauffeurData;
