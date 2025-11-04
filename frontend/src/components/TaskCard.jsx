import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const TaskCard = ({ task, setTasks }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // prevent link navigation

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <Link
      to={`/task/${task._id}`}
      className="block bg-[#0e0e0e] border border-emerald-500/20 rounded-xl shadow-md hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:border-emerald-500/40 transition-all duration-300 p-5 group"
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors mb-2 line-clamp-1">
        {task.title}
      </h3>

      {/* Content preview */}
      <p className="text-gray-400 text-sm line-clamp-3 mb-3">{task.content}</p>

      {/* Meta info */}
      <div className="text-xs text-gray-500 space-y-1 mb-4">
        <p>
          <span className="font-medium text-gray-300">Status:</span>{" "}
          {task.status}
        </p>
        <p>
          <span className="font-medium text-gray-300">Priority:</span>{" "}
          {task.priority}
        </p>
        {task.dueDate && (
          <p>
            <span className="font-medium text-gray-300">Due:</span>{" "}
            {formatDate(new Date(task.dueDate))}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-emerald-500/10 pt-3">
        <span className="text-xs text-gray-500">
          Created {formatDate(new Date(task.createdAt))}
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/task/${task._id}`}
            className="text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <PenSquareIcon className="w-4 h-4" />
          </Link>
          <button
            className="text-gray-400 hover:text-red-500 transition-colors"
            onClick={(e) => handleDelete(e, task._id)}
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
