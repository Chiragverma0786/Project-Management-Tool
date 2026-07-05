const Task = require("../models/task");
const Project = require("../models/project");
const AppError = require("../utils/AppError");

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, projectId, priority } = req.body;

    if (!title || !projectId) {
      throw new AppError("Task title and projectId are required", 400);
    }

    const project = await Project.findOne({
      _id: projectId,
      user_id: req.user._id,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      priority, 
      project_id: projectId,
      user_id: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    const filter = { user_id: req.user._id };
    if (projectId) {
      filter.project_id = projectId;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { title, description, status, priority },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
