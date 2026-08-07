import API from "./api";

export const loginUser = (data) => API.post("/auth/login", data);

export const logoutUser = () => API.post("/auth/logout");

export const getCurrentUser = () => API.get("/auth/me");