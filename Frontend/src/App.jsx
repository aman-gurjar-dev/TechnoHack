import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import OrganizeEvent from "./pages/OrganizeEvent";
import Signup from "./pages/Signup";
import AdminEvents from "./pages/AdminEvents";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSignup from "./pages/AdminSignup";
import AdminClubs from "./pages/AdminClubs";
import { Toaster } from "react-hot-toast";
import Clubs from "./pages/Clubs";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/events" element={<Events />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/organize-event" element={<OrganizeEvent />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/clubs" element={<AdminClubs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
