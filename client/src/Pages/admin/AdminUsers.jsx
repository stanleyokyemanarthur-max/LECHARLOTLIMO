// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://lecharlotlimo-aucd.onrender.com/api/users",
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
          }
        );
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchUsers();
  }, [userInfo]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#D4AF37]">
        Loading users...
      </div>
    );

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6">
        Manage Users
      </h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div className="flex flex-wrap gap-2">
          {["all", "admin", "customer", "driver"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                filterRole === role
                  ? "bg-[#D4AF37] text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 text-gray-200 border border-gray-600 rounded-md px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />
      </div>

      {/* ===================== */}
      {/* 📱 MOBILE CARDS VIEW */}
      {/* ===================== */}
      <div className="grid gap-3 sm:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-white">{u.name}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : u.role === "driver"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {u.role}
                </span>
              </div>

              <p className="text-sm text-gray-300">{u.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Birthday:{" "}
                {u.birthday
                  ? new Date(u.birthday).toLocaleDateString()
                  : "—"}
              </p>
              <p className="text-xs text-gray-400">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic">
            No users found.
          </p>
        )}
      </div>

      {/* ===================== */}
      {/* 💻 DESKTOP TABLE VIEW */}
      {/* ===================== */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm table-fixed">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th className="px-4 py-2 w-1/5">Name</th>
              <th className="px-4 py-2 w-1/5">Email</th>
              <th className="px-4 py-2 w-1/5">Role</th>
              <th className="px-4 py-2 w-1/5">Birthday</th>
              <th className="px-4 py-2 w-1/5">Joined</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "driver"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {u.birthday
                      ? new Date(u.birthday).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}