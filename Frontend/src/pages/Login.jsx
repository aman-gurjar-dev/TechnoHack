import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { authService } from "../services/authService";
import { FaGoogle, FaGithub } from "react-icons/fa";
import bg2 from "../assets/bg2.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Attempting login with role:", isAdmin ? "admin" : "user");
      const response = await authService.login({
        ...formData,
        role: isAdmin ? "admin" : "user",
      });
      console.log("Login response:", response);

      if (isAdmin) {
        // For admin login attempt
        if (response.user && response.user.role === "admin") {
          console.log("Admin login successful, redirecting to admin dashboard");
          toast.success("Welcome back, Admin!");
          navigate("/admin/dashboard");
        } else {
          console.log("Admin login failed: user is not an admin");
          toast.error("Invalid admin credentials");
        }
      } else {
        // For regular user login
        if (response.user) {
          console.log("User login successful, redirecting to dashboard");
          toast.success("Welcome back!");
          navigate("/dashboard");
        } else {
          console.log("User login failed");
          toast.error("Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setFormData({
      email: "admin@example.com",
      password: "admin123",
    });
  };

  const handleRegularLogin = () => {
    setIsAdmin(false);
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${bg2})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#49478C] p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isAdmin ? "Admin Login" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {!isAdmin ? (
            <button
              onClick={handleAdminLogin}
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Login as Admin
            </button>
          ) : (
            <button
              onClick={handleRegularLogin}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login as User
            </button>
          )}
          <p className="text-white text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
            {" or "}
            <Link
              to="/admin/signup"
              className="text-red-400 hover:text-red-300"
            >
              Register as Admin
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
