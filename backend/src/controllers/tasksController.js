import Task from "../models/Task.js";

export async function getAllTasks(req, res) {
  try {
    // Extract query params
    const { status, priority, sortBy, order } = req.query;

    // Build filter dynamically
    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort dynamically
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sort = { createdAt: -1 }; // default: newest first
    }

    // Fetch tasks with filtering + sorting
    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getAllTasks controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found!" });
    res.json(task);
  } catch (error) {
    console.error("Error in getTaskById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTask(req, res) {
  try {
    const { title, content, status, dueDate, priority } = req.body;
    const task = new Task({
      title,
      content,
      status,
      dueDate,
      priority,
      user: req.user.id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error in createTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTask(req, res) {
  try {
    const { title, content, status, dueDate, priority } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, content, status, dueDate, priority },
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error in updateTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if logged-in user owns this task
    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}