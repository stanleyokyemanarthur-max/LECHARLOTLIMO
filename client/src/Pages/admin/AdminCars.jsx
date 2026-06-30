import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://lecharlotlimo-aucd.onrender.com",
});

export default function AdminCars() {
  const { token, userInfo } = useSelector((state) => state.auth);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [editingCar, setEditingCar] = useState(null);

  const initialForm = {
    name: "",
    type: "SUV",
    seats: "",
    transmission: "Automatic",
    fuel: "",
    speed: "",
    perMileRate: "",
    rateMultiplier: 1,
    totalUnits: 1,
    fleetKey: "",
    image: null,
    status: "available",
  };

  const [form, setForm] = useState(initialForm);

  const authHeaders = useMemo(() => {
    return {
      Authorization: `Bearer ${userInfo?.token}`,
    };
  }, [userInfo]);

  // FETCH CARS
  useEffect(() => {
    if (!token) return;

    const fetchCars = async () => {
      try {
        const { data } = await api.get("/api/fleet", {
          headers: authHeaders,
        });
        setCars(data);
      } catch (err) {
        console.error("Fetch cars failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [token]);

  // EDIT MODE
  useEffect(() => {
    if (editingCar) {
      setForm({
        name: editingCar.name || "",
        type: editingCar.type || "SUV",
        seats: editingCar.seats || "",
        transmission: editingCar.transmission || "Automatic",
        fuel: editingCar.fuel || "",
        speed: editingCar.speed || "",
        perMileRate: editingCar.perMileRate || "",
        rateMultiplier: editingCar.rateMultiplier || 1,
        totalUnits: editingCar.totalUnits || 1,
        fleetKey: editingCar.fleetKey || "",
        image: null,
        status: editingCar.status || "available",
      });
      setShowForm(true);
    }
  }, [editingCar]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingCar(null);
    setShowForm(false);
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (
          key === "perMileRate" ||
          key === "rateMultiplier" ||
          key === "totalUnits" ||
          key === "seats"
        ) {
          payload.append(key, Number(value));
        } else {
          payload.append(key, value);
        }
      });

      let res;

      if (editingCar) {
        res = await api.put(`/api/fleet/${editingCar._id}`, payload, {
          headers: authHeaders,
        });

        setCars((prev) =>
          prev.map((c) => (c._id === editingCar._id ? res.data : c))
        );
      } else {
        res = await api.post("/api/fleet", payload, {
          headers: authHeaders,
        });

        setCars((prev) => [...prev, res.data]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    await api.delete(`/api/fleet/${id}`, { headers: authHeaders });

    setCars((prev) => prev.filter((c) => c._id !== id));
  };

  const filteredCars = useMemo(() => cars, [cars]);

  if (loading) {
    return (
      <div className="text-[#D4AF37] flex justify-center items-center min-h-screen">
        Loading fleet...
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 text-white overflow-x-hidden">
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6">
        Fleet Management
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          setEditingCar(null);
          setForm(initialForm);
          setShowForm(true);
        }}
        className="mb-4 bg-[#D4AF37] px-4 py-2 rounded text-black font-bold w-full sm:w-auto"
      >
        + Add Car
      </button>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-3 sm:hidden">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex gap-3 items-center">
              <img
                src={car.image}
                className="w-14 h-12 object-cover rounded"
              />
              <div>
                <p className="font-bold">{car.name}</p>
                <p className="text-xs text-gray-400">{car.type}</p>
              </div>
            </div>

            <div className="text-sm mt-2 text-gray-300 space-y-1">
              <p>Seats: {car.seats}</p>
              <p>Fleet: {car.fleetKey}</p>
              <p>Units: {car.totalUnits}</p>
              <p>Rate: ${car.perMileRate}</p>
              <p>Status: {car.status}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setShowDetails(car)}
                className="px-3 py-1 bg-blue-600 rounded text-xs"
              >
                View
              </button>

              <button
                onClick={() => setEditingCar(car)}
                className="px-3 py-1 bg-yellow-500 text-black rounded text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(car._id)}
                className="px-3 py-1 bg-red-600 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= TABLE (UNCHANGED STRUCTURE) ================= */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border border-gray-700 min-w-[900px]">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th>Car</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Fleet</th>
              <th>Total Units</th>
              <th>Rate Multiplier</th>
              <th>Per Mile Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCars.map((car) => (
              <tr key={car._id} className="border-t border-gray-700">
                <td className="flex items-center gap-2 p-2">
                  <img
                    src={car.image}
                    className="w-10 h-8 object-cover rounded"
                  />
                  {car.name}
                </td>

                <td>{car.type}</td>
                <td>{car.seats}</td>
                <td>{car.fleetKey}</td>
                <td>{car.totalUnits}</td>
                <td>{car.rateMultiplier}</td>
                <td>${car.perMileRate}</td>
                <td>{car.status}</td>

                <td className="flex gap-2 p-2">
                  <button onClick={() => setShowDetails(car)}>View</button>
                  <button onClick={() => setEditingCar(car)}>Edit</button>
                  <button onClick={() => handleDelete(car._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3">
          <div className="bg-gray-900 p-5 rounded w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-[#D4AF37] text-xl mb-3">
              {showDetails.name}
            </h2>

            <img
              src={showDetails.image}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <p>Type: {showDetails.type}</p>
            <p>Seats: {showDetails.seats}</p>
            <p>Transmission: {showDetails.transmission}</p>
            <p>Fuel: {showDetails.fuel}</p>
            <p>Speed: {showDetails.speed}</p>
            <p>Fleet: {showDetails.fleetKey}</p>
            <p>Units: {showDetails.totalUnits}</p>
            <p>Multiplier: {showDetails.rateMultiplier}</p>
            <p>Rate: ${showDetails.perMileRate}</p>
            <p>Status: {showDetails.status}</p>

            <button
              onClick={() => setShowDetails(null)}
              className="mt-4 bg-red-500 px-3 py-1 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-4 sm:p-6 rounded w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-[#D4AF37] mb-2">
              {editingCar ? "Edit Car" : "Add Car"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="input"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input"
            >
              <option>SUV</option>
              <option>Luxury</option>
              <option>Sedan</option>
              <option>Economy</option>
            </select>

            <input
              name="seats"
              type="number"
              value={form.seats}
              onChange={handleChange}
              className="input"
              placeholder="Seats"
            />

            <input
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="input"
            />

            <input
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
              className="input"
            />

            <input
              name="speed"
              value={form.speed}
              onChange={handleChange}
              className="input"
            />

            <input
              name="fleetKey"
              value={form.fleetKey}
              onChange={handleChange}
              className="input"
            />

            <input
              name="totalUnits"
              type="number"
              value={form.totalUnits}
              onChange={handleChange}
              className="input"
            />

            <input
              name="rateMultiplier"
              type="number"
              value={form.rateMultiplier}
              onChange={handleChange}
              className="input"
            />

            <input
              name="perMileRate"
              type="number"
              value={form.perMileRate}
              onChange={handleChange}
              className="input"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="input"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={resetForm}>
                Cancel
              </button>

              <button disabled={actionLoading}>
                {actionLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}