import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import api from "../lib/axios";
import TaskCard from "../components/TaskCard";
import TasksNotFound from "../components/TasksNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters/sort
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (priorityFilter) params.append("priority", priorityFilter);
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);

      const res = await api.get(`/tasks?${params.toString()}`);
      let data = res.data;

      // Custom sort for priority
      if (sortBy === "priority") {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        data = data.sort((a, b) => {
          const aVal = priorityOrder[a.priority] || 0;
          const bVal = priorityOrder[b.priority] || 0;
          return order === "asc" ? aVal - bVal : bVal - aVal;
        });
      }

      setTasks(data);
      setIsRateLimited(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, sortBy, order]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <main className="max-w-7xl mx-auto px-5 pt-10 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-emerald-400 mb-2 tracking-tight">
            Your Tasks
          </h2>
          <p className="text-gray-400 text-sm">
            Organize and track your work with clarity ✨
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#111111] border border-emerald-500/20 rounded-xl shadow-md backdrop-blur-sm p-5 mb-10 flex flex-wrap gap-4 justify-center md:justify-between">
          <div className="flex flex-wrap gap-3 justify-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-sm bg-[#0f0f0f] border border-emerald-600 text-gray-100"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="select select-sm bg-[#0f0f0f] border border-emerald-600 text-gray-100"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-sm bg-[#0f0f0f] border border-emerald-600 text-gray-100"
            >
              <option value="createdAt">Newest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="select select-sm bg-[#0f0f0f] border border-emerald-600 text-gray-100"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <button
            className="btn btn-sm bg-transparent border border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 hover:shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all"
            onClick={() => {
              setStatusFilter("");
              setPriorityFilter("");
              setSortBy("createdAt");
              setOrder("desc");
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Loading / Tasks */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-emerald-500"></span>
          </div>
        )}

        {!loading && tasks.length === 0 && !isRateLimited && <TasksNotFound />}

        {!loading && tasks.length > 0 && !isRateLimited && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="hover:scale-[1.02] transition-transform duration-200"
              >
                <TaskCard task={task} setTasks={setTasks} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
