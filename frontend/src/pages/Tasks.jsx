import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import { getProjectById } from "../api/projectApi";
import "../styles/Tasks.css";

const TASK_STATUSES = ["todo", "in-progress", "done"];
const TASK_PRIORITIES = ["Low", "Medium", "High"];

const formatStatus = (status) => {
  const statusMap = {
    "todo": "Todo",
    "in-progress": "In Progress",
    "done": "Done",
  };
  return statusMap[status] || status;
};

const Tasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { authLoading } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch project details
      const projectResponse = await getProjectById(projectId);
      setProject(projectResponse.data.project || projectResponse.data);

      // Fetch tasks for this project
      const tasksResponse = await getTasks(projectId);
      setTasks(tasksResponse.data.tasks || tasksResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch project and tasks");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const taskData = {
        ...formData,
        projectId,
      };

      if (editingId) {
        await updateTask(editingId, taskData);
      } else {
        await createTask(taskData);
      }

      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
      });
      setEditingId(null);
      setShowForm(false);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "Medium",
    });
    setEditingId(task.id || task._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteTask(id);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "Medium",
    });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setError("");
      const task = tasks.find((t) => t.id === taskId || t._id === taskId);
      if (!task) return;

      await updateTask(taskId, {
        ...task,
        status: newStatus,
      });
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
      console.error("Error updating task status:", err);
    }
  };

  if (authLoading || !project) {
    return <Loader />;
  }

  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "#34d399";
      case "in-progress":
        return "#f59e0b";
      case "todo":
        return "#8b8b96";
      default:
        return "#8b8b96";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#f87171";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#34d399";
      default:
        return "#8b8b96";
    }
  };

  return (
    <div className="tasks-page">
      <Navbar />
      <div className="tasks-container">
        <div className="tasks-header">
          <div className="tasks-header__back">
            <button
              className="btn-back"
              onClick={() => navigate("/projects")}
              title="Back to projects"
            >
              ← Projects
            </button>
            <div className="tasks-header__text">
              <span className="eyebrow">Project tasks</span>
              <h1>{project?.title || "Project"}</h1>
              {project?.description && (
                <p className="project-description-text">{project.description}</p>
              )}
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) handleCancel();
            }}
          >
            {showForm ? "Cancel" : "+ New task"}
          </button>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {showForm && (
          <form className="task-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit task" : "Create new task"}</h3>

            <div className="form-group">
              <label htmlFor="title">Task title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {TASK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  {TASK_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving…" : editingId ? "Update" : "Create"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading && !showForm && <Loader />}

        {tasks.length === 0 && !showForm && !loading ? (
          <div className="empty-state">
            <div className="empty-state__icon">✓</div>
            <p className="empty-state__title">No tasks yet</p>
            <p className="empty-state__sub">Create your first task to get started.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + New task
            </button>
          </div>
        ) : (
          <div className="tasks-board">
            {TASK_STATUSES.map((status) => (
              <div key={status} className="task-column">
                <div className="column-header">
                  <h3 className="column-title">{formatStatus(status)}</h3>
                  <span
                    className="column-count"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {tasksByStatus[status].length}
                  </span>
                </div>

                <div className="tasks-list">
                  {tasksByStatus[status].map((task) => (
                    <div key={task.id || task._id} className="task-card">
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                        <div className="task-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(task)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-icon--danger"
                            onClick={() => handleDelete(task.id || task._id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-meta">
                        <select
                          className="task-status-select"
                          value={task.status || "todo"}
                          onChange={(e) => handleStatusChange(task.id || task._id, e.target.value)}
                          title="Change status"
                        >
                          {TASK_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {formatStatus(st)}
                            </option>
                          ))}
                        </select>
                        <span
                          className="task-priority"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority || "Medium"}
                        </span>
                        {task.createdAt && (
                          <small className="task-date">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
