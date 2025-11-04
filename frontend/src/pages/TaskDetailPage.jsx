import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  Save,
  Calendar,
  ClipboardList,
  Flag,
  FileText,
} from "lucide-react";

const TaskDetailPage = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.log("Error in fetching task", error);
        toast.error("Failed to fetch the task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleSave = async () => {
    if (!task.title.trim() || !task.content.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/tasks/${id}`, task);
      toast.success("Task updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the task:", error);
      toast.error("Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] text-emerald-400">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-[#111] border border-emerald-500/20 rounded-2xl p-8 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft size={18} />
            <span>Back to Tasks</span>
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-600/10 rounded-lg transition"
          >
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>

        <form className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
              <ClipboardList size={16} className="text-emerald-400" />
              Title
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              placeholder="Enter task title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
              <FileText size={16} className="text-emerald-400" />
              Content
            </label>
            <textarea
              value={task.content}
              onChange={(e) => setTask({ ...task, content: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 h-32 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              placeholder="Write task details..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
              <ClipboardList size={16} className="text-emerald-400" />
              Status
            </label>
            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-400" />
              Due Date
            </label>
            <input
              type="date"
              value={task.dueDate?.slice(0, 10)}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm mb-2 text-gray-300 flex items-center gap-2">
              <Flag size={16} className="text-emerald-400" />
              Priority
            </label>
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-emerald-500/20 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetailPage;
