const servicesData = [
  {
    id: 2,
    title: "Airport Services",
    slug: "airport-services",
    tagline: "ATL pickups & departures • Flight-aware timing",
    description:
      "Luxury airport transportation built for precision. We track flights, plan around traffic, and deliver a smooth transfer to or from Hartsfield-Jackson Atlanta International Airport (ATL).",
    icon: "/images/airport.png",
    image: "/images/newairpot.jpg",
    longDescription: `
Airport travel should feel effortless. Our chauffeurs plan pickups with real-time awareness of flight status and airport flow, ensuring you’re never rushed and never waiting longer than necessary.

Whether you're arriving after a long flight or heading out on a tight schedule, we provide a calm, polished experience — including luggage assistance, professional communication, and a pristine vehicle every time.

For business travelers, families, and VIP guests, our service is designed to reduce friction and elevate the entire travel day.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Vehicle Options for Airport Service",
        note:
          "We’ll match the right vehicle based on luggage, group size, and comfort preference.",
        items: [
          {
            title: "Executive Sedan",
            text: "Ideal for solo and business travel",
            image: "/images/degmc.jpg",
          },
          {
            title: "Luxury SUV",
            text: "Extra luggage space and comfort",
            image: "/images/chevro.jpg",
          },
          {
            title: "Executive Van",
            text: "Perfect for group travel",
            image: "/images/benzz.jpg",
          },
          {
            title: "VIP Meet & Assist",
            text: "Optional coordination on request",
            image: "/images/escasuv.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "Meet & Greet Without the Stress",
        image: "/images/comfort.jpg",
        bg: "dark",
        reverse: false,
        text:
          "For arrivals, we coordinate clear pickup instructions and help reduce curbside confusion. Your chauffeur keeps communication simple and timing precise — even when flights shift.",
        bullets: [
          "Flight-aware timing",
          "Clear pickup instructions",
          "Luggage assistance",
          "Quiet, clean vehicles",
        ],
      },
      {
        type: "highlights",
        title: "What’s Included",
        items: [
          "ATL airport pickup & drop-off (domestic + international)",
          "Flight tracking for delays and early arrivals",
          "Professional chauffeur assistance with luggage",
          "Quiet, clean luxury vehicles for a comfortable ride",
          "Optional meet & greet coordination on request",
        ],
      },
      {
        type: "logistics",
        title: "Airport Transfers Made Simple",
        items: [
          {
            label: "Flight-Aware Scheduling",
            text: "We adjust around real flight status so your pickup aligns with arrival timing.",
          },
          {
            label: "Traffic-Optimized Routing",
            text: "Routes are planned to avoid bottlenecks and keep your schedule intact.",
          },
          {
            label: "Professional Communication",
            text: "Clear pickup instructions and reliable timing — no confusion at the curb.",
          },
          {
            label: "Comfort & Discretion",
            text: "A calm, premium experience for executives, families, and VIP travelers.",
          },
        ],
      },
      {
        type: "cta",
        title: "Book an ATL Airport Transfer",
        text:
          "Send your flight info and pickup details — we’ll handle the timing and logistics.",
        buttonText: "Book Airport Service",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 3,
    title: "Business Travels",
    slug: "business-travels",
    tagline: "Executive-class • Punctual • Discreet",
    description:
      "Professional chauffeur service for meetings, corporate events, executive schedules, and client hospitality across Metro Atlanta.",
    icon: "/images/travel.png",
    image: "/images/biz.jpg",
    longDescription: `
In business, timing and presentation matter. Our executive transportation is built for punctuality, discretion, and a calm environment — whether you're moving between meetings or hosting an important guest.

We provide dependable service that aligns with real schedules: pickups that are on time, routes that reduce delays, and chauffeurs trained for professional standards.

Arrive prepared, composed, and confident — every time.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Corporate Vehicle Selection",
        note: "Choose the right vehicle for your meeting day or executive guest.",
        items: [
          {
            title: "Executive Sedan",
            text: "Quiet and professional",
            image: "/images/chevro.jpg",
          },
          {
            title: "Luxury SUV",
            text: "Comfort + presence",
            image: "/images/degmc.jpg",
          },
          {
            title: "Executive Van",
            text: "Teams and coordinated travel",
            image: "/images/benzz.jpg",
          },
          {
            title: "Hourly As-Directed",
            text: "Multi-stop days made easy",
            image: "/images/escasuv.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "A Better Way to Move Through Atlanta",
        image: "/images/flexible.jpg",
        bg: "dark",
        reverse: true,
        text:
          "Business schedules change. We support flexible itineraries with smooth adjustments — so your transportation never becomes the problem.",
        bullets: [
          "Multi-stop support",
          "Discreet chauffeurs",
          "On-time execution",
          "Professional presentation",
        ],
      },
      {
        type: "highlights",
        title: "Corporate Transportation Options",
        items: [
          "Point-to-point executive transfers",
          "Hourly chauffeur service for multi-stop days",
          "Conference & corporate event transportation",
          "Client hospitality and VIP arrivals",
          "Airport + hotel + office transfers",
        ],
      },
      {
        type: "logistics",
        title: "Built for Corporate Standards",
        items: [
          {
            label: "Discretion",
            text: "Professional chauffeurs and privacy-first service for executives and clients.",
          },
          {
            label: "Reliable Timing",
            text: "Route planning designed around traffic patterns and real appointment schedules.",
          },
          {
            label: "Flexible Itineraries",
            text: "Multi-stop days and schedule changes handled smoothly without stress.",
          },
          {
            label: "Premium Presentation",
            text: "A polished experience that supports your brand image and professionalism.",
          },
        ],
      },
      {
        type: "cta",
        title: "Request Executive Chauffeur Service",
        text:
          "Tell us your schedule and locations — we’ll recommend the best service style for your day.",
        buttonText: "Request Corporate Service",
        buttonLink: "/contact",
      },
    ],
  },

  {
    id: 4,
    title: "Major Sporting & Signature Events",
    slug: "sporting-events",
    tagline: "VIP-ready event logistics • No parking stress",
    description:
      "Chauffeured transportation for high-attendance events — strategic drop-offs, staged pickups, and smooth departure planning.",
    icon: "/images/private.png",
    image: "/images/stadia.jpg",
    longDescription: `
Big events bring big crowds — and parking, traffic, and post-event congestion can quickly ruin the experience. We plan transportation around venue flow so you can arrive relaxed and exit without chaos.

From stadium nights to major city events, we coordinate drop-off points and pickup plans that minimize wait times and confusion.

Whether you’re attending with a small group or coordinating multiple guests, we make the logistics feel effortless.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Event Transportation Styles",
        note: "Pick what fits the night — point-to-point or hourly coverage.",
        items: [
          {
            title: "Point-to-Point",
            text: "Drop-off and pickup planned",
            image: "/images/chevro.jpg",
          },
          {
            title: "Hourly Coverage",
            text: "Dinner → venue → after-event",
            image: "/images/degmc.jpg",
          },
          {
            title: "Group Coordination",
            text: "Keep everyone together",
            image: "/images/benzz.jpg",
          },
          {
            title: "VIP Arrivals",
            text: "Smooth, polished entrances",
            image: "/images/escasuv.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "Arrive Smooth. Leave Faster.",
        image: "/images/sport.jpg",
        bg: "dark",
        reverse: false,
        text:
          "We plan around crowd movement so you’re not stuck in the worst traffic. Your pickup plan is clear, coordinated, and easy to follow.",
        bullets: [
          "Strategic drop-offs",
          "Clear pickup points",
          "Reduced congestion stress",
          "Safe late-night returns",
        ],
      },
      {
        type: "highlights",
        title: "Perfect For",
        items: [
          "High-attendance sporting events and arena nights",
          "VIP arrivals and premium venue experiences",
          "Group outings that require coordination",
          "Late-night events with safe return service",
          "Multi-stop itineraries (dinner → venue → after-event)",
        ],
      },
      {
        type: "logistics",
        title: "Event Transportation That Works",
        items: [
          {
            label: "Strategic Drop-Offs",
            text: "We choose staging points that reduce traffic delays and improve access.",
          },
          {
            label: "Pickup Planning",
            text: "Clear meeting points and time windows so your departure is smooth.",
          },
          {
            label: "Group Coordination",
            text: "Keep your party together with one plan and one consistent ride experience.",
          },
          {
            label: "Experienced Chauffeurs",
            text: "Drivers familiar with venue patterns and high-volume event logistics.",
          },
        ],
      },
      {
        type: "cta",
        title: "Planning a Major Event Night?",
        text:
          "Tell us the venue and time — we’ll coordinate a drop-off and pickup plan that fits the crowd flow.",
        buttonText: "Book Event Service",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 5,
    title: "Anniversaries",
    slug: "anniversaries",
    tagline: "Romantic evenings • Private & elegant",
    description:
      "Celebrate your anniversary with luxury transportation designed around your plans — fine dining, surprises, and unforgettable nights.",
    icon: "/images/shipping.png",
    image: "/images/Un.jpg",
    longDescription: `
An anniversary should feel effortless from start to finish. We provide private, elegant chauffeur service that enhances the evening — without parking stress, rideshare delays, or time pressure.

Whether it’s a surprise pickup, a premium dinner reservation, or a multi-stop evening itinerary, we coordinate timing so every moment feels smooth and intentional.

Enjoy the experience — we’ll handle the drive.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Anniversary Night Options",
        note: "Choose a plan that fits your evening — simple or fully curated.",
        items: [
          {
            title: "Dinner Transfers",
            text: "Arrive relaxed and on time",
            image: "/images/degmc.jpg",
          },
          {
            title: "Multi-Stop Night",
            text: "Dinner → lounge → dessert",
            image: "/images/benzz.jpg",
          },
          {
            title: "Surprise Pickup",
            text: "Discreet timing coordination",
            image: "/images/chevro.jpg",
          },
          {
            title: "Late-Night Return",
            text: "Safe, private ride home",
            image: "/images/escasuv.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "A Romantic Night Should Feel Effortless",
        image: "/images/anniv.jpg",
        bg: "dark",
        reverse: true,
        text:
          "No parking. No waiting. No schedule stress. Just a calm, premium ride that keeps the evening flowing smoothly.",
        bullets: [
          "Private, quiet ride",
          "Time-aligned pickups",
          "No parking stress",
          "Safe return included",
        ],
      },
      {
        type: "highlights",
        title: "Popular Anniversary Plans",
        items: [
          "Dinner reservations & upscale venues",
          "Surprise pickups and discreet arrivals",
          "Multi-stop nights (dinner → lounge → dessert)",
          "Weekend getaway departures",
          "Photo stops and timed arrivals",
        ],
      },
      {
        type: "logistics",
        title: "Designed for a Smooth Evening",
        items: [
          {
            label: "Reservation-Friendly Timing",
            text: "We align pickups with your reservations and venue schedule.",
          },
          {
            label: "Comfort & Privacy",
            text: "A refined ride that keeps the mood calm and exclusive.",
          },
          {
            label: "No Parking Hassle",
            text: "Enjoy the city — we handle all drop-offs and logistics.",
          },
          {
            label: "Safe Return",
            text: "Relax fully knowing your ride home is already covered.",
          },
        ],
      },
      {
        type: "cta",
        title: "Book an Anniversary Ride",
        text:
          "Share your itinerary and preferred pickup time — we’ll build a seamless plan around it.",
        buttonText: "Reserve Now",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 8,
    title: "Night Outs",
    slug: "night-in-town",
    tagline: "Dinner • Lounges • Late-night pickup",
    description:
      "Enjoy Atlanta nightlife in comfort and style — no parking, no waiting, no stress. Perfect for groups, birthdays, and celebration nights.",
    icon: "/images/cocktail.png",
    image: "/images/nightlife.jpg",
    longDescription: `
A night out should feel like a celebration, not a logistics problem. We provide premium transportation that keeps your group together and your schedule smooth — with planned pickups and a safe ride home.

From dinner reservations to lounges and late-night venues, we make the entire evening effortless and elevated.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "How We Cover Your Night Out",
        note: "Choose point-to-point or hourly coverage depending on your plans.",
        items: [
          {
            title: "Dinner Reservations",
            text: "Arrive on time, no parking",
            image: "/images/degmc.jpg",
          },
          {
            title: "Lounge & City Stops",
            text: "Move smoothly between spots",
            image: "/images/chevro.jpg",
          },
          {
            title: "Group Celebrations",
            text: "Keep everyone together",
            image: "/images/benzz.jpg",
          },
          {
            title: "Late-Night Pickup",
            text: "Safe return service included",
            image: "/images/escasuv.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "Enjoy the Night — Skip the Stress",
        image: "/images/night.jpg",
        bg: "dark",
        reverse: false,
        text:
          "We plan pickups and drop-offs so you’re not stuck in surge pricing, long waits, or parking drama.",
        bullets: [
          "No surge pricing surprises",
          "Easy pickup plan",
          "Luxury comfort",
          "Safe ride home",
        ],
      },
      {
        type: "highlights",
        title: "Great For",
        items: [
          "Dinner + lounge + club itineraries",
          "Birthdays and group celebrations",
          "Concert nights and after-event pickups",
          "Special nights out with friends",
          "Safe late-night return service",
        ],
      },
      {
        type: "logistics",
        title: "Nightlife Transportation, Elevated",
        items: [
          {
            label: "Stay Together",
            text: "One coordinated ride experience for your group — no split cars.",
          },
          {
            label: "No Waiting",
            text: "Avoid rideshare surges and long pickup times in busy nightlife zones.",
          },
          {
            label: "Smart Drop-Offs",
            text: "We choose entry points that reduce delays and help you arrive smoothly.",
          },
          {
            label: "Safe Return",
            text: "Enjoy the night fully and ride home comfortably with a professional chauffeur.",
          },
        ],
      },
      {
        type: "cta",
        title: "Ready for a Night Out?",
        text: "Book your chauffeur service and enjoy Atlanta nightlife without the stress.",
        buttonText: "Book Night Out",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 9,
    title: "Weddings",
    slug: "weddings",
    tagline: "Timeline coordination • Elegant arrivals",
    description:
      "Luxury wedding transportation for couples, bridal parties, and guests — coordinated timing, polished presentation, and effortless movement between venues.",
    icon: "/images/rings.png",
    image: "/images/couple.jpg",
    longDescription: `
Wedding transportation should be seamless. We coordinate timing around your ceremony and reception schedule so the day flows smoothly for the couple and guests.

From elegant arrivals to group movement between venues, our chauffeurs deliver a refined experience built for one of life’s most important moments.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Wedding Day Transportation Coverage",
        note: "We help your day run smoothly — from arrivals to guest movement.",
        items: [
          {
            title: "Couple Grand Arrival",
            text: "Elegant entrance and send-off",
            image: "/images/arival.jpg",
          },
          {
            title: "Bridal Party Transfers",
            text: "Coordinated timelines",
            image: "/images/brideparty.jpg",
          },
          {
            title: "Guest Transportation",
            text: "Move guests between venues",
            image: "/images/guest.jpg",
          },
          {
            title: "Photo Stops",
            text: "Timing planned for pictures",
            image: "/images/stop.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "A Smooth Timeline Makes a Beautiful Day",
        image: "/images/cordinate.jpg",
        bg: "dark",
        reverse: true,
        text:
          "We coordinate pickups and staging so the couple, party, and guests arrive on time — without rushing or confusion.",
        bullets: [
          "Timeline coordination",
          "Professional chauffeurs",
          "Clean luxury vehicles",
          "Guest movement planning",
        ],
      },
      {
        type: "highlights",
        title: "Wedding Transportation Options",
        items: [
          "Couple grand arrival and send-off",
          "Bridal party transfers",
          "Guest transportation between venues",
          "Photo stop coordination",
          "Reception pickup and returns",
        ],
      },
      {
        type: "logistics",
        title: "Coordination You Can Trust",
        items: [
          {
            label: "Timeline Planning",
            text: "We align pickups with ceremony and photo schedules for smooth transitions.",
          },
          {
            label: "Venue Staging",
            text: "Drop-off locations planned to keep arrivals elegant and organized.",
          },
          {
            label: "Guest Comfort",
            text: "Guests avoid parking stress and arrive on time, together.",
          },
          {
            label: "Professional Presentation",
            text: "Chauffeurs trained for formal occasions and premium service standards.",
          },
        ],
      },
      {
        type: "cta",
        title: "Request Wedding Transportation",
        text:
          "Tell us your venues, guest needs, and timeline — we’ll propose a smooth plan for your day.",
        buttonText: "Request a Quote",
        buttonLink: "/contact",
      },
    ],
  },

  {
    id: 10,
    title: "Proms",
    slug: "proms",
    tagline: "Safe • Stylish • Parent-approved",
    description:
      "Prom transportation designed for fun and peace of mind — professional chauffeurs, group coordination, and a memorable arrival.",
    icon: "/images/people.png",
    image: "/images/Prom 25.jpg",
    longDescription: `
Prom night is a milestone. We provide safe, stylish transportation with professional service that keeps the experience fun — and gives parents peace of mind.

From photo stops to venue drop-offs and post-prom pickup, we organize the full ride experience with clear timing and smooth coordination.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Prom Night Experience",
        note: "We plan a clear pickup and return so the night stays smooth.",
        items: [
          {
            title: "Group Pickup",
            text: "Everyone together, on time",
            image: "/images/promgather.jpg",
          },
          {
            title: "Photo Stops",
            text: "Time for pictures, no rush",
            image: "/images/promstop.jpg",
          },
          {
            title: "Venue Drop-Off",
            text: "Smooth arrivals and staging",
            image: "/images/promarive.jpg",
          },
          {
            title: "After-Prom Return",
            text: "Safe pickup and return ride",
            image: "/images/dropoff.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "Fun for Them. Peace of Mind for You.",
        image: "/images/assure.jpg",
        bg: "dark",
        reverse: false,
        text:
          "Parents can relax knowing pickups are planned, drivers are professional, and timing is handled cleanly.",
        bullets: [
          "Professional chauffeurs",
          "Planned pickup points",
          "Group coordination",
          "Safe returns",
        ],
      },
      {
        type: "highlights",
        title: "Prom Night Coverage",
        items: [
          "Group pickup coordination",
          "Photo stop timing",
          "Venue drop-off and staged pickup",
          "Optional multi-stop itinerary",
          "Professional chauffeur service throughout",
        ],
      },
      {
        type: "logistics",
        title: "Safe, Organized, and Memorable",
        items: [
          {
            label: "Precision Pickup coordination",
            text: "Every stop, time, and route is pre-arranged and confirmed—so the night starts smoothly without confusion or delays.",
          },
          {
            label: "Professional Chauffeurs",
            text: "Discreet, punctual, and safety-focused—delivering a smooth ride while letting the night stay yours.",
          },
          {
            label: "Seamless Group Experience",
            text: "Travel together, arrive together, and enjoy the entire night without coordinating multiple vehicles.",
          },
          {
            label: "Guaranteed On-Time Return",
            text: "Your chauffeur is ready when prom ends—ensuring a safe, smooth, and stress-free ride home.",
          },
        ],
      },
      {
        type: "cta",
        title: "Prom Weekend Booking",
        text: "Prom Night, Done Right — Reserve Your Chauffeur Now.",
        buttonText: "Book Prom Service",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 11,
    title: "Concerts",
    slug: "concerts",
    tagline: "No parking • Smooth post-show pickup",
    description:
      "Chauffeured concert transportation with strategic drop-offs and coordinated pickups to avoid congestion and long waits after the show.",
    icon: "/images/cards.png",
    image: "/images/concert.jpg",
    longDescription: `
Concert nights bring heavy traffic and post-show gridlock. We plan transportation around venue flow so you can arrive comfortably and exit without the chaos.

Your chauffeur coordinates drop-off and pickup timing so you’re not stuck in surge pricing, endless lines, or confusing pickup zones.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Concert Night Logistics",
        note: "We plan drop-off and pickup so your night ends smoothly.",
        items: [
          {
            title: "Drop-Off Planning",
            text: "Avoid the worst congestion",
            image: "/images/busdrop.jpg",
          },
          {
            title: "Pickup Coordination",
            text: "Clear meeting points after the show",
            image: "/images/buspick.jpg",
          },
          {
            title: "Group Rides",
            text: "Keep everyone together",
            image: "/images/group.jpg",
          },
          {
            title: "Late-Night Return",
            text: "Safe ride home included",
            image: "/images/assure.jpg",
          },
        ],
      },
      {
        type: "imageText",
        title: "Skip Gridlock. Keep the Vibe.",
        image: "/images/love.jpg",
        bg: "dark",
        reverse: true,
        text:
          "We coordinate pickups around crowd flow so you’re not stuck waiting in confusion while everyone fights for rideshare.",
        bullets: [
          "Clear pickup location",
          "Planned timing windows",
          "Group-friendly service",
          "Comfortable ride home",
        ],
      },
      {
        type: "highlights",
        title: "Concert Transportation Benefits",
        items: [
          "Strategic venue drop-off locations",
          "Coordinated pickup after the show",
          "Group-friendly transportation",
          "Late-night safe return service",
          "Comfortable ride before and after",
        ],
      },
      {
        type: "logistics",
        title: "Post-Show Pickup, Simplified",
        items: [
          {
            label: "Clear Meeting Point",
            text: "We set a pickup plan that makes it easy to reconnect after the show.",
          },
          {
            label: "Timing Windows",
            text: "Pickup timing is planned around crowd flow and traffic control.",
          },
          {
            label: "Traffic Avoidance",
            text: "Chauffeurs familiar with venue exits and congestion patterns.",
          },
          {
            label: "No Surges, No Waiting",
            text: "Skip rideshare pricing spikes and long pickup delays.",
          },
        ],
      },
      {
        type: "cta",
        title: "Heading to a Concert?",
        text: "Reserve ahead and enjoy the show — we’ll handle the traffic and pickup plan.",
        buttonText: "Book Concert Ride",
        buttonLink: "/booking",
      },
    ],
  },

  {
    id: 14,
    title: "Festival & Cultural Event Transportation",
    slug: "festival-event-transportation",
    tagline: "Atlanta festival logistics • Group coordination",
    description:
      "Luxury chauffeur service for Atlanta festivals and cultural celebrations — planned drop-offs, scheduled pickups, and effortless coordination for groups and VIP guests.",
    icon: "/images/people.png",
    image: "/images/carnival.jpg",
    longDescription: `
Atlanta’s festival season brings huge crowds, limited parking, and traffic bottlenecks — especially around high-demand venues like Piedmont Park and major city corridors.

We provide premium event transportation built for real festival logistics: route planning around closures, strategic drop-offs, staged pickup locations, and a smooth experience for groups.

Whether you’re attending a cultural festival, a city celebration, or a packed weekend event, we make the transportation side feel effortless.
    `,
    sections: [
      {
        type: "mediaStrip",
        title: "Festival Transportation Coverage",
        note:
          "We plan routes and pickup points around closures, crowds, and heavy traffic.",
        items: [
          {
            title: "Piedmont Park Events",
            text: "Crowd-aware staging points",
            image: "/images/event.jpg",
          },
          {
            title: "Group Coordination",
            text: "One plan for your entire party",
            image: "/images/val.jpg",
          },
          {
            title: "VIP Arrivals",
            text: "Smooth drop-off experience",
            image: "/images/dow.jpg",
          },
          {
            title: "Late-Night Returns",
            text: "Safe ride home included",
            image: "/images/late.jpg",
          },
        ],
      },
      {
        type: "events",
        title: "Atlanta Events We Commonly Service",
        note:
          "Event names and dates can vary year-to-year. We plan around your venue, time, and schedule.",
        items: [
          { name: "Cinco de Mayo Festival (Piedmont Park)", season: "May" },
          {
            name: "Atlanta Jazz Festival (Piedmont Park)",
            season: "Memorial Day Weekend",
          },
          { name: "One Musicfest", season: "Fall" },
          { name: "Atlanta Film Festival & premiere nights", season: "Spring" },
          { name: "Hispanic Heritage celebrations (ATL area)", season: "Sep–Oct" },
        ],
      },
      {
        type: "imageText",
        title: "Crowds, Closures, and Chaos — Handled",
        image: "/images/assure.jpg",
        bg: "dark",
        reverse: false,
        text:
          "Festival weekends bring road closures and congestion. We plan around it — with staging points, timing windows, and clear pickup instructions.",
        bullets: [
          "Closure-aware routing",
          "Staged pickup points",
          "Group-friendly planning",
          "Comfortable return ride",
        ],
      },
      {
        type: "highlights",
        title: "Ideal For",
        items: [
          "Cinco de Mayo celebrations and cultural festivals",
          "Hispanic Heritage Month events and community gatherings",
          "Music festivals, park festivals, and city events",
          "Group outings with coordinated pickups",
          "VIP arrivals and discreet departures",
          "Late-night return service and scheduled rides",
        ],
      },
      {
        type: "logistics",
        title: "How We Make Festival Transportation Easy",
        items: [
          {
            label: "Smart Drop-Offs",
            text:
              "We use staging points that avoid closures, traffic bottlenecks, and parking congestion.",
          },
          {
            label: "Scheduled Pickups",
            text:
              "Pre-planned pickup windows and backup meeting points — no confusion after the event.",
          },
          {
            label: "Group Coordination",
            text:
              "One plan for your entire party so everyone moves together smoothly.",
          },
          {
            label: "Comfort & Safety",
            text:
              "Enjoy the celebration and ride home comfortably with a professional chauffeur.",
          },
        ],
      },
      {
        type: "cta",
        title: "Need Festival Transportation in Atlanta?",
        text:
          "Tell us the event, venue, and pickup time — we’ll handle route planning and timing.",
        buttonText: "Request a Quote",
        buttonLink: "/contact",
      },
    ],
  },
];

export default servicesData;