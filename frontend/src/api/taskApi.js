import api from "./axios";

export const createTask = (data) => {
    return api.post("/tasks/createTask", data);
};

export const getTasks = (projectId) => {
    return api.get("/tasks/getTasks", {
        params: { projectId }
    });
};

export const getTaskById = (id) => {
    return api.get(`/tasks/getTaskById/${id}`);
};

export const updateTask = (id, data) => {
    return api.put(`/tasks/updateTask/${id}`, data);
};

export const deleteTask = (id) => {
    return api.delete(`/tasks/deleteTask/${id}`);
};
