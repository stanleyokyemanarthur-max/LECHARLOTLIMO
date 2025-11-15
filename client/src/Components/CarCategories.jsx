import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Fetch cars from backend instead of Cars.json
const CarCategories = ({ selectedCarType }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cars"); // 👈 change to your backend URL
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("❌ Failed to fetch cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // ✅ Filter cars from API
  const filteredCars =
    selectedCarType && selectedCarType !== "Choose Car Type"
      ? cars.filter(
        (car) => car.type.toLowerCase() === selectedCarType.toLowerCase()
      )
      : cars;

  if (loading) {
    return <p className="text-center text-gray-400">Loading cars...</p>;
  }

  return (
    <div className="car-categories lg:px-[12%] px-[8%] py-[50px] lg:py-[98px]">
      <div className="car-categories-content text-center mb-10 lg:mb-14">
        <p className="uppercase text-sm tracking-[5px] mb-2 text-[#d8c305c5]">
          - Car
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white font-bricolage">
          Choose the Right Car for Your Trip
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCars.map((car) => (
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
              <div className="flex justify-between items-center mt-12">
                <h4 className="text-2xl md:text-4xl font-bold font-bricolage text-white">
                  $5/mile
                </h4>
                <Link to={`/car/${car._id}`}>
                  <button className="text-white bg-[#d8c305c5] px-5 py-2 text-lg md:text-xl rounded-full cursor-pointer transition duration-300 hover:bg-[#3d3f41]">
                    Book Now
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}

        {/* No cars found */}
        {filteredCars.length === 0 && (
          <p className="text-center text-gray-400 col-span-full">
            No cars available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default CarCategories;
