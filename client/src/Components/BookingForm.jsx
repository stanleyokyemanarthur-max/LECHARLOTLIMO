import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Autocomplete } from "@react-google-maps/api";

const BookingForm = ({ selectedCarType, setSelectedCarType }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickUpDateTime, setPickUpDateTime] = useState(null);
  const [returnDateTime, setReturnDateTime] = useState(null);

  const datePickerRef = useRef(null);
  const returnPickerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      carType: selectedCarType,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      pickupDateTime: pickUpDateTime,
      returnDateTime: returnDateTime,
    });
    // 🔗 Later: send to backend for availability check
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1f1f1f] text-white w-[90%] max-w-[1200px] mx-auto mt-[70px] rounded-3xl px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shadow-lg z-50"
    >
      {/* ✅ Car Type Dropdown */}
      <div className="relative w-full lg:w-auto px-4 py-3 group border-r border-gray-600">
        <button
          type="button"
          className="flex items-center gap-2 w-full justify-between text-gray-400"
        >
          {selectedCarType}
          <i className="ri-arrow-down-s-line text-[#d8c305c5]"></i>
        </button>
        <div className="absolute top-[110%] left-8 w-48 bg-[#1f1f1f] border border-[#d8c305c5] rounded-sm shadow-md opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 ease-out z-50">
          <ul className="divide-y divide-gray-700">
            {["Luxury", "SUV", "Economy"].map((type) => (
              <li
                key={type}
                onClick={() => setSelectedCarType(type)}
                className="px-4 py-2 hover:bg-[#d8c305c5] transition cursor-pointer"
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ✅ Pickup Location */}
      <div className="relative w-full px-4 py-3 border-r border-gray-600">
        <label className="block mb-1 text-gray-400 text-sm">Pickup Location</label>
        <Autocomplete
          onLoad={(autocomplete) => (window.pickupAutocomplete = autocomplete)}
          onPlaceChanged={() => {
            const place = window.pickupAutocomplete.getPlace();
            setPickup(place.formatted_address || place.name);
          }}
        >
          <input
            type="text"
            placeholder="Enter pickup"
            className="w-full bg-transparent outline-none border-b border-gray-600 py-2 text-white placeholder-gray-400"
          />
        </Autocomplete>
      </div>

      {/* ✅ Pickup Date & Time */}
      <div className="px-4 py-3 border-r border-gray-600">
        <label className="block mb-1 text-gray-400 text-sm">Pickup Date & Time</label>
        <div className="relative w-full">
          <DatePicker
            ref={datePickerRef}
            selected={pickUpDateTime}
            onChange={(date) => setPickUpDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30} // every 30 mins
            dateFormat="MM/dd/yyyy h:mm aa"
            className="w-full bg-transparent outline-none border-b border-gray-600 py-2 text-white placeholder-gray-400 pr-10"
            placeholderText="Select date & time"
            calendarClassName="bg-[#1f1f1f] text-white border border-gray-600 rounded-md shadow-md"
            popperPlacement="bottom"
          />
          <i className="ri-calendar-line text-[#d8c305c5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        </div>
      </div>

      {/* ✅ Dropoff Location */}
      <div className="relative w-full px-4 py-3 border-r border-gray-600">
        <label className="block mb-1 text-gray-400 text-sm">Dropoff Location</label>
        <Autocomplete
          onLoad={(autocomplete) => (window.dropoffAutocomplete = autocomplete)}
          onPlaceChanged={() => {
            const place = window.dropoffAutocomplete.getPlace();
            setDropoff(place.formatted_address || place.name);
          }}
        >
          <input
            type="text"
            placeholder="Enter dropoff"
            className="w-full bg-transparent outline-none border-b border-gray-600 py-2 text-white placeholder-gray-400"
          />
        </Autocomplete>
      </div>

      {/* ✅ Return Date & Time */}
      <div className="px-4 py-3">
        <label className="block mb-1 text-gray-400 text-sm">Return Date & Time</label>
        <div className="relative w-full">
          <DatePicker
            ref={returnPickerRef}
            selected={returnDateTime}
            onChange={(date) => setReturnDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MM/dd/yyyy h:mm aa"
            className="w-full bg-transparent outline-none border-b border-gray-600 py-2 text-white placeholder-gray-400 pr-10"
            placeholderText="Select date & time"
            calendarClassName="bg-[#1f1f1f] text-white border border-gray-600 rounded-md shadow-md"
            popperPlacement="bottom"
          />
          <i className="ri-calendar-line text-[#d8c305c5] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        </div>
      </div>

      {/* ✅ Submit Button */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-5 flex justify-center">
        <button
          type="submit"
          className="mt-2 px-6 py-3 bg-[#d8c305c5] text-white rounded-md hover:bg-[#3d3704c5] transition duration-300"
        >
          Search Car
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
