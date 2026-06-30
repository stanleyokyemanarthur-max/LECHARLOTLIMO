import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

/**
 * API instance (production-safe)
 */
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

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("carFilters");
    return saved
      ? JSON.parse(saved)
      : { search: "", type: "All", status: "All" };
  });

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

 useEffect(() => {
  const fetchCars = async () => {
    try {
      const { data } = await api.get("/api/cars", {
        headers: authHeaders,
      });

      setCars(data);
    } catch (err) {
      console.error("Fetch cars failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    fetchCars();
  } else {
    setLoading(false);
  }
}, [token, authHeaders]);
  /**
   * FETCH CARS
   */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get("/api/cars", {
          headers: authHeaders,
        });
        setCars(data);
      } catch (err) {
        console.error("Fetch cars failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchCars();
  }, [userInfo, authHeaders]);


  useEffect(() => {
  if (editingCar) {
    setForm({
      ...initialForm,
      ...editingCar,
      image: null, // important (file can't be prefilled)
    });
    setShowForm(true);
  }
}, [editingCar]);
  /**
   * FORM HANDLER
   */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  /**
   * RESET FORM
   */
  const resetForm = () => {
    setForm(initialForm);
    setEditingCar(null);
    setShowForm(false);
  };

  /**
   * CREATE / UPDATE CAR
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = new FormData();

     Object.entries(form).forEach(([key, value]) => {
  if (value === null || value === undefined) return;

  if (key === "rateMultiplier" || key === "perMileRate") {
    payload.append(key, Number(value));
  } else if (key === "totalUnits" || key === "seats") {
    payload.append(key, Number(value));
  } else {
    payload.append(key, value);
  }
});

      let res;

      if (editingCar) {
        res = await api.put(
          `/api/cars/${editingCar._id}`,
          payload,
          { headers: authHeaders }
        );

        setCars((prev) =>
          prev.map((c) =>
            c._id === editingCar._id ? res.data : c
          )
        );
      } else {
        res = await api.post("/api/cars", payload, {
          headers: authHeaders,
        });

        setCars((prev) => [...prev, res.data]);
      }

      resetForm();
    } catch (err) {
      console.error("Save car failed:", err);
      alert(err?.response?.data?.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * DELETE CAR
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    setActionLoading(true);

    try {
      await api.delete(`/api/cars/${id}`, {
        headers: authHeaders,
      });

      setCars((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * FILTERING (optimized)
   */
  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      const matchSearch = c.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchType =
        filters.type === "All" || c.type === filters.type;

      const matchStatus =
        filters.status === "All" || c.status === filters.status;

      return matchSearch && matchType && matchStatus;
    });
  }, [cars, filters]);

  if (loading) {
    return (
      <div className="text-[#D4AF37] flex justify-center items-center min-h-screen">
        Loading fleet...
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6">
        Fleet Management
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          placeholder="Search..."
          className="p-2 bg-gray-800 text-white rounded"
        />

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
        >
          <option>All</option>
          <option>SUV</option>
          <option>Luxury</option>
          <option>Sedan</option>
          <option>Economy</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option>All</option>
          <option>available</option>
          <option>unavailable</option>
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="ml-auto bg-[#D4AF37] px-4 py-2 rounded"
        >
          + Add Car
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-white">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th>Car</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Fleet</th>
              <th>Units</th>
              <th>Rate</th>
              <th>Multiplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCars.map((car) => (
              <tr key={car._id} className="border-b border-gray-700">

                <td className="flex items-center gap-2">
                  <img
                    src={car.image}
                    className="w-10 h-8 rounded object-cover"
                  />
                  {car.name}
                </td>

                <td>{car.type}</td>
                <td>{car.seats}</td>

                <td className="text-yellow-400">
                  {car.fleetKey || "—"}
                </td>

                <td>{car.totalUnits || 1}</td>

                <td>${car.perMileRate}</td>

                <td>{car.rateMultiplier || 1}</td>

                <td>{car.status}</td>

                <td className="flex gap-2">
                  <button onClick={() => setShowDetails(car)}>View</button>
                  <button onClick={() => setEditingCar(car)}>Edit</button>
                  <button onClick={() => handleDelete(car._id)}>Delete</button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded w-[400px]"
          >
            <h2 className="text-[#D4AF37] mb-4">
              {editingCar ? "Edit Car" : "Add Car"}
            </h2>

            {Object.keys(initialForm).map((key) => (
              <input
                key={key}
                name={key}
                type={key === "image" ? "file" : "text"}
                onChange={handleChange}
                placeholder={key}
                className="w-full mb-2 p-2 bg-gray-800 text-white"
              />
            ))}

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