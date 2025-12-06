import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromToken } from "./slices/authSlice.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Components/Nav";
import Index from "./Pages/Index";
import About from "./Pages/About";
import CarsDetails from "./Pages/CarsDetails";
import BookingCancelled from "./Pages/BookingCancelled";
import Footer from "./Components/Footer";
import Contact from "./Pages/Contact";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import MyBookings from "./Pages/MyBookings";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import DriverDashboard from "./Pages/driver/DriverDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import DriverLayout from "./Pages/driver/DriverLayout";
import AdminRoute from "./Components/AdminRoute";
import AdminBookings from "./Pages/admin/AdminBookings";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminCars from "./Pages/admin/AdminCars";
import BookingSuccess from "./Pages/BookingSuccess"; // ✅ fixed capitalization
import ReservationForm from "./Pages/ReservationForm";
import ReservationPage from "./Pages/ReservationPage";
import CarDetails from "./Pages/CarDetails";
import SelectCar from "./Pages/SelectCar";
import FleetPage from "./Pages/FleetPage";
import FleetDetails from "./Pages/FleetDetails.jsx";
import Services from "./Pages/Services.jsx";
import ServiceDetails from "./Pages/ServiceDetails.jsx";
import AllServices from "./Pages/AllServices.jsx";
import FinalDetails from "./Pages/FinalDetails.jsx";
import VerifyOtp from "./Pages/VerifyOtp.jsx";
import EnableAuthenticator from "./Pages/EnableAuthenticator.jsx";
import VerifyTOTPLogin from "./Pages/VerifyTOTPLogin.jsx"
import ResetTOTP from "./Pages/ResetTOTP.jsx";
import LostAuthenticator from "./Pages/LostAuthenticator.jsx";


function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const status = useSelector((s)=>s.auth.status)


  useEffect(() => {
    if (token && !userInfo) {
      dispatch(fetchUserFromToken(token));
    }
  }, [token,userInfo, dispatch]);

  return (
    <Router>
      <Nav />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/car/:id" element={<CarsDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<AllServices />} />
        <Route path="/services/:slug" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation-form" element={<ReservationForm />} />
        <Route path="/reserve" element={<ReservationPage />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/select-car" element={<SelectCar />} />
        <Route path="/service/:slug" element={<ServiceDetails />} />
        <Route path="/final-details" element={<FinalDetails />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/fleet/:slug" element={<FleetDetails />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/enableauthenticator" element={<EnableAuthenticator />} />
        <Route path="/verify-totp-login" element={<VerifyTOTPLogin />} />
        <Route path="/lost-authenticator" element={<LostAuthenticator />} />
        <Route path="/reset-totp/:token" element={<ResetTOTP />} />






        {/* Protected routes */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mybookings" element={<ProtectedRoute allowedRoles={["customer"]}>
          <MyBookings />
        </ProtectedRoute>} />


        {/* Booking success route */}
        <Route path="/booking-success" element={<BookingSuccess />} />

        <Route path="/booking-cancelled" element={<BookingCancelled />} />



        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout/>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="bookings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBookings /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="cars" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCars /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
