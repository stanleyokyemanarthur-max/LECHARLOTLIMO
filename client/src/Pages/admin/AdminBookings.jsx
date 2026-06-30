// src/pages/admin/AdminBookings.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE = "https://lecharlotlimo-aucd.onrender.com";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState([])

  // all | paid_pending | unpaid_pending | pending | confirmed | enroute | completed | cancelled
  const [filter, setFilter] = useState("paid_pending");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setBookings(res.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchBookings();
  }, [userInfo]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/drivers`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setDrivers(res.data || []);
      } catch (e) {
        console.error("Error fetching drivers:", e);
      }
    };

    if (userInfo?.token) fetchDrivers();
  }, [userInfo]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      const updated = res?.data;
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? (updated?._id ? updated : { ...b, status: newStatus }) : b))
      );
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || error.message;
      alert(msg);
      console.error("Error updating status:", error);
    }
  };

  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;

    if (filter === "paid_pending") {
      return bookings.filter((b) => b.status === "pending" && b.paymentStatus === "paid");
    }

    if (filter === "unpaid_pending") {
      return bookings.filter((b) => b.status === "pending" && b.paymentStatus !== "paid");
    }

    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const formatMoney = (n) => Number(n || 0).toFixed(2);

  const formatDateTime = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "—";
    }
  };

  const paymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusPill = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#D4AF37] text-[#503c08]";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "enroute":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const freeBadge = (b) => {
    if (b.isPaid === false) {
      if (b.freeReason === "reward") return "FREE (Reward)";
      if (b.freeReason === "admin") return "FREE (Admin)";
      return "FREE";
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#D4AF37]">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#D4AF37]">Manage Bookings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Focus queue: <span className="text-gray-200">Paid Pending</span> (payment received, awaiting confirmation)
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "paid_pending", label: "Paid Pending" },
          { key: "unpaid_pending", label: "Unpaid Pending" },
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "enroute", label: "En Route" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${filter === f.key ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th className="px-4 py-3 text-left">Car</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Pickup</th>
              <th className="px-4 py-3 text-left">Dropoff</th>
              <th className="px-4 py-3 text-left">Pickup time</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Driver</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="bg-transparent">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => {
                const paymentStatus = b.paymentStatus || "pending";
                const isPaid = paymentStatus === "paid";
                const isFree = b.isPaid === false;
                const canProgress = isPaid || isFree;

                const freeLabel = freeBadge(b);

                return (
                  <tr key={b._id} className="border-t border-gray-700 hover:bg-gray-800/60">
                    <td className="px-4 py-3 text-gray-100">
                      {b.car?.name || b.carSnapshot?.name || "—"}
                      <div className="text-xs text-gray-400">{b.carSnapshot?.category || ""}</div>
                    </td>

                    <td className="px-4 py-3 text-gray-100">
                      {b.user?.name || "—"}
                      <div className="text-xs text-gray-400">{b.user?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-100">
                      {b.user?.phone || "—"}
                      <div className="text-xs text-gray-400">{b.user?.email || ""}</div>
                    </td>

                    <td className="px-4 py-3 text-gray-200">{b.pickupLocation}</td>
                    <td className="px-4 py-3 text-gray-200">{b.dropoffLocation}</td>

                    <td className="px-4 py-3 text-gray-200">{formatDateTime(b.pickupDate)}</td>

                    <td className="px-4 py-3 text-gray-100">${formatMoney(b.totalPrice)}</td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge(paymentStatus)}`}>
                        {paymentStatus}
                      </span>

                      {freeLabel && (
                        <div className="text-xs text-gray-300 mt-1">
                          {freeLabel}
                        </div>
                      )}

                      {b.status === "pending" && isPaid && (
                        <div className="text-xs text-[#D4AF37] mt-1">Paid ✅ awaiting confirmation</div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusPill(b.status)}`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={b.driver?._id || ""}
                        onChange={async (e) => {
                          const driverId = e.target.value || null;
                          try {
                            const res = await axios.put(
                              `${API_BASE}/api/bookings/${b._id}/assign-driver`,
                              { driverId },
                              { headers: { Authorization: `Bearer ${userInfo?.token}` } }
                            );

                            const updated = res.data;
                            setBookings((prev) => prev.map((x) => (x._id === b._id ? updated : x)));
                          } catch (err) {
                            alert(err?.response?.data?.error || err.message);
                          }
                        }}
                        className="bg-gray-700 border border-gray-500 rounded p-2 text-gray-100 w-full"
                      >
                        <option value="">Unassigned</option>
                        {drivers.map((d) => (
                          <option key={d._id} value={d._id}>
                            {d.name} ({d.email})
                          </option>
                        ))}
                      </select>

                      {b.driver?.name && (
                        <div className="text-xs text-gray-400 mt-1">
                          Assigned: {b.driver.name}
                        </div>
                      )}
                    </td>


                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className="bg-gray-700 border border-gray-500 rounded p-2 text-gray-100"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed" disabled={!canProgress}>
                          Confirmed {!canProgress ? "(requires paid/free)" : ""}
                        </option>
                        <option value="enroute" disabled={!canProgress}>
                          En Route {!canProgress ? "(requires paid/free)" : ""}
                        </option>
                        <option value="completed" disabled={b.status === "pending"}>
                          Completed {b.status === "pending" ? "(confirm first)" : ""}
                        </option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {!canProgress && (
                        <div className="text-xs text-red-400 mt-1">
                          Cannot confirm/enroute until payment is <b>paid</b> (backend also blocks this).
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-400 italic">
                  No bookings found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-4">

  {filteredBookings.length > 0 ? (

    filteredBookings.map((b) => {

      const paymentStatus = b.paymentStatus || "pending";
      const isPaid = paymentStatus === "paid";
      const isFree = b.isPaid === false;
      const canProgress = isPaid || isFree;
      const freeLabel = freeBadge(b);

      return (

        <div
          key={b._id}
          className="bg-[#111111] border border-gray-700 rounded-xl p-4"
        >

          <div className="flex justify-between items-start">

            <div>
              <h3 className="font-semibold text-[#D4AF37]">
                {b.car?.name || b.carSnapshot?.name}
              </h3>

              <p className="text-xs text-gray-400">
                {b.carSnapshot?.category}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPill(
                b.status
              )}`}
            >
              {b.status}
            </span>

          </div>

          <div className="mt-4 space-y-2 text-sm">

            <div>
              <span className="text-gray-400">Customer:</span>{" "}
              {b.user?.name}
            </div>

            <div>
              <span className="text-gray-400">Phone:</span>{" "}
              {b.user?.phone}
            </div>

            <div>
              <span className="text-gray-400">Pickup:</span>{" "}
              {b.pickupLocation}
            </div>

            <div>
              <span className="text-gray-400">Dropoff:</span>{" "}
              {b.dropoffLocation}
            </div>

            <div>
              <span className="text-gray-400">Pickup Time:</span>{" "}
              {formatDateTime(b.pickupDate)}
            </div>

            <div>
              <span className="text-gray-400">Total:</span>{" "}
              <span className="font-bold text-[#D4AF37]">
                ${formatMoney(b.totalPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">

              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge(
                  paymentStatus
                )}`}
              >
                {paymentStatus}
              </span>

              {freeLabel && (
                <span className="text-xs text-gray-300">
                  {freeLabel}
                </span>
              )}

            </div>

          </div>

          <div className="mt-5">

            <label className="block text-xs text-gray-400 mb-1">
              Assign Driver
            </label>

            <select
              value={b.driver?._id || ""}
              onChange={async (e) => {

                const driverId = e.target.value || null;

                try {

                  const res = await axios.put(
                    `${API_BASE}/api/bookings/${b._id}/assign-driver`,
                    { driverId },
                    {
                      headers: {
                        Authorization: `Bearer ${userInfo?.token}`,
                      },
                    }
                  );

                  const updated = res.data;

                  setBookings((prev) =>
                    prev.map((x) =>
                      x._id === b._id ? updated : x
                    )
                  );

                } catch (err) {
                  alert(err?.response?.data?.error || err.message);
                }

              }}
              className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg p-2"
            >

              <option value="">Unassigned</option>

              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}

            </select>

          </div>

          <div className="mt-4">

            <label className="block text-xs text-gray-400 mb-1">
              Booking Status
            </label>

            <select
              value={b.status}
              onChange={(e) =>
                handleStatusChange(b._id, e.target.value)
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2"
            >

              <option value="pending">Pending</option>

              <option
                value="confirmed"
                disabled={!canProgress}
              >
                Confirmed
              </option>

              <option
                value="enroute"
                disabled={!canProgress}
              >
                En Route
              </option>

              <option
                value="completed"
                disabled={b.status === "pending"}
              >
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>

      );

    })

  ) : (

    <div className="text-center py-10 text-gray-400">
      No bookings found.
    </div>

  )}

</div>
    </div>
  );
}
