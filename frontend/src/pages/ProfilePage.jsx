import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, LogOut, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(
        "/auth/profile",
        { name: formData.name, email: formData.email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Profile updated successfully!");
      setFormData({ name: res.data.name, email: res.data.email });

      setUser(res.data); // ✅ Update context too
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login"); 
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-emerald-400 text-xl">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4 py-10 text-gray-100 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
      <div className="w-full max-w-md bg-[#111] border border-emerald-500/20 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
        <h2 className="text-3xl font-semibold text-center text-emerald-400 mb-8">
          My Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              type="button"
              className="flex items-center gap-2 px-5 py-2 border border-emerald-500/30 text-emerald-400 hover:text-red-400 hover:border-red-400 font-semibold rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
