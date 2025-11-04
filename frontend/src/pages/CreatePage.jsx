import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !dueDate || !priority || !status) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", { title, content, status, dueDate, priority });
      toast.success("Task created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating task", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating tasks too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Tasks</span>
        </Link>

        {/* Card */}
        <div className="bg-[#111] border border-emerald-500/20 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all p-8">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-6">
            Create New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                placeholder="Task Title"
                className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-gray-100 placeholder-gray-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                placeholder="Describe your task..."
                className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-3 h-28 resize-none focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-gray-100 placeholder-gray-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-gray-100"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Priority
                </label>
                <select
                  className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-gray-100"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-gray-100"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg text-white font-semibold transition-colors"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
