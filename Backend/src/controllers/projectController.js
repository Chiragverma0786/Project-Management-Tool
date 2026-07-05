const Project = require("../models/project");
const AppError = require("../utils/AppError");

exports.createProject = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      throw new AppError("Project title is required", 400);
    }

    const project = await Project.create({
      title,
      description,
      user_id: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user_id: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
