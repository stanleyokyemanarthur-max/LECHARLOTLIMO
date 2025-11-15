import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminCars() {
  const { userInfo } = useSelector((state) => state.auth);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null); // 👈 for View Details modal
  const [editingCar, setEditingCar] = useState(null);

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("carFilters");
    return saved
      ? JSON.parse(saved)
      : { search: "", type: "All", status: "All" };
  });

  const [form, setForm] = useState({
    name: "",
    type: "SUV",
    seats: "",
    transmission: "Automatic",
    fuel: "",
    speed: "",
    perMileRate: "",
    image: "",
    status: "available",
  });

  useEffect(() => {
    localStorage.setItem("carFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars", {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userInfo?.token) fetchCars();
  }, [userInfo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCar) {
        const res = await axios.put(
          `http://localhost:5000/api/cars/${editingCar._id}`,
          form,
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        setCars((prev) =>
          prev.map((c) => (c._id === editingCar._id ? res.data : c))
        );
      } else {
        const res = await axios.post("http://localhost:5000/api/cars", form, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setCars((prev) => [...prev, res.data]);
      }

      setShowForm(false);
      setEditingCar(null);
      setForm({
        name: "",
        type: "SUV",
        seats: "",
        transmission: "Automatic",
        fuel: "",
        speed: "",
        perMileRate: "",
        image: "",
        status: "available",
      });
    } catch (err) {
      console.error("Error saving car:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting car:", err);
    }
  };

  const filteredCars = cars.filter((c) => {
    const matchSearch = c.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchType =
      filters.type === "All" || c.type === filters.type;
    const matchStatus =
      filters.status === "All" || c.status === filters.status;
    return matchSearch && matchType && matchStatus;
  });

  if (loading)
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading cars...
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#d8c305c5] mb-6">Manage Cars</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option>All</option>
          <option>SUV</option>
          <option>Luxury</option>
          <option>Economy</option>
          <option>Sedan</option>
          <option>Sports</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option>All</option>
          <option>available</option>
          <option>unavailable</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="ml-auto bg-[#d8c305c5] hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
        >
          + Add Car
        </button>
      </div>

      {/* Car Table */}
      <table className="min-w-full border border-gray-700 text-sm">
        <thead className="bg-[#d8c305c5] text-black">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Seats</th>
            <th className="px-4 py-2">Transmission</th>
            <th className="px-4 py-2">Fuel</th>
            <th className="px-4 py-2">Speed</th>
            <th className="px-4 py-2">Rate ($/mile)</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.map((car) => (
            <tr key={car._id} className="border-t border-gray-700 hover:bg-gray-800">
              <td className="px-4 py-2">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-16 h-10 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{car.name}</td>
              <td className="px-4 py-2">{car.type}</td>
              <td className="px-4 py-2">{car.seats}</td>
              <td className="px-4 py-2">{car.transmission}</td>
              <td className="px-4 py-2">{car.fuel}</td>
              <td className="px-4 py-2">{car.speed}</td>
              <td className="px-4 py-2">${car.perMileRate}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    car.status === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {car.status}
                </span>
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => setShowDetails(car)}
                  className="px-2 py-1 bg-yellow-600 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    setEditingCar(car);
                    setForm(car);
                    setShowForm(true);
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl mb-4 text-[#d8c305c5] font-semibold">
              {editingCar ? "Edit Car" : "Add New Car"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {["name", "seats", "fuel", "speed", "perMileRate", "image"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
                    required={field !== "speed"}
                  />
                )
              )}

              <div className="flex gap-2">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-1/2 p-2 bg-gray-800 border border-gray-700 text-white rounded"
                >
                  <option>SUV</option>
                  <option>Luxury</option>
                  <option>Economy</option>
                  <option>Sedan</option>
                  <option>Sports</option>
                </select>

                <select
                  name="transmission"
                  value={form.transmission}
                  onChange={handleChange}
                  className="w-1/2 p-2 bg-gray-800 border border-gray-700 text-white rounded"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
              >
                <option>available</option>
                <option>unavailable</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCar(null);
                  }}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d8c305c5] text-black font-semibold rounded"
                >
                  {editingCar ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setShowDetails(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white p-6 rounded-lg max-w-lg w-full"
          >
            <h2 className="text-xl font-bold mb-3 text-[#d8c305c5]">
              {showDetails.name}
            </h2>
            <img
              src={showDetails.image}
              alt={showDetails.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="space-y-1 text-sm">
              <p>
                <strong>Type:</strong> {showDetails.type}
              </p>
              <p>
                <strong>Seats:</strong> {showDetails.seats}
              </p>
              <p>
                <strong>Transmission:</strong> {showDetails.transmission}
              </p>
              <p>
                <strong>Fuel:</strong> {showDetails.fuel}
              </p>
              <p>
                <strong>Speed:</strong> {showDetails.speed || "N/A"}
              </p>
              <p>
                <strong>Rate:</strong> ${showDetails.perMileRate} /mile
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    showDetails.status === "available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {showDetails.status}
                </span>
              </p>
            </div>

            <button
              onClick={() => setShowDetails(null)}
              className="mt-5 px-4 py-2 bg-[#d8c305c5] text-black rounded font-semibold w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
