import api from "./axios";

export const createProject = (data) => {
    return api.post("/projects/createProject", data);
};

export const getProjects = () => {
    return api.get("/projects/getProjects");
};

export const getProjectById = (id) => {
    return api.get(`/projects/getProjectById/${id}`);
};

export const updateProject = (id, data) => {
    return api.put(`/projects/updateProject/${id}`, data);
};

export const deleteProject = (id) => {
    return api.delete(`/projects/deleteProject/${id}`);
};
