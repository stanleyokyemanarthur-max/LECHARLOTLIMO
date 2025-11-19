const servicesData = [
  {
    id: 2,
    title: "Airport Car Services",
    slug: "airport-car-services",
    description:
      "Whether you’re traveling for business, leisure, or a special occasion, Le Charlot Limousine offers a variety of premium vehicles to suit your preferences and budget. Our chauffeurs guarantee a safe and relaxing ride to or from the airport.",
    icon: "/images/airport.png",
    image: "/images/drive.jpg",
    longDescription: `
At Le Charlot Limousine, we understand that air travel can be exhausting, which is why we make your journey to or from the airport effortless and refined. Our chauffeurs track flight schedules in real time to ensure on-time pickups and seamless coordination, even if your flight is delayed.

From the moment you step out of the terminal, you’ll be greeted by a professional chauffeur ready to assist with your luggage and escort you to a pristine, luxury vehicle. Every ride is designed to deliver a calm, stress-free transition between the airport and your destination.

Whether you’re a frequent business traveler or planning a special family trip, our airport car service combines reliability, discretion, and elegance. Experience transportation that complements the sophistication of your travels — because your journey begins the moment you leave your door.
    `,
  },
  {
    id: 3,
    title: "Business Travels",
    slug: "business-travels",
    description:
      "Le Charlot Limousine specializes in professional corporate transportation. From meetings to corporate events, we provide dependable, executive-class car service that enhances your business image while ensuring absolute comfort and punctuality.",
    icon: "/images/travel.png",
    image: "/images/flight.jpg",
    longDescription: `
For corporate clients, professionalism is everything — and that extends to how you travel. Le Charlot Limousine offers premium executive car services designed to help you arrive on time and in style. We understand that business never stops, so we provide a quiet, comfortable space to work or relax on the go.

Our chauffeurs are trained to deliver a flawless experience marked by punctuality, discretion, and efficiency. Whether you’re headed to a conference, board meeting, or airport transfer, our luxury vehicles ensure that every trip reinforces your company’s image.

We offer customized billing and scheduling for corporate accounts, making transportation seamless for executives and teams alike. Focus on your goals — we’ll handle the driving.
    `,
  },
  {
    id: 4,
    title: "Private Aviation Service",
    slug: "private-aviation",
    description:
      "For private jet travelers, Le Charlot Limousine delivers a personalized ground transportation experience. Our chauffeurs coordinate directly with your flight schedule, offering smooth and discreet transfers between private terminals and destinations.",
    icon: "/images/private.png",
    image: "/images/private.jpg",
    longDescription: `
Private jet travel deserves an equally refined ground experience. Our private aviation service ensures that you receive a seamless transition from air to ground, tailored to your precise schedule and preferences. 

We work closely with Fixed Base Operators (FBOs) to guarantee discreet, prompt access to and from your aircraft. Your chauffeur will be waiting planeside, ready to assist with luggage and guide you into an immaculate, luxury vehicle.

From confidential transfers to personalized itineraries, Le Charlot Limousine is trusted by discerning travelers who value privacy, precision, and perfection in every detail.
    `,
  },
  {
    id: 5,
    title: "Pier and Cruise Services",
    slug: "pier-cruises",
    description:
      "Set sail without stress. Le Charlot Limousine provides reliable transfers to major cruise terminals and piers, including Manhattan, Brooklyn, and Cape Liberty. Begin or end your voyage in luxury and comfort.",
    icon: "/images/shipping.png",
    image: "/images/Cruise.jpg",
    longDescription: `
Start your cruise vacation in true luxury. Le Charlot Limousine offers elegant transfers to and from major cruise ports, ensuring your journey begins and ends with comfort and sophistication. 

Our chauffeurs assist with your luggage, monitor embarkation times, and handle all logistics so you can simply enjoy the experience. Whether you’re traveling from an airport, hotel, or private residence, we make sure your arrival is effortless and timely.

Enjoy the anticipation of your voyage while we handle the details. From Manhattan to Cape Liberty, we make every mile as elegant as the journey ahead.
    `,
  },
  {
    id: 8,
    title: "Night Outs",
    slug: "night-in-town",
    description:
      "Experience the city’s nightlife with elegance. Whether it’s dinner, a concert, or a night out with friends, Le Charlot Limousine ensures a safe, stylish, and memorable evening on the town.",
    icon: "/images/cocktail.png",
    image: "/images/outside.jpg",
    longDescription: `
A night in the city deserves more than just transportation — it deserves an experience. Le Charlot Limousine turns your evening into an unforgettable event with luxury vehicles, impeccable service, and chauffeurs who know the city’s hotspots.

From dinner at a five-star restaurant to a Broadway show or an exclusive event, we ensure that every moment feels effortless. No parking hassles, no traffic worries — just pure enjoyment and sophistication.

Celebrate life’s moments in style. Our vehicles are equipped with mood lighting, premium sound systems, and everything needed to make your night out feel like a celebration.
    `,
  },
  {
    id: 9,
    title: "Weddings",
    slug: "weddings",
    description:
      "Le Charlot Limousine makes your special day even more magical. Our wedding transportation includes elegant vehicles, red-carpet treatment, and professional chauffeurs dedicated to creating lasting memories.",
    icon: "/images/rings.png",
    image: "/images/weded.jpg",
    longDescription: `
Your wedding day deserves perfection — and that’s exactly what we deliver. At Le Charlot Limousine, we provide elegant, reliable transportation that complements the beauty and importance of your big day.

From the bride’s grand arrival to transporting guests in comfort, every detail is handled with care. Our vehicles are impeccably detailed and our chauffeurs dressed professionally, ready to assist with every step.

Enjoy the luxury of red-carpet treatment, chilled beverages, and a stress-free experience designed to make your day unforgettable. Because every fairytale deserves a grand entrance.
    `,
  },
  {
    id: 10,
    title: "Proms",
    slug: "proms",
    description:
      "Celebrate prom night in glamour and safety. Our luxury limousines offer the perfect setting for an unforgettable evening with friends — music, lights, and sophistication included.",
    icon: "/images/people.png",
    image: "/images/promz.jpg",
    longDescription: `
Prom night is a once-in-a-lifetime event — and it should feel extraordinary. Our luxury limousines provide a stylish and safe way to celebrate with friends while creating memories that last forever.

Parents can rest easy knowing their teens are in professional hands. Our chauffeurs are experienced, courteous, and committed to safety without compromising the fun.

From red-carpet photos to smooth rides between venues, every detail is designed for excitement, elegance, and peace of mind.
    `,
  },
  {
    id: 11,
    title: "Casinos",
    slug: "casinos",
    description:
      "Turn your casino trip into a luxury experience. Le Charlot Limousine provides elegant, private transportation to and from top casinos, ensuring your evening begins and ends in class.",
    icon: "/images/cards.png",
    image: "/images/canson.jpg",
    longDescription: `
When it’s time to try your luck, start the night like a winner. Le Charlot Limousine offers exclusive casino transfer services to the most popular gaming destinations, from Atlantic City to local resorts.

Enjoy luxury interiors, complimentary refreshments, and professional chauffeurs who make every mile feel glamorous. Arrive at the casino in confidence and style — ready for a night of excitement.

And when the games are over, your chauffeur will be ready to take you home safely and comfortably. With us, your luck starts in the back seat.
    `,
  },
  {
    id: 12,
    title: "Traveling with Kids?",
    slug: "traveling-with-kids",
    description:
      "Family travel made simple — our vehicles come equipped with safe, clean child seats for infants and toddlers. With Le Charlot Limousine, your entire family rides in comfort and security.",
    icon: "/images/family.png",
    image: "/images/fam.jpg",
    longDescription: `
At Le Charlot Limousine, we believe luxury should be accessible to the whole family. Our family-friendly vehicles come equipped with child seats and spacious interiors, ensuring safety and comfort for travelers of all ages.

Our chauffeurs are specially trained to handle family needs — from assisting with strollers to adjusting climate control for little ones. We make sure every detail of your trip is as smooth and pleasant as possible.

Because when you travel with kids, peace of mind is priceless. Relax and enjoy the journey — we’ll take care of the rest.
    `,
  },
  {
    id: 13,
    title: "Urgent Package Delivery",
    slug: "urgent-package-delivery",
    description:
      "Need something delivered quickly and securely? Le Charlot Limousine offers same-day package delivery with the same professionalism and reliability that define our chauffeur service.",
    icon: "/images/protected.png",
    image: "/images/GlobeFarer.jpg",
    longDescription: `
When timing and confidentiality matter most, Le Charlot Limousine delivers. Our urg~ent package delivery service provides secure, same-day transport for your most important parcels.

From confidential documents to valuable items, our professional chauffeurs handle every delivery with precision, discretion, and efficiency. Each vehicle is GPS-tracked to ensure transparency and punctuality.

We don’t just move packages — we move trust. Experience a delivery service defined by the same luxury and reliability that define every Le Charlot ride.
    `,
  },
];

export default servicesData;
