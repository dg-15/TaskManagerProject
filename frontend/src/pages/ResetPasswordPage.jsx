import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${id}/${token}`, { password });
      toast.success("Password changed successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-md bg-[#111] border border-emerald-500/20 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
        <h2 className="text-3xl font-semibold text-center text-emerald-400 mb-6">
          Reset Password
        </h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              New Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 pl-10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              />
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/70"
                size={18}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-emerald-500 hover:bg-emerald-600 text-white w-full font-semibold rounded-lg py-2 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer text-emerald-400 hover:underline"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
