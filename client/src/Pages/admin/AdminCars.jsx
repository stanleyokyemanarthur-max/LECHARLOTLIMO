import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lecharlotlimo-aucd.onrender.com",
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

  // =============================
  // FETCH CARS
  // =============================
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

  // =============================
  // OPEN EDIT MODE
  // =============================
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

  // =============================
  // HANDLE INPUT
  // =============================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // =============================
  // RESET FORM
  // =============================
  const resetForm = () => {
    setForm(initialForm);
    setEditingCar(null);
    setShowForm(false);
  };

  // =============================
  // CREATE / UPDATE
  // =============================
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
      console.error("Save failed:", err);
      alert(err?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    try {
      await api.delete(`/api/fleet/${id}`, {
        headers: authHeaders,
      });

      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // =============================
  // FILTER
  // =============================
  const filteredCars = useMemo(() => {
    return cars;
  }, [cars]);

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <div className="text-[#D4AF37] flex justify-center items-center min-h-screen">
        Loading fleet...
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
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
        className="mb-4 bg-[#D4AF37] px-4 py-2 rounded text-black font-bold"
      >
        + Add Car
      </button>

      {/* TABLE */}
      <table className="w-full text-sm border border-gray-700">
        <thead className="bg-[#D4AF37] text-black">
          <tr>
            <th>Car</th>
            <th>Type</th>
            <th>Seats</th>
            <th>Fleet</th>
            <th>Rate</th>
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
              <td>${car.perMileRate}</td>
              <td>{car.status}</td>

              <td className="flex gap-2 p-2">
                <button onClick={() => setShowDetails(car)}>View</button>
                <button onClick={() => setEditingCar(car)}>Edit</button>
                <button onClick={() => handleDelete(car._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= VIEW MODAL ================= */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded w-[400px]">
            <h2 className="text-[#D4AF37] text-xl mb-3">
              {showDetails.name}
            </h2>

            <img
              src={showDetails.image}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <p>Type: {showDetails.type}</p>
            <p>Seats: {showDetails.seats}</p>
            <p>Fleet: {showDetails.fleetKey}</p>
            <p>Rate: ${showDetails.perMileRate}</p>
            <p>Status: {showDetails.status}</p>

            <button
              onClick={() => setShowDetails(null)}
              className="mt-4 bg-red-500 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded w-[400px]"
          >
            <h2 className="text-[#D4AF37] mb-4">
              {editingCar ? "Edit Car" : "Add Car"}
            </h2>

            {/* NAME */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            {/* TYPE */}
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mb-2 p-2 bg-gray-800"
            >
              <option>SUV</option>
              <option>Luxury</option>
              <option>Sedan</option>
              <option>Economy</option>
            </select>

            {/* SEATS */}
            <input
              name="seats"
              value={form.seats}
              onChange={handleChange}
              placeholder="Seats"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            {/* RATE */}
            <input
              name="perMileRate"
              value={form.perMileRate}
              onChange={handleChange}
              placeholder="Rate"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            {/* FLEET KEY */}
            <input
              name="fleetKey"
              value={form.fleetKey}
              onChange={handleChange}
              placeholder="Fleet Key"
              className="w-full mb-2 p-2 bg-gray-800"
            />

            {/* IMAGE */}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full mb-2"
            />

            <div className="flex justify-end gap-2">
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