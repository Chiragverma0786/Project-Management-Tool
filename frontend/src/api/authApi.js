import api from "./axios";

export const loginUser = (data) => {
    return api.post("/auth/login", data);
};

export const registerUser = (data) => {
    return api.post("/auth/signup", data);
};

export const checkUser = () => {
    return api.get("/auth/checkUser");
};