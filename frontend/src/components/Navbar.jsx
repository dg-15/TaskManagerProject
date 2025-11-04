import React from "react";
import { Link } from "react-router";
import { PlusIcon, UserIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#0c0c0c] border-b border-emerald-500/20 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
      <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
        {/* Left: App name */}
        <Link
          to="/"
          className="text-3xl font-bold text-emerald-400 font-mono tracking-tight hover:text-emerald-300 transition-colors duration-200"
        >
          TaskMind
        </Link>

        {/* Right: Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/create"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Task</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <span className="text-lg font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#111111] rounded-xl mt-3 w-52 p-2 shadow-lg border border-emerald-500/20"
            >
              <li className="px-3 py-2 text-sm text-gray-300 border-b border-emerald-500/20">
                👋 Hi,{" "}
                <span className="font-semibold text-emerald-400">
                  {user?.name || "User"}
                </span>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-emerald-500/10 rounded-md px-3 py-2 transition-colors"
                >
                  <UserIcon size={16} /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 rounded-md px-3 py-2 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
