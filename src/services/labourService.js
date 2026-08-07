import API from "./api";

export const getLabours = () => API.get("/labours");

export const addLabour = (data) =>
  API.post("/labours", data);

export const updateLabour = (id, data) =>
  API.put(`/labours/${id}`, data);

export const deleteLabour = (id) =>
  API.delete(`/labours/${id}`);