import api from "./api";

// 1. Create Production Run
export const createProductionRun = async (payload) => {
  const response = await api.post("/production", payload);
  return response.data;
};

// 2. Fetch Production Runs
export const getProductionRuns = async (params = {}) => {
  const response = await api.get("/production", { params });
  return response.data;
};

// 3. Fetch Single Production Run Details
export const getProductionRunById = async (id) => {
  const response = await api.get(`/production/${id}`);
  return response.data;
};

// 4. Update Production Run
export const updateProductionRun = async (id, payload) => {
  const response = await api.put(`/production/${id}`, payload);
  return response.data;
};

// 5. Delete Production Run
export const deleteProductionRun = async (id) => {
  const response = await api.delete(`/production/${id}`);
  return response.data;
};