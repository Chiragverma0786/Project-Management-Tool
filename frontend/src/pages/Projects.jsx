// Projects.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { getProjects, createProject, deleteProject, updateProject } from "../api/projectApi";
import "../styles/Projects.css";

const GRADIENTS = [
  ["#7c5cff", "#22d3ee"],
  ["#f472b6", "#fb923c"],
  ["#34d399", "#3b82f6"],
  ["#f59e0b", "#ef4444"],
  ["#a78bfa", "#ec4899"],
  ["#22d3ee", "#6366f1"],
];

const gradientFor = (str = "") => {
  const sum = str.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
};

const initialsFor = (title = "") =>
  title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const Projects = () => {
  const { isAuthenticated, loading: authLoading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProjects();
      setProjects(response.data.projects || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
      console.error("Error fetching projects:", err);
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
      setError("Project title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }

      setFormData({ title: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
      console.error("Error saving project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description || "",
    });
    setEditingId(project.id || project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
      console.error("Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  if (authLoading) {
    return <Loader />;
  }

  return (
    <div className="projects-page">
      <Navbar />
      <div className="projects-container">
        <div className="projects-header">
          <div className="projects-header__text">
            <span className="eyebrow">Workspace</span>
            <h1>Projects</h1>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) handleCancel();
            }}
          >
            {showForm ? "Cancel" : "+ New project"}
          </button>
        </div>

        {projects.length > 0 && (
          <div className="stats-row">
            <div className="stat-pill">
              <span className="stat-pill__value">{projects.length}</span>
              <span className="stat-pill__label">Total Projects</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Edit project" : "Create new project"}</h3>

            <div className="form-group">
              <label htmlFor="title">Project title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
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
                placeholder="Enter project description"
                rows="4"
              />
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

        {projects.length === 0 && !showForm && !loading ? (
          <div className="empty-state">
            <div className="empty-state__icon">◆</div>
            <p className="empty-state__title">No projects yet</p>
            <p className="empty-state__sub">Create your first project to get started.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + New project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => {
              const id = project.id || project._id;
              const [c1, c2] = gradientFor(project.title || id);
              return (
                <div
                  key={id}
                  className="project-card"
                >
                  <div className="project-card-header">
                    <div
                      className="project-avatar"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      {initialsFor(project.title)}
                    </div>
                    <div
                      className="project-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(project)}
                        title="Edit"
                        aria-label="Edit project"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-icon--danger"
                        onClick={() => handleDelete(id)}
                        title="Delete"
                        aria-label="Delete project"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="project-title" title={project.title}>
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  <div className="project-footer">
                    <button
                        className="btn-tasks"
                        onClick={() => navigate(`/projects/${id}`)}
                    >
                        View Tasks
                    </button>
                  </div>

                  {project.createdAt && (
                    <small className="project-meta">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;