import api from "./api";

// Get Complete Client Profile
export const getClientProfile = (id) => {
  return api.get(`/clients/${id}/profile`);
};

// Receive Client Payment
export const receiveClientPayment = (id, data) => {
  return api.post(`/clients/${id}/payment`, data);
};

// Get Client Ledger
export const getClientLedger = (id) => {
  return api.get(`/clients/${id}/ledger`);
};

// Get Client Payments
export const getClientPayments = (id) => {
  return api.get(`/clients/${id}/payments`);
};