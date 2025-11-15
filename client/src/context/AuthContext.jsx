import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load from localStorage on refresh
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
      if (savedToken && savedToken !== "undefined") {
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Error loading auth data:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

const login = (userData) => {
  // If shape is { user, token }
  if (userData.user) {
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
  } else {
    // If shape is { _id, name, email, ..., token }
    const { token: authToken, ...userInfo } = userData;
    setUser(userInfo);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", authToken);
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
