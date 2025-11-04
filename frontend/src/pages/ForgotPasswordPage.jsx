import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent — check your email");
      setSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-md bg-[#111] border border-emerald-500/20 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
        <h2 className="text-3xl font-semibold text-center text-emerald-400 mb-6">
          Forgot Password
        </h2>

        {!sent ? (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  required
                  className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 pl-10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
                <Mail
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-center text-gray-300">
            If an account exists with that email, a reset link has been sent.
          </p>
        )}

        <div className="text-center mt-6 text-sm text-gray-400">
          <Link
            to="/login"
            className="font-medium text-emerald-400 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
