import api from "./api";

// ================= Clients =================

export const getClients = () => {
  return api.get("/clients");
};

export const getClientById = (id) => {
  return api.get(`/clients/${id}`);
};

export const createClient = (data) => {
  return api.post("/clients", data);
};

export const updateClient = (id, data) => {
  return api.put(`/clients/${id}`, data);
};

export const deleteClient = (id) => {
  return api.delete(`/clients/${id}`);
};

// ================= Client Payments =================

export const receivePayment = (id, data) => {
  return api.post(`/clients/${id}/payment`, data);
};

export const getClientPayments = (id) => {
  return api.get(`/clients/${id}/payments`);
};

// ================= Client Ledger =================

export const getClientLedger = (id) => {
  return api.get(`/clients/${id}/ledger`);
};