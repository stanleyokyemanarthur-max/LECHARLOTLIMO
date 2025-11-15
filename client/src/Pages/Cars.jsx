import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

function Cars() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupRef, setPickupRef] = useState(null);
  const [dropoffRef, setDropoffRef] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch cars from backend API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cars"); // 👈 backend endpoint
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("❌ Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // ✅ Build unique categories dynamically
  const categories = [...new Set(cars.map((car) => car.type))];

  // ✅ Handle checkbox changes
  const handleCheckboxChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // ✅ Handle Google Places changes
  const handlePlaceChanged = (ref, setter) => {
    if (ref) {
      const place = ref.getPlace();
      if (place && place.formatted_address) {
        setter(place.formatted_address);
      }
    }
  };

  // ✅ Filter cars based on search, category, pickup/dropoff
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(car.type);

    // You can add pickup/dropoff filters later if backend supports them
    const matchesPickup = pickup === "" || true;
    const matchesDropoff = dropoff === "" || true;

    return matchesSearch && matchesCategory && matchesPickup && matchesDropoff;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-300 text-xl">
        Loading cars...
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <>
        {/* ✅ Banner */}
        <div className="banner-section flex justify-center items-center h-[358px] lg:h-[550px]">
          <div className="banner-section-content text-center z-10">
            <h6 className="uppercase text-sm lg:text-xl text-white font-bricolage">
              BOOK NOW
            </h6>
            <h1 className="text-4xl lg:text-5xl xl:text-8xl font-semibold font-bricolage text-[#d8c305c5]">
              <span className="text-white font-bricolage">Select</span> Luxury Car
            </h1>
          </div>
        </div>

        {/* ✅ Layout */}
        <div className="flex flex-col-reverse md:flex-row gap-8 lg:px-[12%] px-[8%] py-[50px] lg:py-[90px]">
          {/* Sidebar Filters */}
          <div className="w-full sticky top-8 md:w-[300px] bg-[#1e1f22] rounded-2xl p-6 shadow-lg animate-side-left h-full">
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#121212] text-white placeholder:text-[#aaa] border border-gray-600 outline-none"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-semibold text-white font-bricolage text-2xl mb-3">
                Categories
              </h4>
              <ul className="text-md space-y-2 text-gray-400">
                {categories.map((cat) => (
                  <li key={cat} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCheckboxChange(cat)}
                    />
                    <span className="hover:text-white transition-colors duration-300">
                      {cat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pickup */}
            <div className="mb-6">
              <h4 className="font-semibold text-white font-bricolage text-2xl mb-3">
                Pickup Location
              </h4>
              <Autocomplete
                onLoad={(ref) => setPickupRef(ref)}
                onPlaceChanged={() => handlePlaceChanged(pickupRef, setPickup)}
                options={{ componentRestrictions: { country: "us" } }}
              >
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  className="w-full p-3 rounded-lg bg-[#121212] text-white placeholder:text-[#aaa] border border-gray-600 outline-none"
                />
              </Autocomplete>
            </div>

            {/* Dropoff */}
            <div className="mb-6">
              <h4 className="font-semibold text-white font-bricolage text-2xl mb-3">
                Dropoff Location
              </h4>
              <Autocomplete
                onLoad={(ref) => setDropoffRef(ref)}
                onPlaceChanged={() => handlePlaceChanged(dropoffRef, setDropoff)}
                options={{ componentRestrictions: { country: "us" } }}
              >
                <input
                  type="text"
                  placeholder="Enter dropoff location"
                  className="w-full p-3 rounded-lg bg-[#121212] text-white placeholder:text-[#aaa] border border-gray-600 outline-none"
                />
              </Autocomplete>
            </div>
          </div>

          {/* ✅ Cars List */}
          <div className="flex-1 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <div
                    key={car._id}
                    className="car-item group bg-[#1e1f22] relative w-full rounded-lg shadow-md"
                  >
                    {/* Car Image */}
                    <div className="car-image w-full relative h-[250px] overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain md:object-center transition-all duration-300 group-hover:scale-110"
                      />

                      {/* Car Info */}
                      <div className="car-info absolute bottom-0 left-0 p-5 z-10 bg-gradient-to-t from-[#1e1f22] via-[#1e1f22a6] to-transparent">
                        <h4 className="text-2xl md:text-3xl font-bricolage font-semibold text-white">
                          {car.name}
                        </h4>
                        <span className="text-[#d8c305c5] text-xl font-bricolage">
                          {car.type}
                        </span>
                      </div>
                    </div>

                    {/* Car Content */}
                    <div className="car-content p-5 py-10 relative">
                      <ul className="flex gap-3 justify-between items-center flex-wrap">
                        <li className="text-gray-300 text-lg md:text-xl flex items-center">
                          <i className="fa-regular fa-user text-[#d8c305c5] pe-2"></i>
                          {car.seats} Seats
                        </li>
                        <li className="text-gray-300 text-lg md:text-xl flex items-center">
                          <i className="fa-solid fa-cog text-[#d8c305c5] pe-2"></i>
                          {car.transmission}
                        </li>
                        <li className="text-gray-300 text-lg md:text-xl flex items-center">
                          <i className="fa-solid fa-gas-pump text-[#d8c305c5] pe-2"></i>
                          {car.fuel}
                        </li>
                        <li className="text-gray-300 text-lg md:text-xl flex items-center">
                          <i className="fa-solid fa-gauge text-[#d8c305c5] pe-2"></i>
                          {car.speed}
                        </li>
                      </ul>

                      <div className="flex justify-center mt-10">
                        <Link to={`/cars/${car._id}`}>
                          <button className="text-white bg-[#d8c305c5] px-5 py-2 text-lg md:text-xl rounded-full cursor-pointer transition duration-300 hover:bg-[#3d3f41]">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center col-span-2">
                  No cars found matching your criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    </LoadScript>
  );
}

export default Cars;
